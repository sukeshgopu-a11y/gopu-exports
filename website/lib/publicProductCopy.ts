import editorial from "./productEditorial.json";

type TextValue = string | undefined;

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/WFP and government tender ready/gi, "Institutional order requirements reviewed during quotation"],
  [/\bspice blend sourcing\b/gi, "spice blend export supply"],
  [/Fumigation certificate included/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Fumigation certificate available/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Fumigation certificate\b/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Private labeling\s*&\s*OEM packaging/gi, "Private-label packaging available for suitable order quantities and buyer requirements"],
  [/\bOEM packaging\b/gi, "private-label packaging"],
  [/\bOEM Ready\b/gi, "Private Label"],
  [/King of Spices\s*[—-]\s*World-Class Export Quality/gi, "Whole black pepper available for bulk and food-service export supply"],
  [/Queen of Spices\s*[—-]\s*Premium Export Grade/gi, "Whole green cardamom available by grade and buyer specification"],
  [/World-Class Export Quality/gi, "Bulk export supply"],
  [/GI Protected Origin/gi, "Origin documentation review available"],
  [/GI protected origin certification/gi, "Origin documentation can be reviewed where applicable"],
  [/Specification-led sourcing/gi, "Buyer-specification export supply"],
  [/\bsourcing use case\b/gi, "buyer requirement"],
  [/\bsourcing for B2B buyers\b/gi, "export supply for B2B buyers"],
  [/\bsourcing for export buyers\b/gi, "export supply for international buyers"],
  [/\bspice sourcing\b/gi, "spice export supply"],
  [/\boilseed sourcing\b/gi, "oilseed export supply"],
  [/\bmillet sourcing\b/gi, "millet export supply"],
  [/\bingredient sourcing\b/gi, "ingredient export supply"],
  [/\bpulses sourcing\b/gi, "pulses export supply"],
  [/\bsourcing\b/gi, "export supply"],
  [/\bprocurement\b/gi, "export enquiry"],
];

export function cleanPublicProductText(value: TextValue) {
  if (!value) return value;
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function cleanPublicProduct<T extends Record<string, unknown>>(product: T): T {
  const next: Record<string, unknown> = { ...product };
  // Exact field revisions audited against the public catalogue; preserve subsequent admin edits.
  const revisions = (editorial as Record<string, Record<string, { before: unknown; after: unknown }>>)[String(product.slug)];
  for (const [key, revision] of Object.entries(revisions ?? {})) {
    if (JSON.stringify(next[key] ?? null) === JSON.stringify(revision.before)) next[key] = revision.after;
  }

  for (const key of ["tagline", "description", "shortDescription", "metaTitle", "metaDescription"]) {
    if (typeof next[key] === "string") next[key] = cleanPublicProductText(next[key] as string);
  }

  for (const key of ["applications", "keywords"]) {
    if (Array.isArray(next[key])) next[key] = (next[key] as unknown[]).map(item => typeof item === "string" ? cleanPublicProductText(item) : item);
  }

  if (Array.isArray(next.benefits)) {
    next.benefits = next.benefits.map((item) =>
      typeof item === "string" ? cleanPublicProductText(item) : item
    );
  }

  if (Array.isArray(next.specs)) {
    next.specs = next.specs.map((item) => {
      if (!item || typeof item !== "object") return item;
      const spec = item as Record<string, unknown>;
      return {
        ...spec,
        label: typeof spec.label === "string" ? cleanPublicProductText(spec.label) : spec.label,
        value: typeof spec.value === "string" ? cleanPublicProductText(spec.value) : spec.value,
      };
    });
  }

  return next as T;
}

