import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import { checkoutInitializationResponseSchema, readApiResponse } from "../lib/api-contracts.ts";
import { checkoutProductsSchema } from "../lib/catalog-contracts.ts";
import { checkoutSchema, resolvePaymentReference, whatsappInquirySchema } from "../lib/checkout-schema.ts";
import { buildWhatsAppUrl, createWhatsAppOrderMessage, isPrivateStorePath, withUtmParameters } from "../lib/links.ts";
import { generateOrderNumber, paystackAmountFor, paymentMatchesOrder } from "../lib/order-utils.ts";
import { hasValidPaystackSignature, paystackWebhookSchema } from "../lib/paystack-webhook.ts";

const validCheckout = {
  customer: {
    fullName: "Amina Wanjiru",
    email: "amina@example.com",
    phone: "+254712345678",
  },
  delivery: {
    county: "Nairobi",
    town: "Westlands",
    address: "General Mathenge Road",
    notes: "Call before arrival",
  },
  cart: [{ productId: "rib-polo", size: "M", color: "Espresso", quantity: 2 }],
};

test("checkout API responses are parsed from unknown JSON", async () => {
  const response = Response.json({
    authorizationUrl: "https://checkout.paystack.com/example",
    reference: "trx-123",
    orderNumber: "AUR-20260716-A9F2",
  });

  const result = await readApiResponse(response, checkoutInitializationResponseSchema);

  assert.equal("authorizationUrl" in result, true);
});

test("checkout API parsing rejects malformed response JSON", async () => {
  const response = Response.json({ authorizationUrl: "not-a-url" });

  await assert.rejects(
    readApiResponse(response, checkoutInitializationResponseSchema),
    /server returned an invalid response/i,
  );
});

test("checkout pricing rejects malformed Sanity product projections", () => {
  const malformedProduct = [{
    productDocumentId: "product-1",
    id: "rib-polo",
    title: "Rib Polo",
    price: "13500",
    productImage: null,
    colors: ["Espresso"],
    sizes: ["M"],
  }];

  assert.equal(checkoutProductsSchema.safeParse(malformedProduct).success, false);
});

test("checkout schema accepts valid customer, delivery, and cart data", () => {
  assert.equal(checkoutSchema.safeParse(validCheckout).success, true);
});

test("checkout schema requires a valid email and Kenyan phone number", () => {
  const result = checkoutSchema.safeParse({
    ...validCheckout,
    customer: { ...validCheckout.customer, email: "", phone: "555-123" },
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const paths = result.error.issues.map(issue => issue.path.join("."));
    assert(paths.includes("customer.email"));
    assert(paths.includes("customer.phone"));
  }
});

test("checkout schema normalizes a commonly formatted Kenyan phone number", () => {
  const result = checkoutSchema.safeParse({
    ...validCheckout,
    customer: { ...validCheckout.customer, phone: "0712 345 678" },
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.customer.phone, "0712345678");
});

test("checkout schema rejects empty carts and excessive quantities", () => {
  assert.equal(checkoutSchema.safeParse({ ...validCheckout, cart: [] }).success, false);
  assert.equal(
    checkoutSchema.safeParse({ ...validCheckout, cart: [{ ...validCheckout.cart[0], quantity: 11 }] }).success,
    false,
  );
});

test("callback reference accepts reference or trxref and rejects mismatches", () => {
  assert.equal(resolvePaymentReference({ reference: "trx-123" }), "trx-123");
  assert.equal(resolvePaymentReference({ trxref: "trx-123" }), "trx-123");
  assert.equal(resolvePaymentReference({ reference: "trx-123", trxref: "other" }), null);
  assert.equal(resolvePaymentReference({ reference: "invalid/reference" }), null);
});

test("Paystack webhook signature and event shape are validated", () => {
  const secret = "sk_test_webhook_secret";
  const rawBody = JSON.stringify({
    event: "charge.success",
    data: { id: 72, reference: "trx-123", status: "success", amount: 12500, currency: "KES" },
  });
  const signature = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  assert.equal(hasValidPaystackSignature(rawBody, signature, secret), true);
  assert.equal(hasValidPaystackSignature(rawBody, "invalid", secret), false);
  assert.equal(paystackWebhookSchema.safeParse(JSON.parse(rawBody)).success, true);
  assert.equal(paystackWebhookSchema.safeParse({ event: "charge.success", data: {} }).success, false);
  assert.equal(
    paystackWebhookSchema.safeParse({
      event: "charge.success",
      data: { id: 72, reference: "trx-123", status: "unknown", amount: 12500, currency: "KES" },
    }).success,
    false,
  );
});

test("order numbers and Paystack subunit amounts are deterministic", () => {
  assert.equal(generateOrderNumber(new Date("2026-07-15T12:00:00Z"), "A9F2"), "AUR-20260715-A9F2");
  assert.equal(paystackAmountFor(13_500), 1_350_000);
  assert.throws(() => paystackAmountFor(10.5));
  assert.throws(() => paystackAmountFor(Number.MAX_SAFE_INTEGER));
});

test("successful payment must match the stored order amount and currency", () => {
  const order = { total: 13_500, currency: "KES" };

  assert.equal(paymentMatchesOrder({ status: "success", currency: "KES", amount: 1_350_000 }, order), true);
  assert.equal(paymentMatchesOrder({ status: "success", currency: "KES", amount: 1_349_900 }, order), false);
  assert.equal(paymentMatchesOrder({ status: "success", currency: "NGN", amount: 1_350_000 }, order), false);
  assert.equal(paymentMatchesOrder({ status: "failed", currency: "KES", amount: 1_350_000 }, order), false);
});

test("WhatsApp inquiries accept cart-only or complete checkout details", () => {
  assert.equal(whatsappInquirySchema.safeParse({ cart: validCheckout.cart }).success, true);
  assert.equal(whatsappInquirySchema.safeParse(validCheckout).success, true);
  assert.equal(
    whatsappInquirySchema.safeParse({ cart: validCheckout.cart, customer: validCheckout.customer }).success,
    false,
  );
  assert.equal(whatsappInquirySchema.safeParse({ cart: [] }).success, false);
});

test("UTM helpers preserve links and exclude Studio from public navigation", () => {
  assert.equal(
    withUtmParameters("/shop?collection=linen#pieces", {
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "new_arrivals",
    }),
    "/shop?collection=linen&utm_source=instagram&utm_medium=social&utm_campaign=new_arrivals#pieces",
  );
  assert.equal(isPrivateStorePath("/studio"), true);
  assert.equal(isPrivateStorePath("https://shop.example/studio/products"), true);
  assert.equal(isPrivateStorePath("/shop"), false);
});

test("WhatsApp helpers validate the destination and encode order context", () => {
  const message = createWhatsAppOrderMessage({
    orderNumber: "AUR-20260716-A9F2",
    total: 13_500,
    items: [{ name: "Rib Polo", size: "M", color: "Espresso", quantity: 2 }],
    trackedStoreUrl: "https://aurea.example/shop?utm_source=whatsapp",
  });
  const url = buildWhatsAppUrl("https://wa.me/254700000000", message);

  assert.match(message, /AUR-20260716-A9F2/);
  assert.match(message, /Rib Polo/);
  assert.equal(new URL(url).searchParams.get("text"), message);
  assert.throws(() => buildWhatsAppUrl("https://example.com/contact", message));
});
