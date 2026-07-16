import { whatsappInquirySchema, zodFieldErrors } from "@/lib/checkout-schema";
import { CheckoutPricingError, createCheckoutQuote } from "@/lib/checkout-pricing";
import { buildWhatsAppUrl, createWhatsAppOrderMessage, withUtmParameters } from "@/lib/links";
import { absoluteSiteUrl } from "@/lib/site-url";
import { createWhatsAppInquiry, OrderPersistenceError } from "@/src/lib/orders/server";
import { sanityFetch } from "@/src/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/src/sanity/lib/queries";
import { mapSiteSettings } from "@/src/sanity/lib/site";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = whatsappInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Check the order details before continuing to WhatsApp.", fieldErrors: zodFieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    const [quote, siteSettingsDocument] = await Promise.all([
      createCheckoutQuote(parsed.data.cart),
      sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
    ]);
    const settings = mapSiteSettings(siteSettingsDocument);
    const validatedWhatsAppUrl = buildWhatsAppUrl(settings.studioWhatsappUrl, "");
    const order = await createWhatsAppInquiry(parsed.data, quote);
    const trackedStoreUrl = withUtmParameters(absoluteSiteUrl("/shop"), {
      utmSource: "whatsapp",
      utmMedium: "social",
      utmCampaign: "order_inquiry",
    });
    const message = createWhatsAppOrderMessage({
      orderNumber: order.order_number,
      total: quote.total,
      items: quote.items.map(item => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      trackedStoreUrl,
    });

    return NextResponse.json({
      orderNumber: order.order_number,
      whatsappUrl: buildWhatsAppUrl(validatedWhatsAppUrl, message),
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Inquiry data must be valid JSON." }, { status: 400 });
    }
    if (error instanceof CheckoutPricingError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof OrderPersistenceError) {
      console.error("WhatsApp inquiry persistence failed", { message: error.message });
      return NextResponse.json({ message: "Unable to save your WhatsApp inquiry. Please try again." }, { status: 500 });
    }

    console.error("WhatsApp inquiry creation failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ message: "Unable to prepare your WhatsApp order. Please try again." }, { status: 500 });
  }
}
