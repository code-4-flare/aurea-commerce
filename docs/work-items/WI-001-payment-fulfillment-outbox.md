# WI-001: Add idempotent paid-order fulfillment outbox

Status: Proposed  
Created: 2026-07-16

## Objective

Persist exactly one dispatchable fulfillment event when an order first transitions from pending payment to paid, without sending a customer message or calling an external fulfillment provider in this work item.

## Context

Paystack callbacks and webhooks can arrive concurrently or be retried. The order transition is currently concurrency-safe, but no durable handoff exists for fulfillment or customer notifications. An outbox record created in the same database transaction as the first paid transition provides a reliable boundary for later workers.

## Inputs

- `AGENTS.md`
- `docs/product-spec.md` AC-07
- `docs/architecture.md` checkout and payment data flow
- `docs/decisions/ADR-001-transactional-data-in-supabase.md`
- `clothe-brand/src/lib/orders/server.ts`
- `clothe-brand/src/lib/payments/server.ts`
- `clothe-brand/supabase/migrations/202607150001_create_orders.sql`
- `clothe-brand/tests/payment.test.mts`

## Dependencies

- Existing Supabase order persistence and Paystack reconciliation from commit `ce0f892`.
- A local or explicitly authorized test Supabase project for migration/integration verification.

## Required changes

- Add a versioned Supabase migration for a service-role-only fulfillment outbox with an explicit lifecycle and retry metadata.
- Implement a database operation that atomically performs the first pending-to-paid transition and creates one outbox event.
- Make duplicate or concurrent successful reconciliation return the existing paid result without inserting another event.
- Preserve amount, currency, reference, and provider-status verification before invoking the transition.
- Add automated evidence for first delivery, retry, concurrency, and non-success cases.
- Document how a future worker safely claims and completes outbox entries.

## Allowed scope

- Supabase migrations and server-side order/payment persistence modules.
- Focused test fixtures and integration-test infrastructure.
- Architecture/current-state documentation required by the change.

## Out of scope

- Sending email, SMS, or WhatsApp messages.
- Calling a courier, ERP, or warehouse API.
- Building an operations dashboard.
- Changing checkout UI or catalog schemas.
- Deploying the migration to production without explicit authorization.

## Constraints

- The paid transition and outbox insert must commit or roll back together.
- At most one fulfillment event may exist per order and event type.
- RLS and explicit least-privilege grants are required on new exposed tables/functions.
- Privileged functions must use a fixed empty `search_path`, validate inputs, and revoke default `PUBLIC` execution.
- Retried processing must be observable and must not lose an event after a worker failure.

## Acceptance criteria

- [ ] AC-01: The first verified pending-to-paid transition atomically creates one pending fulfillment outbox row.
- [ ] AC-02: Repeated and concurrent successful reconciliation leaves exactly one outbox row for that order/event type.
- [ ] AC-03: Pending, failed, mismatched, refunded, or otherwise invalid payments create no fulfillment outbox row.
- [ ] AC-04: Anonymous and authenticated Data API roles cannot read, insert, update, delete, or invoke privileged fulfillment operations.
- [ ] AC-05: A service-side consumer can safely claim an event, record attempts/errors, and mark it complete without duplicate claims.
- [ ] AC-06: Automated tests exercise successful transition, duplicate retry, concurrent delivery, invalid payment, and worker-retry behavior.

## Verification

```bash
npm --prefix clothe-brand test
npm run lint:store
npm run build:store

# Use the Supabase CLI commands discovered via `supabase --help` against a
# local project, or an explicitly authorized test project, to apply the new
# migration and run the integration scenarios.
```

Expected evidence:

- Unit tests pass.
- Storefront lint and production build pass.
- Database integration output shows one paid transition and one outbox row after concurrent/retried reconciliation.
- Privilege checks show no anon/authenticated access.

## Definition of done

- [ ] Required implementation is complete.
- [ ] Acceptance criteria have executable evidence.
- [ ] Focused and database integration tests pass.
- [ ] Type checking/linting and the storefront production build pass.
- [ ] No unrelated files were changed.
- [ ] `docs/architecture.md` and `docs/current-state.md` are updated.
