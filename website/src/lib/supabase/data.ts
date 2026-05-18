type JsonObject = Record<string, unknown>;

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  image_url: string | null;
  specifications: JsonObject | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CertificationRow = {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string | null;
  product_id: string | null;
  status: string;
  created_at: string;
};

export type QuoteRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  product_name: string | null;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  pending: "Pending",
  read: "Read",
  contacted: "Contacted",
  replied: "Replied",
  closed: "Closed",
};

export function toDbStatus(status: unknown) {
  return String(status ?? "new").trim().toLowerCase();
}

export function toUiStatus(status: string) {
  return STATUS_LABELS[status.toLowerCase()] ?? status;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productToApi(row: ProductRow) {
  const specs = (row.specifications ?? {}) as JsonObject;
  const title = row.name;
  const image = row.image_url ?? "";

  return {
    ...specs,
    _id: row.id,
    id: row.id,
    name: title,
    title,
    slug: row.slug,
    category: row.category,
    description: row.description ?? "",
    image,
    image_url: image,
    active: row.is_active,
    is_active: row.is_active,
    featured: row.is_featured,
    is_featured: row.is_featured,
    sort_order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function productBodyToRow(body: JsonObject) {
  const title = String(body.title ?? body.name ?? "").trim();
  const slug = String(body.slug ?? slugify(title)).trim();
  const category = String(body.category ?? "").trim();

  const specifications: JsonObject = {
    tagline: body.tagline ?? "",
    shortDescription: body.shortDescription ?? "",
    origin: body.origin ?? "",
    moq: body.moq ?? "",
    packaging: body.packaging ?? "",
    lead: body.lead ?? "",
    hs: body.hs ?? "",
    shelfLife: body.shelfLife ?? "",
    containerCapacity: body.containerCapacity ?? "",
    applications: Array.isArray(body.applications) ? body.applications : [],
    certifications: Array.isArray(body.certifications) ? body.certifications : [],
    exportCountries: Array.isArray(body.exportCountries) ? body.exportCountries : [],
    exportPorts: Array.isArray(body.exportPorts) ? body.exportPorts : [],
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    related: Array.isArray(body.related) ? body.related : [],
    keywords: Array.isArray(body.keywords) ? body.keywords : [],
    specs: Array.isArray(body.specs) ? body.specs : [],
    metaTitle: body.metaTitle ?? title,
    metaDescription: body.metaDescription ?? "",
  };

  return {
    name: title,
    slug,
    category,
    description: String(body.description ?? ""),
    image_url: String(body.image_url ?? body.image ?? ""),
    specifications,
    is_active: body.is_active ?? body.active ?? true,
    is_featured: body.is_featured ?? body.featured ?? false,
    sort_order: Number(body.sort_order ?? body.order ?? 0),
  };
}

export function productBodyToUpdate(body: JsonObject) {
  const update: JsonObject = {};
  const specifications: JsonObject = {};

  if ("title" in body || "name" in body) update.name = String(body.title ?? body.name ?? "").trim();
  if ("slug" in body) update.slug = String(body.slug ?? "").trim();
  if ("category" in body) update.category = String(body.category ?? "").trim();
  if ("description" in body) update.description = String(body.description ?? "");
  if ("image_url" in body || "image" in body) update.image_url = String(body.image_url ?? body.image ?? "");
  if ("active" in body || "is_active" in body) update.is_active = body.is_active ?? body.active;
  if ("featured" in body || "is_featured" in body) update.is_featured = body.is_featured ?? body.featured;
  if ("sort_order" in body || "order" in body) update.sort_order = Number(body.sort_order ?? body.order ?? 0);

  for (const key of [
    "tagline",
    "shortDescription",
    "origin",
    "moq",
    "packaging",
    "lead",
    "hs",
    "shelfLife",
    "containerCapacity",
    "applications",
    "certifications",
    "exportCountries",
    "exportPorts",
    "benefits",
    "related",
    "keywords",
    "specs",
    "metaTitle",
    "metaDescription",
  ]) {
    if (key in body) specifications[key] = body[key];
  }

  if (Object.keys(specifications).length > 0) update.specifications = specifications;
  return update;
}

export function certificationToApi(row: CertificationRow) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    logo: row.logo_url ?? "",
    logo_url: row.logo_url ?? "",
    description: row.description ?? "",
    issuer: "",
    active: row.is_active,
    is_active: row.is_active,
    order: row.sort_order,
    sort_order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function certificationBodyToRow(body: JsonObject) {
  return {
    name: String(body.name ?? "").trim(),
    logo_url: String(body.logo_url ?? body.logo ?? ""),
    description: String(body.description ?? ""),
    is_active: body.is_active ?? body.active ?? true,
    sort_order: Number(body.sort_order ?? body.order ?? 0),
  };
}

export function certificationBodyToUpdate(body: JsonObject) {
  const update: JsonObject = {};
  if ("name" in body) update.name = String(body.name ?? "").trim();
  if ("logo_url" in body || "logo" in body) update.logo_url = String(body.logo_url ?? body.logo ?? "");
  if ("description" in body) update.description = String(body.description ?? "");
  if ("active" in body || "is_active" in body) update.is_active = body.is_active ?? body.active;
  if ("sort_order" in body || "order" in body) update.sort_order = Number(body.sort_order ?? body.order ?? 0);
  return update;
}

export function inquiryToApi(row: InquiryRow) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    company: row.company ?? "",
    country: row.country ?? "",
    notes: row.message ?? "",
    message: row.message ?? "",
    product_id: row.product_id,
    status: toUiStatus(row.status),
    createdAt: row.created_at,
  };
}

export function quoteToApi(row: QuoteRow) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    company: row.company ?? "",
    country: row.country ?? "",
    product: row.product_name ?? "",
    product_name: row.product_name ?? "",
    quantity: row.quantity ?? "",
    notes: row.message ?? "",
    message: row.message ?? "",
    status: toUiStatus(row.status),
    createdAt: row.created_at,
  };
}
