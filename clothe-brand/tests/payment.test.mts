import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import { checkoutSchema, resolvePaymentReference } from "../lib/checkout-schema.ts";
import { resolvePaymentStatus } from "../lib/paystack.ts";
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

test("Paystack statuses resolve to final and processing states", () => {
  const transaction = {
    id: 42,
    reference: "trx-123",
    amount: 12_500,
    currency: "KES",
    channel: "card",
    metadata: { source: "aurea-commerce" },
  } as const;

  assert.equal(resolvePaymentStatus({ ...transaction, status: "success" }), "success");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "pending" }), "processing");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "ongoing" }), "processing");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "failed" }), "failed");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "abandoned" }), "failed");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "success", currency: "NGN" }), "failed");
  assert.equal(resolvePaymentStatus({ ...transaction, status: "success", metadata: {} }), "failed");
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
});
