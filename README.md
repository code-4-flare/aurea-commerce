# Clothe Brand

Fashion ecommerce storefront built with Next.js App Router and a standalone Sanity Studio.

This repository is structured as a public monorepo: the storefront and Studio live side by side.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand for frontend cart state
- Sanity CMS for catalog and editable site content
- Sanity Studio as a standalone sibling app

## Project Structure

```txt
clothe-brand-project/
  clothe-brand/          # Next.js storefront
  studio-clothe-brand/   # Standalone Sanity Studio
  README.md
  ROADMAP.md
```

## What Sanity Manages

Sanity is used as the content and catalog backend only.

- Products
- Categories
- Collections
- Colors
- Sizes
- Homepage content
- Site settings
- Header navigation
- Footer content
- Delivery policy
- Lookbook items

## What Sanity Does Not Manage

Sanity is not used for transactional commerce data.

- Orders and immutable line-item snapshots are stored in Supabase.
- Payment events are processed through Paystack and audited in Supabase.
- Customer checkout details are stored with the transactional order, not in Sanity.
- No authentication
- No backend cart

Cart state lives in Zustand on the frontend. Checkout validates and reprices the cart server-side before creating a pending Supabase order and initializing Paystack.

## Local Setup

Install dependencies in each app:

```bash
cd clothe-brand
npm install

cd ../studio-clothe-brand
npm install
```

Create local env files from the examples:

```bash
cp clothe-brand/.env.example clothe-brand/.env.local
cp studio-clothe-brand/.env.example studio-clothe-brand/.env
```

## Run The Storefront

From the repo root:

```bash
npm run dev:store
```

Or from the storefront folder:

```bash
cd clothe-brand
npm run dev
```

The storefront runs at `http://localhost:3000` by default.

## Run Sanity Studio

From the repo root:

```bash
npm run dev:studio
```

Or from the Studio folder:

```bash
cd studio-clothe-brand
npm run dev
```

Sanity Studio runs at `http://localhost:3333` by default.

## Deploy Schema

Authenticate with Sanity first:

```bash
cd studio-clothe-brand
npx sanity login
npm run schema:deploy
```

For production database migrations and a full hosted Studio deployment, follow
[`docs/deployment.md`](./docs/deployment.md). The root-level Studio deployment
command is:

```bash
npm run deploy:studio
```

## Seed Sample Content

Create a Sanity token with write access, then run:

```bash
cd studio-clothe-brand
SANITY_AUTH_TOKEN=your_write_token npm run seed:mock
```

The seed script creates or updates:

- product catalog documents
- reusable category/color/size/collection documents
- homepage content
- site settings
- delivery policy
- sample lookbook items
- Sanity image assets from `clothe-brand/images`

The seed is idempotent by slug for ordinary content and by document type for singleton-style documents.

## Sanity Content Model

Documents:

- `product`
- `category`
- `collection`
- `color`
- `size`
- `homepage`
- `siteSettings`
- `deliveryPolicy`
- `lookbookItem`

Objects:

- `productImage`
- `seoFields`

Important relationships:

- Product references one category
- Product references many collections
- Product references many colors
- Product references many sizes
- Product references related products
- Homepage references featured products
- Homepage references featured collections
- Lookbook items reference tagged products

## Editable Site Content

Editors can update the following in Sanity:

- Homepage hero copy, image, CTAs, stats, seasonal card, and featured section labels
- Header brand label and navigation
- Mobile menu links and contact content
- Trust strip items
- Footer manifesto, feature cards, gallery, social links, link columns, studio contact, and legal links
- Delivery and returns policy

## Validation

Storefront:

```bash
npm run lint:store
npm run build:store
```

Studio:

```bash
npm run build:studio
```

## Deployment Notes

Recommended production setup:

- Deploy `clothe-brand` to Vercel or another Next.js host.
- Deploy or host `studio-clothe-brand` separately as a standalone Sanity Studio.
- Add production and local storefront URLs to Sanity CORS origins.
- Keep all write tokens and webhook secrets in deployment environment variables.

## Security Notes

Safe to expose publicly:

- Source code
- Sanity schemas
- Sanity project ID
- Dataset name
- Public `NEXT_PUBLIC_*` values

Never commit:

- `SANITY_AUTH_TOKEN`
- Sanity write tokens
- Webhook secrets
- Payment provider secrets
- WhatsApp/Kapso API credentials
- Paystack secret keys

## Roadmap

See [ROADMAP.md](./ROADMAP.md).

## Agent workflow

Repository instructions and durable planning artifacts live in [`AGENTS.md`](./AGENTS.md) and [`docs/`](./docs/). Use the included workflow helper from the repository root:

```bash
./agent-workflow.sh status
./agent-workflow.sh work-item <slug> "<title>"
./agent-workflow.sh prompt implement docs/work-items/WI-001-<slug>.md
./agent-workflow.sh handoff <slug>
```
