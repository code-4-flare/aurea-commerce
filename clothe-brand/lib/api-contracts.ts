import { z } from "zod";

export const apiErrorResponseSchema = z.object({
  message: z.string(),
  fieldErrors: z.record(z.string(), z.string()).optional(),
});

export const checkoutInitializationSuccessSchema = z.object({
  authorizationUrl: z.url(),
  reference: z.string().min(1),
  orderNumber: z.string().min(1),
});

export const checkoutInitializationResponseSchema = z.union([
  checkoutInitializationSuccessSchema,
  apiErrorResponseSchema,
]);

export const whatsappInquirySuccessSchema = z.object({
  orderNumber: z.string().min(1),
  whatsappUrl: z.url(),
});

export const whatsappInquiryResponseSchema = z.union([
  whatsappInquirySuccessSchema,
  apiErrorResponseSchema,
]);

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type CheckoutInitializationSuccess = z.infer<typeof checkoutInitializationSuccessSchema>;
export type CheckoutInitializationResponse = z.infer<typeof checkoutInitializationResponseSchema>;
export type WhatsAppInquirySuccess = z.infer<typeof whatsappInquirySuccessSchema>;
export type WhatsAppInquiryResponse = z.infer<typeof whatsappInquiryResponseSchema>;
export type WebhookSuccessResponse = { received: true };

export async function readApiResponse<Schema extends z.ZodType>(
  response: Response,
  schema: Schema,
): Promise<z.infer<Schema>> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new Error("The server returned an invalid response.");
  return parsed.data;
}
