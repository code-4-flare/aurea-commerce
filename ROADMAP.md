# Roadmap

## Current State

- Next.js storefront is connected to Sanity products.
- Sanity Studio is standalone.
- Products, categories, collections, colors, sizes, homepage, site settings, delivery policy, and lookbook content can be edited in Sanity.
- Cart is frontend-only with Zustand.
- Checkout is UI-only.

## Phase 1: Content Polish

- Add richer lookbook frontend views.
- Add collection landing pages.
- Add category landing pages.
- Add product badges beyond `New In`.
- Add editorial sections for campaigns or seasonal drops.
- Improve SEO metadata from Sanity fields.

## Phase 2: Checkout Foundation

- Define checkout state shape.
- Add customer contact and delivery details form validation.
- Add order summary confirmation state.
- Keep order persistence outside Sanity unless a separate commerce backend is introduced.

## Phase 3: Paystack Payments

- Add Paystack checkout initialization endpoint.
- Store Paystack public key in frontend env and secret key in server env only.
- Add payment verification route.
- Add success and failure checkout states.
- Decide where confirmed order records live before storing production orders.

## Phase 4: WhatsApp Integration With Kapso

- Add WhatsApp quote/order intent flow.
- Integrate Kapso for WhatsApp messaging.
- Generate prefilled order context from cart items.
- Track WhatsApp handoff status.
- Keep credentials server-side only.

## Phase 5: Link Tracking

- Add trackable campaign links for product, collection, and lookbook URLs.
- Persist link click events in a proper analytics or backend store.
- Add UTM handling.
- Add dashboard/reporting surface if needed.

## Phase 6: Production Hardening

- Add webhook-driven Sanity revalidation.
- Add error and empty-state monitoring.
- Add accessibility pass for cart, checkout, and mobile navigation.
- Add tests for product mapping, cart behavior, checkout form behavior, and Sanity query assumptions.
- Add deployment docs for storefront and Studio.
