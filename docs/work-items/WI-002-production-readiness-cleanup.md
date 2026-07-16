# WI-002: Complete production-readiness cleanup

Status: Completed
Created: 2026-07-16

## Objective

Complete a bounded production-readiness pass across routing, SEO, external links, WhatsApp ordering, payment security, and customer-facing failure states without redesigning the storefront.

## Context

The storefront is live after integrating Sanity, Paystack, Supabase, and Vercel analytics. The audit found placeholder metadata/domain values, mock/demo copy and coupon behavior, duplicate compatibility routes, incomplete external-link handling, no sitemap/robots files, and no durable WhatsApp inquiry order flow.

## Inputs

- User-provided production-readiness tasks 1-16
- `AGENTS.md`
- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/decisions/ADR-001-transactional-data-in-supabase.md`
- Current storefront routes, navigation/footer components, checkout/payment modules, and Supabase migration history

## Dependencies

- Existing Sanity catalog/site settings, Paystack reconciliation, and Supabase orders from commit `ce0f892`.
- `SITE_URL`, `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` configured in deployment.
- A local or explicitly authorized Supabase project for migration verification.

## Required changes

- Remove confirmed dead/demo-only routes, assets, mock copy, fake coupon behavior, and nonfunctional newsletter submission.
- Define consistent canonical, Open Graph, Twitter, robots, and sitemap metadata for public commerce routes.
- Force `/studio`, checkout, and payment routes out of search indexes and filter `/studio` from CMS-controlled public navigation.
- Render external CMS/social links safely in new tabs and expose reusable external/UTM/WhatsApp link utilities.
- Add footer social icons only for configured X, TikTok, GitHub, Instagram, and WhatsApp links; update attribution to “Designed & built by Code4Flare”.
- Add cart and checkout WhatsApp order CTAs with server-generated prefilled messages.
- Persist a `whatsapp_inquiry` order and immutable item snapshots before returning the WhatsApp destination.
- Preserve exact amount/currency/status verification, concurrent idempotency, and server-only secrets for Paystack/Supabase.
- Add graceful empty/error/not-found handling for the requested customer journeys.

## Allowed scope

- `clothe-brand/app/`, `components/`, `lib/`, `src/lib/`, Sanity site-settings mapping/query/schema, focused tests, and a new versioned Supabase migration.
- Workflow documentation required to record acceptance evidence and current state.
- Removal of confirmed unused default/demo assets.

## Out of scope

- Visual redesign or new design system.
- Authentication, admin/order dashboard, coupons, loyalty, or unrelated features.
- Sending WhatsApp messages automatically; the customer explicitly opens the prefilled conversation.
- Deploying migrations or mutating production data without explicit authorization.
- Removing the legacy signed webhook path while live Paystack configuration is unknown.

## Constraints

- Client prices remain untrusted; WhatsApp inquiries use a server-created Sanity quote.
- Cart-only inquiries may omit customer/delivery fields, while Paystack checkout orders still require them.
- Transactional tables remain RLS-protected with explicit service-role-only grants.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- Public UI layout, typography, motion, and component styling remain materially unchanged.

## Acceptance criteria

- [x] AC-01: Route audit removes confirmed dead/demo code while preserving necessary live compatibility routes.
- [x] AC-02: Required public pages have unique metadata, canonicals, Open Graph, and Twitter fields; checkout/payment/studio pages are noindex.
- [x] AC-03: `/sitemap.xml` contains public static and active product URLs, and `/robots.txt` references it while excluding private/transactional routes.
- [x] AC-04: `/studio` cannot appear in mapped public navigation or footer links.
- [x] AC-05: Configured social links render the requested icons, all external links use safe new-tab attributes, and attribution is exact.
- [x] AC-06: UTM and WhatsApp helpers produce encoded, validated URLs with automated tests.
- [x] AC-07: Cart and checkout WhatsApp CTAs create one Supabase `whatsapp_inquiry` order with trusted item snapshots before opening a prefilled conversation.
- [x] AC-08: Paystack success still requires exact KES amount/currency/status matching and concurrent retries converge without duplicate paid transitions.
- [x] AC-09: Service-role and Paystack secrets remain unreachable from client modules/bundles.
- [x] AC-10: Cart, checkout, payment callback, and missing-product journeys provide graceful customer-facing states.
- [x] AC-11: Focused tests, typecheck, lint, storefront build, and Studio build pass.

## Verification

```bash
npm --prefix clothe-brand test
cd clothe-brand && ./node_modules/.bin/tsc --noEmit
npm run lint:store
npm run build:store
npm run build:studio
./agent-workflow.sh status
```

Expected evidence:

- Route inventory and repository search contain no removed demo route/coupon/default-asset references.
- Generated build route list includes `robots.txt` and `sitemap.xml` and excludes removed duplicate/demo routes.
- Unit tests cover link helpers, WhatsApp payload validation, and payment matching.
- Supabase migration/query verification confirms service-role inquiry creation and no anon/authenticated table access.

Actual evidence (2026-07-16):

- `npm --prefix clothe-brand test`: 11/11 tests passed, including payment matching, WhatsApp validation, safe link filtering, and URL encoding.
- `cd clothe-brand && ./node_modules/.bin/tsc --noEmit`: passed.
- `cd clothe-brand && npm run lint`: passed.
- `npm run build:store`: passed; generated 30 pages, including `/robots.txt` and `/sitemap.xml`, with only the canonical `/payments/callback` route and no removed verification endpoint.
- `npm run build:studio`: passed without configuration warnings after explicit CLI environment loading.
- Production-server HTTP checks returned `200` with `noindex, nofollow, nocache` for `/studio` and `/payments/callback`; an unknown product returned `404` with the custom unavailable-product state.
- Generated HTML contains page-specific canonicals, Open Graph, and Twitter cards; generated robots excludes API, Studio, checkout, and payment paths; generated sitemap includes public static routes and ten active Sanity products.
- Both versioned migrations applied successfully to an isolated PostgreSQL 18 verification database. A cart-only `whatsapp_inquiry` insert succeeded, while `anon` and `authenticated` had no order-table access and `service_role` retained insert access.
- Repository audits found no remaining fake coupon, newsletter form, singular callback route, removed verify endpoint, or default Next asset references. Secret-key references remain confined to server-only modules and environment documentation.

## Definition of done

- [x] Required implementation is complete.
- [x] Acceptance criteria map to executable evidence.
- [x] Focused tests, typecheck, lint, and both production builds pass.
- [x] No unrelated user files were changed.
- [x] `docs/current-state.md` and this work item are updated with actual results and residual risks.
