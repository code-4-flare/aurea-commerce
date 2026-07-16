# Aurea Commerce: Product Specification

## Problem

Aurea needs a polished Kenyan fashion storefront where customers can discover products, build a cart, provide delivery details, and pay reliably without transactional data leaking into the content-management system.

## Objective

Provide a production-ready commerce journey backed by editable Sanity catalog content, server-verified Paystack payments in KES, and durable Supabase order records that can safely drive fulfillment.

## Users and actors

- Customer: browses products, selects variants, checks out, and receives a trustworthy payment result.
- Content editor: maintains products, collections, navigation, campaigns, and policies in Sanity Studio.
- Operations team: uses verified order state for fulfillment and customer support.
- Paystack: initializes and reports payment status through callbacks, verification, and signed webhooks.
- Supabase: stores transactional order snapshots and the payment audit trail.

## Required behavior

1. Customers can browse active Sanity products and select valid size, color, and quantity variants.
2. Checkout validates Kenyan customer and delivery data and recalculates prices from server-trusted catalog data.
3. A pending Supabase order with immutable line-item snapshots is created before Paystack initialization.
4. Payment success is accepted only after server-side reference, KES currency, expected amount, and successful provider status verification.
5. Callback and webhook reconciliation are safe under retries and concurrent delivery.
6. Customers receive clear success, processing, and failure states without exposing secrets or provider payloads.
7. Fulfillment and customer notifications occur only after the order has transitioned to paid.

## Business rules

- Currency is KES and Paystack amounts are sent and compared in subunits.
- Client-submitted prices are never authoritative.
- Sanity is authoritative for catalog/editorial content, not transactional records.
- Supabase is authoritative for orders, order-item snapshots, and payment events.
- Service-role and payment-provider secret keys remain server-only.
- A payment retry or duplicated webhook must not produce duplicate fulfillment.

## Non-goals

- Storing orders, customers, or payment events in Sanity.
- Treating frontend cart state as a durable order record.
- Marking an order paid from an unsigned webhook or browser-provided status.
- Building a general-purpose ERP, warehouse, or accounting system in the storefront.

## Edge cases

- Paystack returns a pending, abandoned, reversed, or failed transaction.
- A successful provider response has the wrong amount, currency, or reference.
- Callback and webhook requests arrive simultaneously or more than once.
- Payment succeeds but recording the audit event or paid transition temporarily fails.
- A catalog price or variant changes between cart creation and checkout.
- Supabase or Paystack is temporarily unavailable.

## Acceptance criteria

- [x] AC-01: Active catalog content is read from Sanity and checkout pricing is recalculated server-side.
- [x] AC-02: Valid checkout creates a pending Supabase order and item snapshots before Paystack authorization.
- [x] AC-03: Paystack initialization uses the stored order number as its payment reference.
- [x] AC-04: Successful reconciliation validates reference, KES currency, exact subunit amount, and provider status.
- [x] AC-05: Signed webhook and callback flows persist payment audit events and safely converge on a paid order.
- [x] AC-06: Secrets remain server-only and transactional tables have RLS plus explicit grants.
- [ ] AC-07: A paid transition triggers idempotent fulfillment and customer notification processing.
- [ ] AC-08: Critical checkout and reconciliation paths have integration-level automated coverage.

## Open questions

- Which service will own fulfillment orchestration and retry handling?
- Which channel and provider will send order confirmations?
- What operations interface will staff use to review and advance order status?
