import editorial from "./blogEditorial.json";
// Exact, slug-scoped legacy copy revisions, including CMS content and SEO fields.
export function cleanPublicBlog<T extends { slug: string; updatedAt?: string }>(post: T): T {
  const revisions = (editorial as Record<string, { before: string; after: string }[]>)[post.slug] ?? [];
  let changed = false;
  function visit(value: unknown): unknown {
    if (typeof value === "string") {
      const result = revisions.reduce((text, revision) => text.split(revision.before).join(revision.after), value);
      if (result !== value) changed = true;
      return result;
    }
    if (Array.isArray(value)) return value.map(visit);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)]));
    return value;
  }
  const result = visit(post) as T;
  if (changed && (!result.updatedAt || Date.parse(result.updatedAt) < Date.parse("2026-09-16"))) result.updatedAt = "2026-09-16";
  return result;
}
