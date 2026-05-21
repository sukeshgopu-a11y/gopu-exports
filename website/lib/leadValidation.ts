export type LeadInput = Record<string, unknown>;

import {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

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

export function buildSourceUrl(req: Request, body: LeadInput) {
  return stringField(body, "source_url", "sourceUrl", "page_url", "pageUrl") || req.headers.get("referer") || "";
}

export function buildTimestamp() {
  return new Date().toISOString();
}
