import { checkoutSchema, zodFieldErrors } from "@/lib/checkout-schema";
import { CheckoutPricingError, createCheckoutQuote } from "@/lib/checkout-pricing";
import { initializePaystackTransaction, PaystackError } from "@/lib/paystack";
import { NextResponse } from "next/server";

function callbackUrl(request: Request) {
  const configuredSiteUrl = process.env.SITE_URL;
  const baseUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : new URL(request.url);
  return new URL("/payments/callback", baseUrl.origin).toString();
}

export async function POST(request: Request) {
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
    const transaction = await initializePaystackTransaction({
      email: payload.customer.email,
      amount: Math.round(quote.total * 100),
      callbackUrl: callbackUrl(request),
      metadata: {
        source: "aurea-commerce",
        customer_name: payload.customer.fullName,
        phone: payload.customer.phone,
        delivery_county: payload.delivery.county,
        delivery_town: payload.delivery.town,
        delivery_address: payload.delivery.address,
        delivery_notes: payload.delivery.notes,
        delivery_fee: quote.deliveryFee,
        cart_items: quote.items.map(item => ({
          product_id: item.productId,
          name: item.name,
          price: item.unitPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      },
    });

    // TODO(database): Persist a pending order before initialization and use its
    // unique reference to reconcile callback and webhook results idempotently.
    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
      accessCode: transaction.access_code,
      reference: transaction.reference,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Checkout data must be valid JSON." }, { status: 400 });
    }
    if (error instanceof CheckoutPricingError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof PaystackError) {
      console.error("Paystack initialize error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 502 });
    }

    console.error("Checkout initialize error:", error);
    return NextResponse.json({ message: "Something went wrong while initializing payment." }, { status: 500 });
  }
}
