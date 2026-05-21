export type LeadInput = Record<string, unknown>;

export function stringField(body: LeadInput, ...keys: string[]) {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return /^\+?\d{7,15}$/.test(phone);
}

export function rejectSpam(body: LeadInput) {
  const honeypot = stringField(body, "website", "url", "company_website");
  return Boolean(honeypot);
}

export function buildSourceUrl(req: Request, body: LeadInput) {
  return stringField(body, "source_url", "sourceUrl", "page_url", "pageUrl") || req.headers.get("referer") || "";
}

export function buildTimestamp() {
  return new Date().toISOString();
}

