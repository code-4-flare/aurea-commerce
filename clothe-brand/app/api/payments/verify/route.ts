import { paymentReferenceSchema } from "@/lib/checkout-schema";
import { OrderPersistenceError } from "@/src/lib/orders/server";
import { verifyAndReconcilePayment } from "@/src/lib/payments/server";
import { PaystackError } from "@/lib/paystack";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const referenceResult = paymentReferenceSchema.safeParse(new URL(request.url).searchParams.get("reference"));

  if (!referenceResult.success) {
    return NextResponse.json(
      { success: false, paymentStatus: "failed", message: "A valid payment reference is required." },
      { status: 400 },
    );
  }

  try {
    const result = await verifyAndReconcilePayment(referenceResult.data);
    const status = result.success ? 200 : result.paymentStatus === "pending" ? 202 : 400;
    return NextResponse.json(result, { status });
  } catch (error) {
    if (error instanceof PaystackError) {
      console.error("Paystack verification request failed", { reference: referenceResult.data, message: error.message });
      return NextResponse.json(
        { success: false, paymentStatus: "pending", message: "Payment verification is temporarily unavailable." },
        { status: 502 },
      );
    }
    if (error instanceof OrderPersistenceError) {
      console.error("Payment persistence failed", { reference: referenceResult.data, message: error.message });
      return NextResponse.json(
        { success: false, paymentStatus: "pending", message: "Payment status could not be saved." },
        { status: 500 },
      );
    }

    console.error("Unexpected payment verification error", {
      reference: referenceResult.data,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, paymentStatus: "pending", message: "Payment verification failed." },
      { status: 500 },
    );
  }
}
