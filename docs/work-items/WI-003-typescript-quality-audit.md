# WI-003: Strengthen TypeScript domain and API contracts

Status: Completed
Created: 2026-07-16

## Objective

Improve TypeScript clarity and runtime safety at commerce, API, Sanity, Supabase, and Paystack seams without changing storefront design or established business behavior.

## Context

The storefront already uses strict TypeScript and contains no explicit `any`, double assertions, or suppression comments. The audit found that unsafe values still enter through untyped JSON parsing and asserted Sanity/API responses, while persisted order statuses and payment reconciliation results are broader than the domain allows.

## Required changes

- Give Product, CartItem, CheckoutPayload, Order, OrderItem, and PaymentVerificationResult clear canonical definitions.
- Replace broad order/payment strings with the values allowed by the database and provider contracts.
- Make payment verification a readable discriminated union.
- Define shared request/response contracts for checkout and WhatsApp API routes.
- Parse client API responses and trusted checkout catalog projections at runtime.
- Replace asserted Sanity query results with explicit generic result types.
- Preserve payment verification, order persistence, pricing, routing, and UI behavior.

## Out of scope

- UI or content redesign.
- Database schema or migration changes.
- Authentication, new payment behavior, or new checkout features.
- Generated database types or a new code-generation pipeline.
- New dependencies.

## Acceptance criteria

- [x] AC-01: Application code contains no explicit `any`, double assertions, or unexplained TypeScript suppression.
- [x] AC-02: Requested commerce and transactional types have one clear canonical definition each.
- [x] AC-03: Payment verification callers narrow an exhaustive discriminated union rather than correlating booleans and strings.
- [x] AC-04: Checkout and WhatsApp clients validate unknown API JSON before using it.
- [x] AC-05: Sanity checkout pricing validates its unknown projection before calculating trusted totals.
- [x] AC-06: API handlers expose typed success/error responses and preserve existing status codes and messages.
- [x] AC-07: Focused tests, typecheck, lint, and production build pass with no new dependency.

## Verification

```bash
npm --prefix clothe-brand test
cd clothe-brand && ./node_modules/.bin/tsc --noEmit
npm run lint:store
npm run build:store
```

## Definition of done

- [x] Implementation and tests satisfy every acceptance criterion.
- [x] No UI or business behavior changed.
- [x] Workflow/current-state documentation records actual results and residual risks.

## Actual evidence

- Audit search found no explicit `any`, double assertion, TypeScript suppression, or asserted API/Sanity response remaining in application code.
- `Product` and `CartItem` live in `types/commerce.ts`; `CheckoutPayload` remains inferred from its Zod schema and is re-exported by `types/checkout.ts`; persisted `Order` and `OrderItem` live in `types/orders.ts`; `PaymentVerificationResult` lives in `types/payment.ts`.
- Payment callback routing exhaustively switches over `paid`, `pending`, and `failed` results.
- Checkout and WhatsApp clients use shared runtime response schemas; Paystack JSON is explicitly `unknown`; the Sanity checkout pricing projection is parsed before trusted totals are calculated.
- `npm --prefix clothe-brand test`: 14/14 tests passed, including malformed API, catalog, and webhook payload coverage.
- `cd clothe-brand && ./node_modules/.bin/tsc --noEmit`: passed.
- `npm run lint:store`: passed.
- `npm run build:store`: passed; 30 pages generated.
- No package or lockfile changed and no dependency was added.

## Residual risks

- Sanity editorial projections remain structurally typed and mapped through tolerant fallback functions; only the checkout pricing projection receives strict runtime validation because it affects trusted totals.
- Supabase types are maintained manually against the versioned migrations. Generated database types may become worthwhile if the transactional schema grows substantially, but would add a code-generation workflow that is unnecessary at the current size.
