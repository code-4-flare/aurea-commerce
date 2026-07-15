import crypto from "crypto";
import { z } from "zod";

export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z
    .object({
      id: z.union([z.number(), z.string()]),
      reference: z.string().min(1),
      status: z.string(),
      amount: z.number().int().nonnegative(),
      currency: z.string(),
    })
    .loose(),
});

export function hasValidPaystackSignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}
