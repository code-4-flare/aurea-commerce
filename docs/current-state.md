# Current State

Last updated: 2026-07-16

## Completed

- Next.js 16 storefront and standalone Sanity Studio are established as sibling applications.
- Sanity manages active products, categories, collections, variants, navigation, homepage content, policies, and lookbook content.
- Zustand provides browser-local cart state.
- Checkout validates customer/delivery input and recalculates trusted catalog pricing server-side.
- Paystack initialization, server verification, signed webhook validation, and branded payment-result pages are implemented.
- Supabase persists pending orders, immutable item snapshots, and payment audit events.
- Payment reconciliation verifies amount, KES currency, reference, and status before a concurrency-safe paid transition.
- The payment/Supabase implementation is committed in `ce0f892`.

## In progress

- Production hardening and operational workflow design.
- Agent workflow documentation introduced by `agent-workflow.sh`.

## Blocked

- No confirmed blocker.

## Known gaps and risks

- Fulfillment and customer notifications are not triggered from the paid transition.
- Automated payment coverage is primarily unit-level; database and callback/webhook integration coverage is still needed.
- No documented operations interface exists for reviewing or advancing order status.
- The root roadmap remains the high-level delivery sequence; work items should make each next change independently executable.

## Next recommended work item

- Specify and implement an idempotent fulfillment/notification outbox that is created only by the first successful paid transition.
