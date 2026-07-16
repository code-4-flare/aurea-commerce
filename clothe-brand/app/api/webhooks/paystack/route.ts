import { hasValidPaystackSignature, paystackWebhookSchema } from "@/lib/paystack-webhook";
import type { ApiErrorResponse, WebhookSuccessResponse } from "@/lib/api-contracts";
import { reconcilePaystackWebhook } from "@/src/lib/payments/server";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<ApiErrorResponse | WebhookSuccessResponse>> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature");

  if (!secret) {
    console.error("Paystack webhook rejected: secret key is not configured");
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

  try {
    await reconcilePaystackWebhook(body, event.data);
  } catch (error) {
    console.error("Paystack webhook persistence failed", {
      reference: event.data.data.reference,
      event: event.data.event,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ message: "Webhook could not be persisted." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
