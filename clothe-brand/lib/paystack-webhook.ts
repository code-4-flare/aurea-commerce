import crypto from "crypto";
import { z } from "zod";

import { paystackTransactionStatuses } from "../types/payment.ts";

export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z
    .object({
      id: z.union([z.number(), z.string()]),
      reference: z.string().min(1),
      status: z.enum(paystackTransactionStatuses),
      amount: z.number().int().nonnegative(),
      currency: z.string(),
    })
    .loose(),
});

export type PaystackWebhookEvent = z.infer<typeof paystackWebhookSchema>;

export function hasValidPaystackSignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}
