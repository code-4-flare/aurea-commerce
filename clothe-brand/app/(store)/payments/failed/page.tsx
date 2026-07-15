import PaymentResultShell from "@/components/payment-result-shell";
import { paymentReferenceSchema } from "@/lib/checkout-schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Not Verified | Aurea Nairobi" };

const failureCopy = {
  missing_reference: {
    title: "We could not identify this payment.",
    description: "The return link did not contain a valid Paystack reference. No payment has been confirmed on this page.",
  },
  verification_failed: {
    title: "We could not confirm the transaction.",
    description: "The payment provider could not be reached or returned an invalid response. Keep your reference and try checking again before starting another payment.",
  },
  payment_failed: {
    title: "The payment was not completed.",
    description: "Paystack did not confirm this transaction as successful. You can return to checkout and try again when you are ready.",
  },
} as const;

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[]; reason?: string | string[] }>;
}) {
  const params = await searchParams;
  const referenceValue = Array.isArray(params.reference) ? params.reference[0] : params.reference;
  const referenceResult = paymentReferenceSchema.safeParse(referenceValue);
  const reference = referenceResult.success ? referenceResult.data : undefined;
  const reasonValue = Array.isArray(params.reason) ? params.reason[0] : params.reason;
  const reason = reasonValue && reasonValue in failureCopy ? (reasonValue as keyof typeof failureCopy) : "payment_failed";
  const copy = failureCopy[reason];

  return (
    <PaymentResultShell
      tone="failed"
      eyebrow="Transaction incomplete"
      title={copy.title}
      description={copy.description}
      reference={reference}
      primaryAction={
        reference && reason === "verification_failed"
          ? { href: `/payments/callback?reference=${encodeURIComponent(reference)}`, label: "Check payment again" }
          : { href: "/checkout", label: "Return to checkout" }
      }
      secondaryAction={{ href: "/contact", label: "Contact Aurea" }}
    />
  );
}
