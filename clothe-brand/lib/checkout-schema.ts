import { z } from "zod";

export const checkoutCounties = [
  "Nairobi",
  "Mombasa",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Nakuru",
  "Kisumu",
  "Uasin Gishu",
  "Lamu",
] as const;

const requiredText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} is required.`).max(maximum, `${label} is too long.`);

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: requiredText("Full name", 100).min(2, "Enter your full name."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .transform(value => value.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^(?:\+?254|0)(?:1|7)\d{8}$/, "Enter a valid Kenyan phone number.")),
  }),
  delivery: z.object({
    county: z.enum(checkoutCounties, { error: "Select a delivery county." }),
    town: requiredText("Town or area", 100),
    address: requiredText("Street address", 180),
    notes: z.string().trim().max(500, "Delivery notes must be 500 characters or fewer.").optional().default(""),
  }),
  cart: z
    .array(
      z.object({
        productId: requiredText("Product", 120),
        size: requiredText("Size", 60),
        color: requiredText("Color", 80),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(50, "Your cart contains too many items."),
});

export const paymentReferenceSchema = z
  .string()
  .trim()
  .min(1, "Payment reference is required.")
  .max(120, "Payment reference is invalid.")
  .regex(/^[A-Za-z0-9.=-]+$/, "Payment reference is invalid.");

export type CheckoutPayload = z.infer<typeof checkoutSchema>;

export function zodFieldErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const path = issue.path.join(".");
    if (path && !errors[path]) errors[path] = issue.message;
    return errors;
  }, {});
}

export function resolvePaymentReference(params: { reference?: string | string[]; trxref?: string | string[] }) {
  const reference = Array.isArray(params.reference) ? params.reference[0] : params.reference;
  const trxref = Array.isArray(params.trxref) ? params.trxref[0] : params.trxref;

  if (reference && trxref && reference !== trxref) return null;

  const parsed = paymentReferenceSchema.safeParse(reference || trxref);
  return parsed.success ? parsed.data : null;
}
