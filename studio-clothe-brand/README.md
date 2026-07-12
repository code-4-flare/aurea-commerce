# Clothe Brand Sanity Studio

Standalone Sanity Studio for the Clothe Brand ecommerce catalog and content backend.

See the root [README.md](../README.md) for the complete project guide.

- Project ID: `18w15i18`
- Dataset: `production`
- Frontend app: `../clothe-brand`

Run `npm install` in this folder, then `npm run dev` to start Studio.
Run `npm run schema:deploy` after authenticating with `sanity login` to deploy schema changes.

## Seed Sample Catalog

Create a Sanity token with write access, then run:

```bash
SANITY_AUTH_TOKEN=your_token npm run seed:mock
```

The script imports the current mock catalog into Sanity, creates reusable categories, colors, sizes, collections, homepage, site settings, delivery policy, and lookbook item documents, and uploads local images from `../clothe-brand/images`.
