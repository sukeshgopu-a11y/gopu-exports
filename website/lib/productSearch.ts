function words(value: string): string[] {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase("en").match(/[\p{L}\p{N}]+/gu) ?? [];
}

/** Match word prefixes, not arbitrary substrings: cumin must not match curcumin. */
export function matchesProductSearch(values: Array<string | undefined>, query: string): boolean {
  const terms = words(query);
  if (!terms.length) return true;
  const haystack = words(values.filter(Boolean).join(" "));
  return terms.every(term => haystack.some(word => word.startsWith(term)));
}
