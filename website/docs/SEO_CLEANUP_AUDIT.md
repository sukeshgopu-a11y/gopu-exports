# Public website audit — 16 September 2026

Baseline: origin/main 5fdcd2f. Branch: codex/public-seo-cleanup-20260916. No production writes or deployment.

Inspected existing branches fix/export-company-cleanup (97fc324), codex/international-export-seo-20260913 (ad86b02), fix/products-seo-copy-20260914 (18e14b5), and fix/international-buyer-positioning. The older cleanup branch predates merged navigation and footer work; selected ideas will be adapted onto current main, without merging PR #2.

The source audit below was recorded before implementation. Public API snapshot contains 40 products. Production database changes must await approval; a reviewed correction manifest and guarded SQL will be prepared locally.

| File:line | Classification | Occurrence |
|---|---|---|
| lib\publicProductCopy.ts:5 | LEAVE technical/provenance or defensive matcher | [/\bspice blend sourcing\b/gi, "spice blend export supply"], |
| lib\publicProductCopy.ts:12 | LEAVE technical/provenance or defensive matcher | [/King of Spices\s*[—-]\s*World-Class Export Quality/gi, "Whole black pepper available for bulk and food-service procurement"], |
| lib\publicProductCopy.ts:14 | LEAVE technical/provenance or defensive matcher | [/World-Class Export Quality/gi, "Bulk export procurement"], |
| lib\publicProductCopy.ts:17 | LEAVE technical/provenance or defensive matcher | [/Specification-led sourcing/gi, "Buyer-specification export supply"], |
| lib\publicProductCopy.ts:21 | LEAVE technical/provenance or defensive matcher | [/\bspice sourcing\b/gi, "spice export supply"], |
| lib\publicProductCopy.ts:22 | LEAVE technical/provenance or defensive matcher | [/\boilseed sourcing\b/gi, "oilseed export supply"], |
| lib\publicProductCopy.ts:23 | LEAVE technical/provenance or defensive matcher | [/\bmillet sourcing\b/gi, "millet export supply"], |
| lib\publicProductCopy.ts:24 | LEAVE technical/provenance or defensive matcher | [/\bingredient sourcing\b/gi, "ingredient export supply"], |
| lib\publicProductCopy.ts:25 | LEAVE technical/provenance or defensive matcher | [/\bpulses sourcing\b/gi, "pulses export supply"], |
| lib\products.ts:42 | REVIEW supply-chain context | "Whole green cardamom pods sourced for bulk food-service, processing, and wholesale procurement. Grade, colour, size, packing, and documentation requirements are confirmed with the buyer before quotation.", |
| lib\products.ts:78 | CHANGE public positioning | tagline: "Whole black pepper available for bulk and food-service procurement", |
| lib\products.ts:113 | CHANGE public positioning | "Turmeric powder processed for bulk food, ingredient, and private-label procurement. Curcumin, mesh size, colour, packing, and testing requirements are confirmed against the buyer-approved specification.", |
| lib\products.ts:145 | CHANGE public positioning | tagline: "Whole red chilli for bulk spice and food processing procurement", |
| lib\products.ts:147 | REVIEW supply-chain context | "Whole red chillies sourced for spice processors, seasoning manufacturers, wholesalers, and food-service buyers. ASTA, SHU, moisture, stem, packing, and documentation requirements are confirmed before order finalisation.", |
| lib\products.ts:179 | CHANGE public positioning | tagline: "Cumin seeds for bulk spice and ingredient procurement", |
| lib\products.ts:181 | REVIEW supply-chain context | "Machine-cleaned cumin seeds sourced for spice blending, food processing, wholesale, and ingredient buyers. Aroma, purity, moisture, packing, and testing requirements are reviewed before quotation.", |
| lib\products.ts:212 | CHANGE public positioning | tagline: "Coriander seeds for bulk spice procurement", |
| lib\products.ts:243 | CHANGE public positioning | tagline: "Whole cloves for food manufacturing and wholesale procurement", |
| lib\products.ts:245 | CHANGE public positioning | "Whole cloves available for food manufacturing, spice blending, and wholesale procurement. Grade, eugenol range, moisture, packing, and documentation requirements are reviewed before quotation.", |
| lib\products.ts:274 | CHANGE public positioning | tagline: "Cinnamon sticks and powder for bulk procurement", |
| lib\products.ts:305 | CHANGE public positioning | tagline: "Fennel seeds for culinary, tea, and ingredient procurement", |
| lib\products.ts:307 | CHANGE public positioning | "Sweet aromatic fennel seeds available for culinary, tea, wholesale, and ingredient procurement. Grade, colour, purity, packing, and testing requirements are confirmed by buyer specification.", |
| lib\exportOperationPages.ts:119 | CHANGE public positioning | description: "Bulk procurement guidance for importers importing Indian agricultural commodities and food products.", |
| lib\exportOperationPages.ts:147 | CHANGE public positioning | slug: "inquiry-procurement-support", |
| lib\exportOperationPages.ts:148 | CHANGE public positioning | title: "Inquiry & Procurement Support", |
| lib\exportOperationPages.ts:150 | CHANGE public positioning | keywords: ["export inquiry support", "procurement support India", "agri products quote request"], |
| lib\exportOperationPages.ts:154 | CHANGE public positioning | { heading: "Procurement next steps", body: "Once requirements are clear, buyers can proceed with sample discussion, commercial quote, documentation mapping, and shipment planning." }, |
| lib\email.ts:131 | LEAVE technical/provenance or defensive matcher | ["Source Page URL", payload.sourceUrl], |
| lib\blogs.ts:57 | CHANGE public positioning | excerpt: "A current market note for global buyers reviewing Indian rice, cereals, spices, oil seeds, and processed agricultural sourcing in 2026.", |
| lib\blogs.ts:59 | CHANGE public positioning | metaDescription: "Current 2026 India import-export signals for buyers sourcing agricultural products, rice, spices, cereals, oil seeds, and processed food products.", |
| lib\blogs.ts:67 | CHANGE public positioning | "For agricultural importers, the practical message is not only that India remains a large sourcing market. The real takeaway is that product-level clarity, packaging discussions, documentation planning, and destination-country compliance need to be handled before price comparison." |
| lib\blogs.ts:87 | CHANGE public positioning | "Begin with a specification-led conversation. Share the product, destination, quantity, packing, intended use, shipment timeline, and document checklist. This allows the supplier to respond with realistic sourcing, packaging, and shipment planning instead of a generic stock message.", |
| lib\blogs.ts:88 | CHANGE public positioning | "As of 21 May 2026, India's export story remains positive, but the best procurement outcomes will come from structured enquiries and careful documentation before cargo moves." |
| lib\blogs.ts:94 | CHANGE public positioning | { question: "Are rice and cereals still relevant for India sourcing in 2026?", answer: "Yes. Recent trade updates show positive signals for cereals, while APEDA continues to highlight rice and agricultural products in export promotion activity." }, |
| lib\blogs.ts:103 | CHANGE public positioning | excerpt: "A practical checklist for importers sourcing Indian rice, spices, spice powders, blended masalas, and private-label food products.", |
| lib\blogs.ts:105 | CHANGE public positioning | metaDescription: "Import checklist for buyers sourcing Indian rice and spices in 2026, including specifications, packing, MOQ, documents, and shipment planning.", |
| lib\blogs.ts:149 | CHANGE public positioning | excerpt: "A practical sourcing guide for importers buying Indian spices in wholesale quantities, from product selection to documentation and shipment planning.", |
| lib\blogs.ts:173 | CHANGE public positioning | "For the first order, many buyers request smaller trial quantities. For ongoing supply, a monthly or quarterly schedule gives the exporter better room to plan sourcing, cleaning, testing, packing, and vessel booking." |
| lib\blogs.ts:195 | CHANGE public positioning | excerpt: "Understand basmati and non-basmati rice sourcing, packing choices, quality checks, and buyer questions before requesting an export quotation.", |
| lib\blogs.ts:243 | CHANGE public positioning | metaDescription: "Understand APEDA product categories, buyer documentation, and sourcing questions for Indian agricultural exports.", |
| lib\blogs.ts:244 | CHANGE public positioning | tags: ["APEDA products", "agricultural exports", "India sourcing"], |
| lib\blogs.ts:317 | CHANGE public positioning | "Repeat spice buying works best when the buyer shares forecast volumes and quality tolerance in advance. This allows better sourcing, cleaning, grading, testing, and packing decisions.", |
| lib\blogs.ts:336 | CHANGE public positioning | tags: ["agricultural exporter", "India sourcing", "buyer checklist"], |
| lib\blogs.ts:449 | CHANGE public positioning | "For repeat supply, buyers should provide expected monthly or quarterly quantity so sourcing and cleaning can be planned." |
| lib\blogs.ts:453 | CHANGE public positioning | heading: "How to request millet sourcing", |
| lib\blogs.ts:461 | REVIEW supply-chain context | { question: "Which millets can be sourced from India?", answer: "Common discussions include pearl millet, finger millet, foxtail millet, little millet, barnyard millet, kodo millet, proso millet, and sorghum." }, |
| lib\blogs.ts:517 | CHANGE public positioning | excerpt: "A practical document checklist for importers sourcing Indian food products, agricultural commodities, spices, rice, and fresh produce.", |
| lib\blogs.ts:563 | CHANGE public positioning | excerpt: "How importers and retail brands can plan private label spice sourcing from India with packaging, labels, compliance, and product development steps.", |
| components\WhyChooseUs.tsx:10 | CHANGE public positioning | title: "Reliable Sourcing", |
| components\WhyChooseUs.tsx:12 | REVIEW supply-chain context | "Carefully sourced agricultural products selected for quality and international trade readiness.", |
| components\TrustSection.tsx:14 | REVIEW supply-chain context | "Products sourced and processed with strict quality inspection to meet international buyer standards.", |
| components\ProductCategories.tsx:17 | REVIEW supply-chain context | "Carefully sourced spices suitable for wholesale global distribution.", |
| app\terms-and-conditions\page.tsx:16 | LEAVE technical/provenance or defensive matcher | body: "The website uses passive, privacy-conscious analytics and performance measurement to understand viewed pages, product interest, session activity, device type, referral source, CTA clicks, enquiry activity, and Core Web Vitals. This helps improve the buyer journey and dashboard visibility without collecting passwords or payment details.", |
| app\company-verification\page.tsx:67 | LEAVE technical/provenance or defensive matcher | ["Source", "ABN Lookup"], |
| app\blog\page.tsx:41 | CHANGE public positioning | Practical updates for importers sourcing Indian spices, rice, grains, and agricultural commodities. |
| app\privacy-policy\page.tsx:11 | LEAVE technical/provenance or defensive matcher | "We also collect limited technical information such as viewed pages, product views, CTA clicks, WhatsApp/email/phone clicks, browser type, device type, referral source, approximate session activity, and scroll depth. This data is used to understand buyer interest and improve website performance and enquiry flow.", |
| app\cookie-policy\page.tsx:7 | LEAVE technical/provenance or defensive matcher | ["Anonymous analytics", "Measures page views, viewed products, CTA clicks, scroll depth, device type, browser type, and referral source."], |
| app\about\page.tsx:205 | REVIEW supply-chain context | { label: "Quality Inspection", icon: ShieldCheck, desc: "Multi-point checks at source, packing, and pre-shipment stages." }, |
| app\api\inquiries\route.ts:104 | LEAVE technical/provenance or defensive matcher | sourceUrl ? `Source URL: ${sourceUrl}` : "", |
| app\products\[slug]\page.tsx:409 | CHANGE public positioning | <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#0E7490]">Procurement checklist</p> |
| app\api\products\[id]\specification\route.ts:92 | CHANGE public positioning | notes.push("Product-specific packing, shelf-life, and handling requirements should be confirmed during procurement discussion."); |
| app\api\products\[id]\specification\route.ts:206 | CHANGE public positioning | page.drawText("Indian Agricultural Export Sourcing", { x: MARGIN, y: PAGE_HEIGHT - 63, size: 9.5, font, color: rgb(0.78, 0.87, 0.92) }); |
| app\api\quotes\route.ts:98 | LEAVE technical/provenance or defensive matcher | sourceUrl ? `Source URL: ${sourceUrl}` : "", |

## Category settings follow-up

| Actual data | Classification | Resolution |
|---|---|---|
| Fresh Vegetables: Vegetable sourcing for importers and distributors (2 records) | CHANGE | Indian vegetable export supply |
| Organic Products: Organic agricultural products where certification is available (3 records) | REVIEW | Buyer-requested organic certification must be verified for the offered product; no company certification claim |

The public products grid uses its own reviewed category copy, but the category API also receives exact-value corrections. Duplicate saved categories are retained to avoid altering admin identifiers.

## Live blog follow-up

Ten production article pages were fetched read-only. The live rendering confirms legacy phrases in excerpts, paragraphs, FAQs and tags; the static seed file alone would not correct these pages. Exact, slug-scoped revisions now cover the public CMS read path, with matching proposed database corrections. Full observations: `docs/audit/live-blog-pages.json`.
