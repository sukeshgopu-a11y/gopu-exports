# Database correction review — not applied

Generated from the exact-value editorial manifests on 16 September 2026. These proposed corrections have **not** been executed against Supabase.

## Inventory

| Table | Records | Proposed field/text changes | Scope |
|---|---:|---:|---|
| products | 40 | 244 | Public marketing, SEO, benefits, applications and certification-claim cleanup |
| blog_posts | 10 | 27 exact phrase mappings | Public CMS article, metadata, FAQ, section and tag copy |
| site_settings | Exact category-description matches | 2 | Public category descriptions |

Full current/proposed values and the reason, SEO impact and factual-data assessment for every row are in [database-change-report.csv](database-change-report.csv).

## Protected facts

The manifest contains no proposed changes to price, MOQ, product specification ranges, grade, packing, HS code, stock, origin, lead time, shelf life, container capacity or product availability. Product fields touched are: applications, benefits, certifications, description, keywords, metaDescription, metaTitle, shortDescription, tagline.

The product `certifications` field is intentionally flagged for manual re-verification before application. The audited values mixed corporate identifiers, “available on request” language and unsupported product-certification claims. The public defensive layer removes those claims, but the database SQL must remain on hold until each certification is verified against an official document and its scope.

## Execution safeguards

- Both SQL files use exact current-value or slug-scoped guards and end in `ROLLBACK`.
- No SQL has been executed.
- A database backup, dry-run row counts and explicit approval are required before changing `ROLLBACK` to `COMMIT`.
- The currently connected Supabase account exposes only the separate `gopufoods` project, so the GOPU Exports database could not be inspected or tested through the connector.
