import { checkoutSchema, zodFieldErrors } from "@/lib/checkout-schema";
import type { CheckoutInitializationResponse } from "@/lib/api-contracts";
import { CheckoutPricingError, createCheckoutQuote } from "@/lib/checkout-pricing";
import { paystackAmountFor } from "@/lib/order-utils";
import { initializePaystackTransaction, PaystackError } from "@/lib/paystack";
import {
  attachPaystackTransaction,
  createPendingOrder,
  markOrderInitializationFailed,
  OrderPersistenceError,
} from "@/src/lib/orders/server";
import type { PaymentOrder } from "@/types/orders";
import { NextResponse } from "next/server";

function callbackUrl(request: Request) {
  const configuredSiteUrl = process.env.SITE_URL;
  const baseUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : new URL(request.url);
  return new URL("/payments/callback", baseUrl.origin).toString();
}

export async function POST(request: Request): Promise<NextResponse<CheckoutInitializationResponse>> {
  let pendingOrder: PaymentOrder | undefined;

  try {
    const body: unknown = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Check the highlighted checkout details and try again.",
          fieldErrors: zodFieldErrors(parsed.error),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const quote = await createCheckoutQuote(payload.cart);
    pendingOrder = await createPendingOrder(payload, quote);

    const transaction = await initializePaystackTransaction({
      email: payload.customer.email,
      amount: paystackAmountFor(quote.total),
      callbackUrl: callbackUrl(request),
      reference: pendingOrder.order_number,
      metadata: {
        source: "aurea-commerce",
        order_id: pendingOrder.id,
        order_number: pendingOrder.order_number,
      },
    });

    await attachPaystackTransaction(pendingOrder.id, transaction.reference, transaction.access_code);

    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
      reference: transaction.reference,
      orderNumber: pendingOrder.order_number,
    });
  } catch (error) {
    if (pendingOrder) await markOrderInitializationFailed(pendingOrder.id);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Checkout data must be valid JSON." }, { status: 400 });
    }
    if (error instanceof CheckoutPricingError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof OrderPersistenceError) {
      console.error("Order persistence error", { message: error.message, orderId: pendingOrder?.id });
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    if (error instanceof PaystackError) {
      console.error("Paystack initialization error", { message: error.message, orderId: pendingOrder?.id });
      return NextResponse.json({ message: "Unable to initialize payment. Please try again." }, { status: 502 });
    }

    console.error("Checkout initialization error", {
      message: error instanceof Error ? error.message : "Unknown error",
      orderId: pendingOrder?.id,
    });
    return NextResponse.json({ message: "Something went wrong while initializing payment." }, { status: 500 });
  }
}
