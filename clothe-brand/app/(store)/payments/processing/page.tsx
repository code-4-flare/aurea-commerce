import PaymentResultShell from "@/components/payment-result-shell";
import { resolvePaymentReference } from "@/lib/checkout-schema";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Payment Processing | Aurea Nairobi" };
export const dynamic = "force-dynamic";

export default async function PaymentProcessingPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const reference = resolvePaymentReference(await searchParams);
  if (!reference) redirect("/payments/failed?reason=missing_reference");

  return (
    <PaymentResultShell
      tone="processing"
      eyebrow="Payment received"
      title="Your confirmation is still in motion."
      description="Paystack has not returned a final status yet. This can happen while M-Pesa authorization is completing. Do not start another payment until you check this transaction again."
      reference={reference}
      primaryAction={{ href: `/payments/callback?reference=${encodeURIComponent(reference)}`, label: "Check payment again" }}
      secondaryAction={{ href: "/shop", label: "Return to shop" }}
    />
  );
}
