import { resolvePaymentReference } from "@/lib/checkout-schema";
import { resolvePaymentStatus, verifyPaystackTransaction } from "@/lib/paystack";
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

  let resolution;
  try {
    const transaction = await verifyPaystackTransaction(reference);
    resolution = resolvePaymentStatus(transaction);
  } catch (error) {
    console.error("Payment callback verification error:", error);
    redirect(resultUrl("failed", reference, "verification_failed"));
  }

  if (resolution === "success") redirect(resultUrl("success", reference));
  if (resolution === "processing") redirect(resultUrl("processing", reference));
  redirect(resultUrl("failed", reference, "payment_failed"));
}
