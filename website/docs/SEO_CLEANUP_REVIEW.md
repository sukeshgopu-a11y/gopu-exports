# GOPU Exports — SEO and public-content cleanup review

Prepared 16 September 2026 on `codex/public-seo-cleanup-20260916`, based on `origin/main` at `5fdcd2f`.

**Local changes only. No push, deployment, merge, database write or LinkedIn change.** The original `github-source` checkout and its uncommitted changes were preserved.

## Implemented

| Area | Result |
|---|---|
| Repository audit | Existing SEO branches inspected before implementation. Occurrences classified in `SEO_CLEANUP_AUDIT.md`; public product/category snapshots retained. |
| Homepage | Exactly six major sections: exporter hero, four category groups, six priority products, four buyer benefits, company verification and export RFQ. Static product grid; no carousel or automatic scrolling. |
| Entity | GOPU Exports / Gopu Exports Private Limited; Hyderabad HQ; Sukesh Reddy, CEO; +91 9618991917. Partner operations distinguished from the head office and from owned manufacturing. |
| About, catalogue, contact | Exporter voice, international B2B audience, consistent quote CTAs. Product-prefilled RFQ now initializes on the server without a hydration mismatch. Optional specification and packing fields are included in the existing enquiry message and review summary. Form control labels improved. |
| Product data | Forty exact, slug-scoped live-product correction records. Forty-one reviewed fallback products (40 public API products plus the existing Red Onion fallback). Marketing copy, benefits, SEO and certification references cleaned. Existing numerical facts remain unchanged and explicitly subject to buyer/batch confirmation. |
| Product pages and PDFs | Export Enquiry Checklist and Request Export Quote. Chilli/turmeric buyer FAQs, internal guide links and clearer reference-specification tables. Unverified reference ranges excluded from Product JSON-LD. PDF downloads use the same reviewed public catalogue path. |
| CMS articles | Production lists 12 articles; ten have legacy terminology. Those live pages were inspected and exact article-specific revisions now apply to public CMS reads, not just the seed file. Admin CMS reads remain raw. |
| Resources | Export Guide Library for International Buyers; Export Enquiry Support replaces Inquiry & Procurement Support. Old resource URL permanently redirects with HTTP 308. |
| Commercial SEO | Existing India spice, agricultural and Hyderabad pages retained and strengthened. One distinct `/export/spice-powder-exporter-india` guide added. No duplicate Hyderabad or product doorway pages. Priority product URLs remain canonical. |
| Markets and trust | Markets We Support. Corporate identifiers separated from product/shipment documents; no SGS/NABL/APEDA/Spices Board certification claims. Third-party testing and inspection are subject to confirmed scope and availability. |
| Metadata and schema | Agricultural/spice exporter default title and Hyderabad description; canonical and sharing metadata checked. Organization legal name, brand, identifiers and current contact retained. `sameAs` omitted pending profile ownership verification; search URLs rejected by social-link validation. JSON-LD safely escapes `<`. |
| Sitemap | Stale June fallback removed. Fixed dates used only for reviewed revisions; newer product/CMS update timestamps retained. Unknown static modification dates omitted. Priority routes and the renamed resource are included. |
| Responsive UX | Header navigation switches before it becomes crowded; social links no longer add a mobile header row. Footer remains concise. |

## Validation

- `npm run build`: PASS, standard Next.js 16.3.4 Turbopack build with Supabase URL and anon key absent; 100 generated pages.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS.
- `node scripts/check-public-copy.mjs`: PASS for 40 live products, 41 fallback products and 12 legacy articles; checks terminology, unchanged product fact fields, non-mutation, idempotence, preserved later admin descriptions and publication dates.
- `node scripts/check-public-routes.mjs`: PASS for 75 local sitemap routes and 73 internal paths; one H1, title, description, canonical, parseable JSON-LD, current entity/contact, no visible prohibited terminology, public product API and resource 308 redirect.
- Unknown products render the not-found view with `noindex`. Next.js returns HTTP 200 for a streamed not-found response, as documented in its installed `not-found.md`; this is accounted for in the route test.
- Red Chilli specification download: HTTP 200, `application/pdf`, valid two-page PDF (217,562 bytes). Layout code was preserved; PDF visual rendering was not separately inspected.
- Browser: homepage, about, products, Red Chilli, Turmeric, resources, enquiry guide, markets, certifications and contact checked at an effective 330px mobile viewport; no horizontal overflow. Hyderabad guide checked at 769px, home/product/contact at 1085px, and desktop header/home at 1441px. Header links remain inside the viewport.
- Browser interactions: mobile menu opens/closes; category query selects Pulses and shows the four pulse products; product RFQ preselection works; optional specification/packing values appear in the review summary. No enquiry was submitted.
- `git diff --check`: PASS. Final diff reviewed; original navigation/footer improvements retained and admin mutation/authentication logic not changed.

Detailed machine-readable route results: `docs/audit/route-check.json`. Browser screenshots were inspected during the session; the browser's full-page capture stitching was unreliable, so measurements and individual viewport checks were used.

## Vercel Preview finding

Read-only Vercel inspection found failure `dpl_6yFUpepSPfjgWtvuPoy7zWHcR6vh`: compilation and TypeScript succeeded, but page-data collection failed because `NEXT_PUBLIC_SUPABASE_URL` was absent in the product static-generation path. The same commit subsequently had a READY preview (`dpl_6Y2nNNuJZTQZxRswM3zpwXTZLU2s`), and newer previews were READY.

The branch now provides a safe, reviewed catalogue fallback for public pages/API/PDF reads and safe empty gallery/blog states when configuration is absent. Authentication and writes still require real configuration. No credentials were hardcoded or copied. Exact current Production/Preview environment-variable scopes could not be confirmed through the available connector; those scopes still need checking before any future approved deployment.

A local mock-backed integration run was rejected by automatic approval review with only “blocked by policy” supplied as the reason. It was not retried through another mechanism. Credential-free browser/route tests and standalone public-data tests passed. Live database-backed form delivery and authenticated admin flows were not exercised.

## Database changes prepared, not applied

- `supabase/review/public-product-copy.sql`: exact expected-value guards for product fields and category descriptions; preserves later edits and category identifiers/order.
- `supabase/review/public-blog-copy.sql`: slug-scoped exact legacy text revisions for CMS fields, sections, FAQs and tags.

Both scripts default to **ROLLBACK**. Review row counts and a database backup before any approved commit. The connected Supabase project list did not include the GOPU Exports project, so no SQL was executed. Production content remains unchanged until an explicitly approved release/data update.

Product ranges, grade/origin availability, packing, MOQ, shelf life and loading figures were not independently certified. Existing values are kept as buyer-specific reference information to confirm on request. Verified batch documents are still needed before commercial promises. Official social profile ownership must be confirmed before restoring `sameAs`.

## LinkedIn — external corrections only

The request ended after the LinkedIn phase heading without a further correction list. Suggested alignment for the company page and relevant public contact profile:

- Company name: Gopu Exports Private Limited; brand: GOPU Exports.
- Headline: Indian Agricultural & Spice Exporter | Hyderabad, India.
- About copy: supplies Indian spices, rice and selected agricultural products to international importers, distributors, wholesalers and B2B food businesses.
- Website: https://gopuexports.com; phone: +91 9618991917; headquarters: Hyderabad, Telangana, India.
- Sukesh Reddy: Chief Executive Officer (CEO), without adding an unverified Founder title.
- Remove sourcing-agency/procurement language, the old phone, Operations Manager as the current role, and Warangal as current HQ.
- Describe partner/white-label manufacturing accurately; make no unverified certification or shipment-history claims.

These are suggested external corrections, not a claim that LinkedIn was audited or edited.
