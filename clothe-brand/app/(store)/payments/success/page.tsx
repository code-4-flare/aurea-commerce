import ClearCartOnPayment from "@/components/clear-cart-on-payment";
import PaymentResultShell from "@/components/payment-result-shell";
import { resolvePaymentReference } from "@/lib/checkout-schema";
import { formatKES } from "@/lib/utils";
import { findOrderByReference } from "@/src/lib/orders/server";
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

  let order: Awaited<ReturnType<typeof findOrderByReference>>;
  try {
    order = await findOrderByReference(reference);
  } catch (error) {
    console.error("Paid order lookup failed", {
      reference,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    redirect(`/payments/failed?reference=${encodeURIComponent(reference)}&reason=verification_failed`);
  }
  if (!order) redirect(`/payments/failed?reference=${encodeURIComponent(reference)}&reason=verification_failed`);
  if (order.payment_status !== "paid") redirect(`/payment/callback?reference=${encodeURIComponent(reference)}`);

  return (
    <>
      <ClearCartOnPayment />
      <PaymentResultShell
        tone="success"
        eyebrow="Transaction complete"
        title="Your payment is confirmed."
        description="Your payment and order have been recorded. Keep the order number below in case you need help from the Aurea customer experience team."
        reference={reference}
        details={[
          { label: "Order number", value: order.order_number },
          { label: "Payment status", value: "Paid" },
          { label: "Amount", value: formatKES(order.total) },
        ]}
        primaryAction={{ href: "/shop", label: "Continue shopping" }}
        secondaryAction={{ href: "/contact", label: "Contact Aurea" }}
      />
    </>
  );
}
