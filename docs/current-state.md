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
- Production route cleanup removed duplicate/demo payment paths, fake coupon behavior, a nonfunctional newsletter form, and unused starter assets while retaining the signed legacy webhook alias for compatibility.
- Required commerce routes now expose canonical, Open Graph, and Twitter metadata; Studio, checkout, and payment-result routes are noindex; robots and a Sanity-backed sitemap are generated.
- Public navigation filters Studio links, external links share safe new-tab behavior, configured social channels render in the footer, and attribution names Code4Flare.
- Cart and checkout can persist a server-priced `whatsapp_inquiry` with immutable item snapshots before opening a prefilled WhatsApp conversation.
- Storefront empty/error/not-found states cover cart, checkout, payment callback/results, route errors, and unavailable products.
- Production-readiness verification passed 11 focused tests, TypeScript, ESLint, storefront build, Studio build, generated metadata inspection, and isolated PostgreSQL migration/access checks.

## In progress

- Agent workflow documentation introduced by `agent-workflow.sh`.

## Blocked

- No confirmed blocker.

## Known gaps and risks

- Fulfillment and customer notifications are not triggered from the paid transition.
- Automated payment coverage is primarily unit-level; database and callback/webhook integration coverage is still needed.
- No documented operations interface exists for reviewing or advancing order status.
- The WhatsApp inquiry migration is versioned and locally verified but still requires deployment to the live Supabase project before the production CTA can persist inquiries.
- The public inquiry endpoint relies on validation and trusted server pricing but does not yet have infrastructure-level rate limiting.
- Production must define the canonical `SITE_URL` (or an existing supported public-site URL variable) so generated absolute metadata and sitemap URLs use the live domain.
- The root roadmap remains the high-level delivery sequence; work items should make each next change independently executable.

## Next recommended work item

- Specify and implement an idempotent fulfillment/notification outbox that is created only by the first successful paid transition.
