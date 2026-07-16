# Production Deployment Runbook

Run deployment commands from a clean, reviewed commit. Never paste database
passwords, access tokens, Paystack secrets, or the Supabase service-role key into
tracked files or shell history.

## Deploy Supabase migrations

The Supabase project is an imperative migration project. Migration files live in
`clothe-brand/supabase/migrations/` and must be applied in timestamp order with
the Supabase CLI. Coordinate so only one person pushes migrations at a time.

### 1. Review the pending migration

From the repository root:

```bash
git status --short
git diff HEAD -- clothe-brand/supabase/migrations
```

For this release, confirm the reviewed migration exists:

```text
clothe-brand/supabase/migrations/20260716112828_add_whatsapp_inquiry_orders.sql
```

### 2. Initialize the Supabase CLI project if needed

```bash
cd clothe-brand
npx supabase init
```

The repository already contains the `supabase/` migration directory. Run
`supabase init` only when `supabase/config.toml` is absent; do not overwrite an
existing configuration. All following Supabase commands must run from this
directory so the CLI finds the local `supabase/` folder.

### 3. Check and authenticate the CLI

```bash
npx supabase --version
npx supabase login
```

The login command opens a browser or prompts for a personal access token. Do not
commit the token.

### 4. Link the correct remote project

Copy the production project reference from the Supabase dashboard, then run:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Confirm that the linked project name and reference are the intended production
project before continuing. The database password may be requested interactively.

### 5. Compare migration history

```bash
npx supabase migration list --linked
```

Stop if the local and remote histories unexpectedly diverge. Do not run
`migration repair`, reset the remote database, or edit applied migrations until
the mismatch has been understood and backed up.

### 6. Preview the deployment

```bash
npx supabase db push --dry-run
```

Confirm the preview contains only the expected pending migration. Review the
project's database backup status in the Supabase dashboard before applying a
production schema change.

### 7. Apply the migration

```bash
npx supabase db push
```

The CLI records successfully applied timestamps in Supabase migration history,
so later pushes skip migrations already applied.

### 8. Verify the result

```bash
npx supabase migration list --linked
```

Confirm `20260716112828` is present in both local and remote history. Then test a
WhatsApp order from the storefront and confirm that one order with
`order_channel = 'whatsapp_inquiry'` and its item snapshots appear in Supabase.
Do not use a real customer's details for a deployment smoke test.

## Deploy Sanity Studio

The Studio deploy command builds the standalone Studio and uploads it to Sanity
hosting. `--schema-required` makes the deployment fail if its schema cannot be
published.

### 1. Confirm Studio environment variables

`studio-clothe-brand/.env` must define the project and dataset values documented
in `.env.example`. Do not add an authentication token to a committed file.

### 2. Authenticate locally

From the repository root:

```bash
cd studio-clothe-brand
npx sanity login
cd ..
```

For unattended CI, provide `SANITY_AUTH_TOKEN` through the CI secret store.

### 3. Verify before deployment

```bash
npm run build:studio
npm --prefix studio-clothe-brand run deploy -- --dry-run --schema-required
```

### 4. Deploy

```bash
npm run deploy:studio
```

On the first deployment, Sanity asks for a unique Studio hostname. Later runs
update that hosted Studio. After deployment, open the returned URL and verify
that an editor can sign in and load products and site settings.
