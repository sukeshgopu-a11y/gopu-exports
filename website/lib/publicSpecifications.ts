export type PublicSpecification = { label: string; value: string };

type SpecificationInput = {
  specs?: PublicSpecification[];
  commercialMoq?: string;
  packaging?: string;
  lead?: string;
  origin?: string;
  hs?: string;
  shelfLife?: string;
};

export type PublicSpecificationGroups = {
  all: PublicSpecification[];
  product: PublicSpecification[];
  quality: PublicSpecification[];
  commercial: PublicSpecification[];
  additional: PublicSpecification[];
};

function canonicalLabel(label: string) {
  const key = label.trim().toLowerCase().replace(/\s+/g, " ");
  if (["moq", "minimum order", "minimum order quantity"].includes(key)) return "MOQ";
  if (["packing", "packaging"].includes(key)) return "Packaging";
  if (["lead time", "leadtime"].includes(key)) return "Lead Time";
  if (["hs", "hs code", "hscode"].includes(key)) return "HS Code";
  if (key === "origin") return "Origin";
  if (["shelf life", "shelflife"].includes(key)) return "Shelf Life";
  return label.trim();
}

function groupFor(label: string): keyof Omit<PublicSpecificationGroups, "all"> {
  const key = label.toLowerCase();

  if (/moq|minimum order|packaging|packing|lead time|container|shipment|incoterm|payment/.test(key)) {
    return "commercial";
  }

  if (/moisture|purity|curcumin|mesh|colour|color|stem|asta|shu|aflatoxin|pesticide|micro|foreign matter|admixture|broken|grain|size|grade/.test(key)) {
    return "quality";
  }

  if (/origin|variety|form|hs code|shelf life|product/.test(key)) {
    return "product";
  }

  return "additional";
}

export function buildPublicSpecificationGroups(input: SpecificationInput): PublicSpecificationGroups {
  const preferred: PublicSpecification[] = [
    input.hs ? { label: "HS Code", value: input.hs } : null,
    input.origin ? { label: "Origin", value: input.origin } : null,
    input.commercialMoq ? { label: "MOQ", value: input.commercialMoq } : null,
    input.packaging ? { label: "Packaging", value: input.packaging } : null,
    input.shelfLife ? { label: "Shelf Life", value: input.shelfLife } : null,
    input.lead ? { label: "Lead Time", value: input.lead } : null,
  ].filter((item): item is PublicSpecification => Boolean(item));

  const seen = new Set<string>();
  const all: PublicSpecification[] = [];

  for (const raw of [...preferred, ...(input.specs ?? [])]) {
    if (!raw?.label || !raw?.value) continue;
    const label = canonicalLabel(raw.label);
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    all.push({ label, value: raw.value });
  }

  const groups: PublicSpecificationGroups = {
    all,
    product: [],
    quality: [],
    commercial: [],
    additional: [],
  };

  for (const spec of all) {
    groups[groupFor(spec.label)].push(spec);
  }

  return groups;
}
