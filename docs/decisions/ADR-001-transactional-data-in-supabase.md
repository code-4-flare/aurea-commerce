# ADR-001: Keep Transactional Commerce Data in Supabase

Status: Accepted  
Date: 2026-07-16

## Context

Sanity is the project's catalog and editorial CMS. Checkout requires durable orders, immutable line-item snapshots, payment audit events, constrained state transitions, and safe concurrent webhook/callback processing. These transactional requirements do not fit the content model or payment trust boundary.

## Decision

- Keep catalog and editorial content in Sanity.
- Store orders, order-item snapshots, and payment events in Supabase Postgres.
- Access transactional tables only from server modules using the service role.
- Enable RLS on exposed tables and explicitly grant only required operations.
- Verify Paystack reference, KES amount, currency, and successful status before conditionally transitioning a pending order to paid.
- Build fulfillment as an idempotent consumer of the paid transition.

## Consequences

- The storefront coordinates data across Sanity, Supabase, and Paystack.
- Checkout must snapshot catalog data so later Sanity edits do not rewrite historical orders.
- Database migrations and payment reconciliation require dedicated security, concurrency, and integration testing.
- Content editors cannot use Sanity Studio as an order-management interface without a separate, purpose-built integration.

## Alternatives considered

- Store orders in Sanity: rejected because transactional integrity, access control, and concurrent state transitions are a poor fit.
- Trust Paystack/browser metadata without a local order: rejected because expected amounts and fulfillment idempotency require a durable internal source of truth.
