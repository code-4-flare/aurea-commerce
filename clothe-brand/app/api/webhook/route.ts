import { hasValidPaystackSignature, paystackWebhookSchema } from "@/lib/paystack-webhook";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature");

  if (!secret) {
    console.error("Paystack webhook received without PAYSTACK_SECRET_KEY configured.");
    return NextResponse.json({ message: "Payment service is not configured." }, { status: 503 });
  }
  if (!signature) {
    return NextResponse.json({ message: "Missing signature." }, { status: 401 });
  }

  const rawBody = await request.text();
  if (!hasValidPaystackSignature(rawBody, signature, secret)) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const event = paystackWebhookSchema.safeParse(body);
  if (!event.success) {
    return NextResponse.json({ message: "Invalid event payload." }, { status: 400 });
  }

  if (
    event.data.event === "charge.success" &&
    event.data.data.status === "success" &&
    event.data.data.currency === "KES"
  ) {
    // TODO(database): Find the pending order by reference, compare its expected
    // amount and KES currency, then atomically mark it paid. Store processed
    // event IDs/references so Paystack retries cannot fulfill an order twice.
    console.info("Verified Paystack charge event received:", event.data.data.reference);
  }

  return NextResponse.json({ received: true });
}
