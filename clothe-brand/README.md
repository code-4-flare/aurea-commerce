# Clothe Brand Storefront

Next.js storefront for the Clothe Brand project.

See the root [README.md](../README.md) for full setup, Sanity, seeding, and roadmap details.

## Development

```bash
npm run dev
```

## Supabase order setup

1. Create a Supabase project and run [`supabase/migrations/202607150001_create_orders.sql`](supabase/migrations/202607150001_create_orders.sql) in the Supabase SQL editor.
2. Add these values to `.env.local` and to the deployment environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The Supabase URL is not secret, but `SUPABASE_SERVICE_ROLE_KEY` is imported only by server modules and must never be exposed to client components. The migration enables Row Level Security and grants only the table operations required by the server-side checkout flow to `service_role`.

The checkout API creates a pending order and immutable item snapshots before opening Paystack. Configure Paystack to send webhooks to `/api/webhooks/paystack` (the existing `/api/webhook` URL remains compatible). Both the callback verifier and signed webhook validate the stored KES amount before marking an order paid.

## Validation

```bash
npm test
npm run lint
npm run build
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
