import fs from "node:fs";

const products = JSON.parse(fs.readFileSync("lib/productEditorial.json", "utf8"));
const blogs = JSON.parse(fs.readFileSync("lib/blogEditorial.json", "utf8"));
const categories = JSON.parse(fs.readFileSync("lib/categoryEditorial.json", "utf8"));

const protectedFields = new Set([
  "price", "moq", "specs", "grade", "packaging", "hs", "stock",
  "availability", "origin", "lead", "shelfLife", "containerCapacity",
]);

const rows = [];
const serialize = (value) => typeof value === "string" ? value : JSON.stringify(value);
const add = (table, record, field, current, proposed, reason, impact, factual) => {
  rows.push({ table, record, field, current: serialize(current), proposed: serialize(proposed), reason, impact, factual });
};

for (const [slug, changes] of Object.entries(products)) {
  for (const [field, change] of Object.entries(changes)) {
    const isCertification = field === "certifications";
    add(
      "products",
      slug,
      field,
      change.before,
      change.after,
      isCertification
        ? "Remove unsupported or misclassified product-certification claims; corporate identifiers are not product certifications."
        : "Replace intermediary/sourcing language and unsupported marketing claims with exporter and buyer-requirement language.",
      ["metaTitle", "metaDescription", "tagline", "description", "shortDescription", "keywords"].includes(field)
        ? "Direct public copy and search-snippet impact."
        : "Public trust/positioning impact; no ranking guarantee.",
      isCertification
        ? "Trust-claim field changes. No verified certification is asserted as removed; must be rechecked before applying."
        : protectedFields.has(field)
          ? "PROTECTED COMMERCIAL/FACT FIELD — application prohibited without verification."
          : "Copy/SEO field only; no price, MOQ, grade, packing, HS code, stock or availability change.",
    );
  }
}

for (const [slug, changes] of Object.entries(blogs)) {
  changes.forEach((change, index) => add(
    "blog_posts",
    slug,
    `text occurrence ${index + 1}`,
    change.before,
    change.after,
    "Replace buyer-facing sourcing/procurement terminology in CMS article content, metadata, FAQ, section or tag values.",
    "Public editorial and topical-positioning impact.",
    "Editorial text only; no product or commercial data change.",
  ));
}

for (const [current, proposed] of Object.entries(categories)) {
  add(
    "site_settings",
    "categories (exact description match)",
    "value[].description",
    current,
    proposed,
    "Correct category positioning and qualify organic certification availability.",
    "Public category-copy and trust impact.",
    "Description only; identifiers, order, product membership and availability remain unchanged.",
  );
}

if (rows.some((row) => protectedFields.has(row.field))) {
  throw new Error("Protected commercial/fact field detected in proposed database changes.");
}

const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const csvHeaders = ["table", "record", "field", "current", "proposed", "reason", "SEO impact", "factual/commercial data change"];
const csv = [
  csvHeaders.map(escapeCsv).join(","),
  ...rows.map((row) => [row.table, row.record, row.field, row.current, row.proposed, row.reason, row.impact, row.factual].map(escapeCsv).join(",")),
].join("\n") + "\n";

const productFields = [...new Set(rows.filter((row) => row.table === "products").map((row) => row.field))].sort();
const report = `# Database correction review — not applied

Generated from the exact-value editorial manifests on 16 September 2026. These proposed corrections have **not** been executed against Supabase.

## Inventory

| Table | Records | Proposed field/text changes | Scope |
|---|---:|---:|---|
| products | ${Object.keys(products).length} | ${rows.filter((row) => row.table === "products").length} | Public marketing, SEO, benefits, applications and certification-claim cleanup |
| blog_posts | ${Object.keys(blogs).length} | ${rows.filter((row) => row.table === "blog_posts").length} exact phrase mappings | Public CMS article, metadata, FAQ, section and tag copy |
| site_settings | Exact category-description matches | ${Object.keys(categories).length} | Public category descriptions |

Full current/proposed values and the reason, SEO impact and factual-data assessment for every row are in [database-change-report.csv](database-change-report.csv).

## Protected facts

The manifest contains no proposed changes to price, MOQ, product specification ranges, grade, packing, HS code, stock, origin, lead time, shelf life, container capacity or product availability. Product fields touched are: ${productFields.join(", ")}.

The product \`certifications\` field is intentionally flagged for manual re-verification before application. The audited values mixed corporate identifiers, “available on request” language and unsupported product-certification claims. The public defensive layer removes those claims, but the database SQL must remain on hold until each certification is verified against an official document and its scope.

## Execution safeguards

- Both SQL files use exact current-value or slug-scoped guards and end in \`ROLLBACK\`.
- No SQL has been executed.
- A database backup, dry-run row counts and explicit approval are required before changing \`ROLLBACK\` to \`COMMIT\`.
- The currently connected Supabase account exposes only the separate \`gopufoods\` project, so the GOPU Exports database could not be inspected or tested through the connector.
`;

fs.writeFileSync("docs/audit/database-change-report.csv", csv);
fs.writeFileSync("docs/DATABASE_CHANGE_REPORT.md", report);
console.log(`Generated ${rows.length} reviewed database-change rows; no protected commercial/fact fields detected.`);
