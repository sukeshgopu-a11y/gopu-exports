# Export positioning and SEO review — 13 September 2026

## Result prepared for review

The homepage now has six sections instead of thirteen. It leads with an Indian export offer, shows four featured products, retains category discovery, introduces the company, explains ordering, answers buyer questions and closes with an export quotation CTA. The lengthy factory, packaging, verification and destination repeats have been consolidated into links to their full pages. The live featured-product query is retained; unavailable data does not expose administrator instructions.

Company, contact, category and resource copy now consistently addresses international importers. The quote page opens directly with its purpose instead of a large promotional header. Existing form fields, validation and submission handling remain in place.

Search metadata and sharing metadata are aligned for public static pages. Product titles gain export intent when custom titles lack it; an existing repeated GOPU Exports suffix is removed. Category links in the footer point to indexable category pages. New Hyderabad/Telangana and Andhra Pradesh product-origin pages are automatically included by the existing sitemap generator. These pages do not claim a fictitious Andhra Pradesh office.

The public Facebook search-results fallback is removed from navigation and Organization sameAs. Existing configured profile URLs are preserved. Universal phytosanitary/fumigation statements and an unsupported WFP-readiness phrase have been qualified. No new certification, ranking, customer, shipment-volume or overseas-office claims are introduced.

## Observed problems

| Area | Evidence | Correction |
| --- | --- | --- |
| Homepage | Thirteen sections; sourcing-led copy; an internal instruction about replacing factory photos | Six sections and clear export supply copy |
| About | Main heading positions the business as agricultural sourcing | Indian agricultural exports for international buyers |
| Contact | Large decorative introduction delays the form; asks what buyers need to source | Compact export quote introduction and import wording |
| Category SEO | Thin national pages and sourcing descriptions | Better product-specific content, regional origins and internal links |
| Product titles | Sona Masoori page repeats the company suffix | Normalize suffix before the global title template |
| Trust | Facebook search URL treated as company identity; broad compliance claims | Remove search fallback and qualify the claims |
| Measurement | Connected Windsor account exposes Instagram only | Search Console/GA4 performance was unavailable for this audit |

## Search priorities

| Intent | Primary page |
| --- | --- |
| Indian agricultural / food exporter | Home and existing agricultural export category |
| Agricultural exporter Hyderabad / Telangana | New Hyderabad/Telangana page |
| Guntur chilli / Andhra Pradesh rice exports | New Andhra Pradesh product-origin page and individual products |
| Spice exporters from India | Existing spice export category |
| Rice exporters from India | Existing rice export category |
| Individual export products | Existing product detail URLs |

Do not build duplicate city pages or use "No. 1" / "top 10" as an unsupported company claim. Ranking is specific to a query, country, device and time. Measure regional queries separately from overseas impressions and qualified importer enquiries. Being visible locally alone does not demonstrate international buyer acquisition.

## Verification and limits

- Inspected the public route/component inventory and searched public copy across the source snapshot. Checked live homepage appearance and representative company, contact, catalogue, certification and product pages.
- Passed executable checks for 19 unique category/resource routes, metadata canonical/sharing alignment, and the observed product-copy replacement cases.
- Passed git diff whitespace validation. Reviewed retained form submission logic and existing internal route targets.
- Full Next.js build, TypeScript compilation, lint and rendered mobile/desktop regression checks remain required. This environment lacks the project dependencies; dependency installation timed out. The repository-required installed Next.js guide was unavailable; current official Next.js metadata, image and sitemap references were consulted. Do not treat the limited checks as a successful production build.
- Production has not been changed. This is a review change set. Do not merge or release until the build and preview checks above pass.
- A complete runtime crawl of every dynamic database product/blog page was not completed. Review current database-managed copy and any downloaded specification PDFs before release; source fallback changes do not rewrite database rows.
- Robots and sitemap retrieval through web lookup failed; this is a lookup limitation, not evidence that those endpoints fail for Google. Verify HTTP status, XML validity and URL coverage in the release environment.

## Remaining commercial work

Connect Search Console for this domain, establish a 28-day baseline by query/country/page, and validate sitemap/indexing status. Configure a verified GA4 property if wanted; do not invent an ID. Track successfully submitted enquiries and distinguish overseas buyers, local export buyers and supplier offers in reporting. No analytics accounts or tracking IDs were created in this change.

Confirm real batch specifications, offered MOQs, packing options and document availability for the priority products. Publish genuine facility/product evidence and permissioned buyer case studies as available. Add detailed destination guidance only for markets the business can serve and keep it accurate. Earn relevant trade references and links; do not buy ranking links or generate repetitive location pages.

Top rankings in Telangana/Andhra Pradesh and India's top ten are targets, not guaranteed outcomes from a code change. Review qualified international enquiries and search-country data after indexing, then choose the next content work from evidence.

## Sources

- https://gopuexports.com/
- https://gopuexports.com/about
- https://gopuexports.com/contact
- https://gopuexports.com/products/sona-masoori-rice
- https://developers.google.com/search/docs/fundamentals/do-i-need-seo
- https://developers.google.com/search/docs/essentials/spam-policies
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
