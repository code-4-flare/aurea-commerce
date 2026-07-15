import { z } from "zod";

const paystackInitializeSchema = z.object({
  status: z.literal(true),
  message: z.string(),
  data: z.object({
    authorization_url: z.url(),
    access_code: z.string().min(1),
    reference: z.string().min(1),
  }),
});

const transactionStatusSchema = z.enum(["abandoned", "failed", "ongoing", "pending", "processing", "queued", "reversed", "success"]);

const paystackVerificationSchema = z.object({
  status: z.literal(true),
  message: z.string(),
  data: z.object({
    id: z.union([z.number(), z.string()]),
    status: transactionStatusSchema,
    reference: z.string(),
    amount: z.number().int().nonnegative(),
    currency: z.string(),
    channel: z.string().nullable().optional(),
    gateway_response: z.string().nullable().optional(),
    paid_at: z.string().nullable().optional(),
    metadata: z.unknown().optional(),
  }),
});

const paystackErrorSchema = z.object({ message: z.string().optional() }).loose();

export type PaystackVerification = z.infer<typeof paystackVerificationSchema>["data"];
export type PaymentResolution = "success" | "processing" | "failed";

export class PaystackError extends Error {}

function secretKey() {
  const value = process.env.PAYSTACK_SECRET_KEY;
  if (!value) throw new PaystackError("Payment service is not configured.");
  return value;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new PaystackError("The payment provider returned an invalid response.");
  }
}

export async function initializePaystackTransaction(input: {
  email: string;
  amount: number;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      currency: "KES",
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
  const body = await readJson(response);
  const parsed = paystackInitializeSchema.safeParse(body);

  if (!response.ok || !parsed.success) {
    const providerError = paystackErrorSchema.safeParse(body);
    throw new PaystackError(providerError.success && providerError.data.message ? providerError.data.message : "Unable to initialize payment.");
  }

  return parsed.data.data;
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerification> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });
  const body = await readJson(response);
  const parsed = paystackVerificationSchema.safeParse(body);

  if (!response.ok || !parsed.success) {
    const providerError = paystackErrorSchema.safeParse(body);
    throw new PaystackError(providerError.success && providerError.data.message ? providerError.data.message : "Unable to verify payment.");
  }

  return parsed.data.data;
}

export function resolvePaymentStatus(transaction: PaystackVerification): PaymentResolution {
  if (["ongoing", "pending", "processing", "queued"].includes(transaction.status)) return "processing";
  if (transaction.status === "success") {
    const metadata = transaction.metadata;
    const belongsToAurea = typeof metadata === "object" && metadata !== null && "source" in metadata && metadata.source === "aurea-commerce";
    return transaction.currency === "KES" && belongsToAurea ? "success" : "failed";
  }
  return "failed";
}
