import ClearCartOnPayment from "@/components/clear-cart-on-payment";
import PaymentResultShell from "@/components/payment-result-shell";
import { resolvePaymentReference } from "@/lib/checkout-schema";
import { resolvePaymentStatus, verifyPaystackTransaction } from "@/lib/paystack";
import { formatKES } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Payment Verified | Aurea Nairobi" };
export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const reference = resolvePaymentReference(await searchParams);
  if (!reference) redirect("/payments/failed?reason=missing_reference");

  let transaction;
  try {
    transaction = await verifyPaystackTransaction(reference);
  } catch (error) {
    console.error("Payment success verification error:", error);
    redirect(`/payments/failed?reference=${encodeURIComponent(reference)}&reason=verification_failed`);
  }

  const resolution = resolvePaymentStatus(transaction);
  if (resolution === "processing") redirect(`/payments/processing?reference=${encodeURIComponent(reference)}`);
  if (resolution === "failed") redirect(`/payments/failed?reference=${encodeURIComponent(reference)}&reason=payment_failed`);

  return (
    <>
      <ClearCartOnPayment />
      <PaymentResultShell
        tone="success"
        eyebrow="Transaction complete"
        title="Your payment is confirmed."
        description="Paystack has verified the transaction. Keep the reference below with your payment receipt in case you need help from the Aurea customer experience team."
        reference={transaction.reference}
        details={[
          { label: "Amount", value: formatKES(transaction.amount / 100) },
          { label: "Channel", value: transaction.channel ? transaction.channel.replaceAll("_", " ") : "Paystack" },
        ]}
        primaryAction={{ href: "/shop", label: "Continue shopping" }}
        secondaryAction={{ href: "/contact", label: "Contact Aurea" }}
      />
    </>
  );
}
