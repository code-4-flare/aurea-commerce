import { resolvePaymentReference } from "@/lib/checkout-schema";
import { verifyAndReconcilePayment } from "@/src/lib/payments/server";
import { redirect } from "next/navigation";

type PaymentCallbackProps = {
  searchParams: Promise<{ reference?: string | string[]; trxref?: string | string[] }>;
};

export const dynamic = "force-dynamic";

function resultUrl(path: "success" | "processing" | "failed", reference?: string, reason?: string) {
  const params = new URLSearchParams();
  if (reference) params.set("reference", reference);
  if (reason) params.set("reason", reason);
  return `/payments/${path}?${params.toString()}`;
}

export default async function PaymentCallbackPage({ searchParams }: PaymentCallbackProps) {
  const reference = resolvePaymentReference(await searchParams);

  if (!reference) redirect(resultUrl("failed", undefined, "missing_reference"));

  let result;
  try {
    result = await verifyAndReconcilePayment(reference);
  } catch (error) {
    console.error("Payment callback reconciliation failed", {
      reference,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    redirect(resultUrl("failed", reference, "verification_failed"));
  }

  if (result.success) redirect(resultUrl("success", reference));
  if (result.paymentStatus === "pending") redirect(resultUrl("processing", reference));
  redirect(resultUrl("failed", reference, "payment_failed"));
}
