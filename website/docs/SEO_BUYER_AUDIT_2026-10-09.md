# GOPU Exports: SEO and buyer-experience review

Reviewed 9 October 2026. Scope: all 85 URLs in the production sitemap, shared templates, homepage, catalogue filtering, product detail, resources, articles, and company trust messaging. This is an evidence-based website review, not certification of every backend workflow or a ranking guarantee.

## Baseline evidence

The production crawl returned HTTP 200 for 85/85 sitemap pages. Every page had one H1, a title, description and matching canonical. No duplicate titles/descriptions or noindex directives were found in that set. JSON-LD parsed successfully. Internal page destinations extracted from these pages were represented in the sitemap after normalizing query strings/fragments and excluding APIs. Robots and sitemap were publicly available. These checks establish crawlable HTML; they do not prove Google has indexed every URL.

## Devil's advocate: why might a serious buyer leave?

| Problem | Buyer or search impact | Action in this release |
| --- | --- | --- |
| Broad homepage claims without a clear buying process | Buyers cannot tell what to send or what happens next | Added an enquiry brief, four buying steps, links to practical guides, and explicit order-specific availability/terms |
| Combined category cards sent visitors to only one category | Pulses, millets and fresh produce were difficult to discover correctly | Eight distinct product groups, with separate fruit and vegetable destinations |
| Searching `cumin` matched `curcumin` in turmeric text | Irrelevant results erode confidence in the catalogue | Word-prefix search with all query terms required, plus useful empty-state actions |
| Four article search titles were overly long | Important text could be truncated | Shortened only those exact legacy titles; preserved future editorial titles |
| Article and resource pages lacked breadcrumb structure | Weak hierarchy and return navigation | Visible, wrapping breadcrumbs with BreadcrumbList JSON-LD |
| Homepage lacked WebSite identity markup | Site-level identity was less explicit | Added factual WebSite markup linked to the existing Organization |
| Stock shipping image was labelled as company operations | Could imply ownership of facilities | Replaced with a literal image description |
| Packaging wording implied unconditional compliance | Actual requirements depend on product and destination | Changed to product-specific packaging wording |
| Generic blog heading and repeated wording | Editorial section lacked a clear purpose | Export Buyer Insights heading and clearer introductory copy |

The homepage retains the existing brand colours, logo, legal identifiers, contact channel and real catalogue source. No customer names, shipment statistics, reviews, certifications, prices or inventory claims were invented. Product pages remain quotation-led; no fabricated retail offers or ratings were added to structured data. Revised sitemap dates apply only to changed static pages.

## Remaining risks and work outside this release

- **Enquiry delivery and admin/database security:** the separate comprehensive audit PR #14 requires the correct production Supabase project and Vercel environment access. The accessible Supabase projects did not expose the expected website tables. The public image host alone does not establish the runtime database. Do not apply website migrations to the foods project or another unverified database. No real customer enquiry, email delivery or admin CRUD is certified by this release.
- **Search Console:** inspect indexing, submitted sitemap, manual actions, search queries and country/device performance through the verified property. Public search results are not a substitute for property access.
- **Performance:** no field Core Web Vitals or mobile Lighthouse score was established by the sitemap crawl. Measure LCP, INP and CLS with real-user data; optimize according to measured bottlenecks. The redesign uses the existing optimized hero image and does not add a client-side homepage bundle.
- **External business consistency:** public social results still mention Warangal while current website copy identifies Hyderabad. The owner should verify the correct history, registered address and operating location, then align external profiles accurately.
- **Commercial evidence:** confirm current registrations, testing scope, packing capabilities and order terms with source documents before expanding claims. Registration is not product-quality certification.
- **Content depth:** improve priority product pages with verified grades, packing options, relevant specifications and destination-specific requirements. Avoid copied text and mass-produced country pages. Actual destination rules require current authoritative verification.
- **Authority:** authentic trade references, useful industry coverage and verified directory listings can support discovery. Avoid purchased links and fake reviews.

No fixed ranking or number-one position in India can be guaranteed. Judge progress with qualified enquiries and verified organic-search performance, not keyword repetition.

## Validation approach

Run search/title regression checks, ESLint and the full Next.js production build. Use GitHub checks and the Vercel preview before merging. Inspect rendered production HTML and browser navigation after deployment. No production form is submitted merely to test appearance.

## References

- Google Search Central ecommerce guidance: https://developers.google.com/search/docs/specialty/ecommerce
- Product structured-data eligibility: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Merchant-listing requirements: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Crawl scope: https://gopuexports.com/sitemap.xml
