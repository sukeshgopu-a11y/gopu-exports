type TextValue = string | undefined;

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/Fumigation certificate included/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Fumigation certificate available/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Fumigation certificate\b/gi, "Fumigation documentation can be arranged where required by product, destination or buyer specification"],
  [/Private labeling\s*&\s*OEM packaging/gi, "Private-label packaging available for suitable order quantities and buyer requirements"],
  [/\bOEM packaging\b/gi, "private-label packaging"],
  [/\bOEM Ready\b/gi, "Private Label"],
  [/King of Spices\s*[—-]\s*World-Class Export Quality/gi, "Whole black pepper available for bulk and food-service procurement"],
  [/Queen of Spices\s*[—-]\s*Premium Export Grade/gi, "Whole green cardamom available by grade and buyer specification"],
  [/World-Class Export Quality/gi, "Bulk export procurement"],
  [/GI Protected Origin/gi, "Origin documentation review available"],
  [/GI protected origin certification/gi, "Origin documentation can be reviewed where applicable"],
];

export function cleanPublicProductText(value: TextValue) {
  if (!value) return value;
  return REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function cleanPublicProduct<T extends Record<string, unknown>>(product: T): T {
  const next: Record<string, unknown> = { ...product };

  for (const key of ["tagline", "description", "metaTitle", "metaDescription"]) {
    if (typeof next[key] === "string") next[key] = cleanPublicProductText(next[key] as string);
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
        value: typeof spec.value === "string" ? cleanPublicProductText(spec.value) : spec.value,
      };
    });
  }

  return next as T;
}
