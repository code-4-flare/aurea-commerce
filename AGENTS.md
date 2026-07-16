# Repository Instructions

## Project

- Name: Aurea clothing commerce platform (`clothe-brand-project`).
- This is a monorepo with a Next.js storefront in `clothe-brand/` and a standalone Sanity Studio in `studio-clothe-brand/`.
- Treat the repository and executable tests as the source of truth for implementation state.
- Treat `docs/product-spec.md`, accepted ADRs in `docs/decisions/`, and assigned work items as the source of truth for intent.
- If documentation and implementation disagree, report the conflict before changing behavior.

## System boundaries

- Sanity owns catalog and editorial content; it must not store orders, customers, or payment events.
- Supabase owns transactional order, immutable line-item snapshot, and payment-event data.
- Paystack is the payment provider. Amount, currency, reference, and provider status must be verified server-side before an order becomes paid.
- Secrets and service-role credentials are server-only. Never expose them through `NEXT_PUBLIC_*`, client components, logs, fixtures, or committed files.
- Do not mutate a remote database, deploy a schema, or contact customers unless the user explicitly requests that external action.

## Before editing

1. Read the assigned work item and its linked specification or ADR sections.
2. Inspect the relevant implementation, tests, and current Git status.
3. Report conflicts between the repository and the requested behavior.
4. State the exact files expected to change.
5. Run the narrowest relevant existing tests when practical.

## During implementation

- Implement only the assigned outcome and preserve unrelated working-tree changes.
- Do not silently change public interfaces, schemas, payment rules, or content contracts.
- Add dependencies only when necessary, pin them through the package lock, and document the reason.
- For schema changes, use versioned files under `clothe-brand/supabase/migrations/`, enable RLS on exposed tables, and grant only required privileges.
- Keep payment handling idempotent and safe under callback/webhook concurrency.
- Prefer small, reviewable changes with tests covering acceptance criteria.

## Verification commands

Run commands from the repository root unless noted:

```bash
npm --prefix clothe-brand test
npm run lint:store
npm run build:store
npm run build:studio
```

Use the narrowest relevant subset first. A production build may require network access or permission for Turbopack to bind an internal port.

## Completion report

Include:

- Files changed
- Commands executed and actual results
- Acceptance-criterion evidence
- Deviations or unresolved questions
- Residual security, data-integrity, deployment, or migration risks
- Recommended next work item
