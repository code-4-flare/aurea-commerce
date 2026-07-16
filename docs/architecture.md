# Architecture

## System context

The repository contains two deployable applications. The Next.js storefront serves shoppers and owns server-side checkout/payment orchestration. The Sanity Studio is deployed separately for catalog and editorial management. Supabase stores transactional commerce data, while Paystack processes KES payments.

## Components

| Component | Responsibility | Owner/source of truth |
|---|---|---|
| `clothe-brand/` | Next.js storefront, cart UI, checkout APIs, payment callbacks, webhook handling | Application code |
| `studio-clothe-brand/` | Standalone content-editing application and schema | Sanity schema/code |
| Sanity dataset | Products, variants, collections, navigation, campaigns, and policies | Content editors |
| Zustand cart | Ephemeral browser cart state | Customer browser |
| Supabase Postgres | Orders, immutable item snapshots, payment-event audit data | Transactional database |
| Paystack | Payment authorization and provider transaction status | Paystack API |

## Catalog data flow

1. Editors update catalog/editorial documents in Sanity Studio.
2. The storefront queries published Sanity content for browsing.
3. During checkout, the server fetches authoritative product prices and validates requested variants.
4. The browser-provided cart identifies products and selections but does not set prices.

## Checkout and payment data flow

1. The storefront validates customer, delivery, and cart input.
2. The server creates a trusted quote from Sanity data.
3. A pending order and immutable line-item snapshots are written to Supabase.
4. Paystack is initialized with the order number as the reference and the exact KES subunit amount.
5. A callback or signed webhook obtains provider state and writes a payment audit event.
6. A conditional database update transitions only a pending order to paid; concurrent requests converge safely.
7. Fulfillment and notifications must consume the paid transition idempotently; this is not implemented yet.

## Security and data constraints

- Paystack and Supabase service-role keys are server-only.
- Public Supabase tables use RLS and explicit least-privilege grants.
- Raw provider payloads are retained only in the service-role-protected payment audit table.
- Paid state requires exact reference, amount, currency, and successful status verification.
- Remote schema deployment and production mutations require explicit user authorization.
- Sanity remains outside the transactional payment trust boundary.

## Verification commands

```bash
# Storefront unit tests
npm --prefix clothe-brand test

# Storefront lint and production build
npm run lint:store
npm run build:store

# Studio production build
npm run build:studio

# Workflow installation/status
./agent-workflow.sh status
```

Database migrations live in `clothe-brand/supabase/migrations/`. Verify migrations against a local or explicitly authorized remote Supabase project before deployment.
