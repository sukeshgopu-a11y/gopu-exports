export type LeadInput = Record<string, unknown>;

import {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { z } from "zod";

const MAX_LEAD_PAYLOAD_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_FIELD_LENGTH = 4000;
const SUSPICIOUS_USER_AGENT =
  /(sqlmap|nikto|acunetix|nessus|nmap|masscan|zgrab|dirbuster|gobuster|wpscan|python-requests|go-http-client|java\/|libwww-perl)/i;

type RateBucket = { count: number; resetAt: number };

const leadPayloadSchema = z
  .object({})
  .catchall(
    z.union([
      z.string().max(MAX_FIELD_LENGTH, "Field is too long"),
      z.number(),
      z.boolean(),
      z.null(),
      z.undefined(),
    ])
  );

function getRateStore(): Map<string, RateBucket> {
  const globalForRateLimit = globalThis as typeof globalThis & {
    __gopuLeadRateLimit?: Map<string, RateBucket>;
  };
  if (!globalForRateLimit.__gopuLeadRateLimit) {
    globalForRateLimit.__gopuLeadRateLimit = new Map();
  }
  return globalForRateLimit.__gopuLeadRateLimit;
}

function clientIp(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const store = getRateStore();
  const key = `${clientIp(req)}:${new URL(req.url).pathname}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function sanitizeText(value: string, maxLength = MAX_FIELD_LENGTH) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function stringField(body: LeadInput, ...keys: string[]) {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return sanitizeText(value);
  }
  return "";
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return isValidPhoneNumber(phone);
}

export type NormalizedLeadPhone = {
  country_name: string;
  country_code: string;
  dial_code: string;
  local_phone: string;
  full_phone_e164: string;
  whatsapp_number_e164: string;
  formatted_international: string;
};

function countryName(country: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(country) ?? country;
  } catch {
    return country;
  }
}

export function normalizeLeadPhone(body: LeadInput): NormalizedLeadPhone | null {
  const fullPhone = stringField(body, "full_phone_e164", "phone", "phoneNumber", "phone_number");
  const countryCode = stringField(body, "country_code", "phone_country_code").toUpperCase();
  const localPhone = stringField(body, "local_phone", "localPhone").replace(/\D/g, "");
  const parsed =
    countryCode && localPhone
      ? parsePhoneNumberFromString(localPhone, countryCode as CountryCode)
      : parsePhoneNumberFromString(fullPhone);

  if (!parsed?.isValid()) return null;

  const parsedCountry = parsed.country ?? (countryCode as CountryCode | undefined);
  const dialCode = parsedCountry ? `+${getCountryCallingCode(parsedCountry)}` : `+${parsed.countryCallingCode}`;

  return {
    country_name: stringField(body, "country_name", "phone_country_name") || (parsedCountry ? countryName(parsedCountry) : ""),
    country_code: parsedCountry ?? countryCode,
    dial_code: dialCode,
    local_phone: localPhone || parsed.nationalNumber,
    full_phone_e164: parsed.number,
    whatsapp_number_e164: stringField(body, "whatsapp_number_e164", "whatsapp") || parsed.number,
    formatted_international: parsed.formatInternational(),
  };
}

export function rejectSpam(body: LeadInput) {
  const honeypot = stringField(body, "website", "url", "company_website");
  return Boolean(honeypot);
}

async function verifyTurnstile(req: Request, body: LeadInput) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const required = process.env.TURNSTILE_REQUIRED === "true";
  if (!secret || !required) return null;

  const token = stringField(body, "cf_turnstile_token", "turnstileToken", "cf-turnstile-response");
  if (!token) return "Security verification is required. Please refresh and try again.";

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("remoteip", clientIp(req));

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success ? null : "Security verification failed. Please try again.";
  } catch {
    return "Security verification could not be completed. Please try again.";
  }
}

export type LeadRequestGuard =
  | { ok: true; body: LeadInput }
  | { ok: false; status: number; error: string };

export async function prepareLeadRequest(req: Request): Promise<LeadRequestGuard> {
  const contentType = req.headers.get("content-type") || "";
  const contentLength = Number(req.headers.get("content-length") || 0);
  const userAgent = req.headers.get("user-agent") || "";

  if (contentLength > MAX_LEAD_PAYLOAD_BYTES) {
    return { ok: false, status: 413, error: "Submission is too large. Please shorten your message." };
  }

  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    return { ok: false, status: 415, error: "Unsupported submission format." };
  }

  if (SUSPICIOUS_USER_AGENT.test(userAgent)) {
    return { ok: false, status: 403, error: "Submission could not be accepted." };
  }

  if (isRateLimited(req)) {
    return { ok: false, status: 429, error: "Too many submissions. Please try again later." };
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, status: 400, error: "Invalid submission body." };
  }

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: parsed.error.issues[0]?.message || "Invalid submission body." };
  }

  const turnstileError = await verifyTurnstile(req, parsed.data);
  if (turnstileError) {
    return { ok: false, status: 403, error: turnstileError };
  }

  return { ok: true, body: parsed.data };
}

export function buildSourceUrl(req: Request, body: LeadInput) {
  return stringField(body, "source_url", "sourceUrl", "page_url", "pageUrl") || req.headers.get("referer") || "";
}

export function buildTimestamp() {
  return new Date().toISOString();
}
