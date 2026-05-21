"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export type InternationalPhoneValue = {
  country_name: string;
  country_code: CountryCode;
  dial_code: string;
  local_phone: string;
  full_phone_e164: string;
  whatsapp_number_e164: string;
  is_valid: boolean;
};

type Props = {
  value?: InternationalPhoneValue | null;
  onChange: (value: InternationalPhoneValue) => void;
  error?: string;
  defaultCountry?: CountryCode;
};

const COUNTRIES = getCountries();

function countryName(country: CountryCode) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(country) ?? country;
  } catch {
    return country;
  }
}

function countryFlag(country: CountryCode) {
  return country
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function cleanLocalPhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 18);
}

function buildPhoneValue(country: CountryCode, localPhone: string): InternationalPhoneValue {
  const dialCode = `+${getCountryCallingCode(country)}`;
  const cleanedLocal = cleanLocalPhone(localPhone);
  const parsed = parsePhoneNumberFromString(cleanedLocal, country);
  const isValid = Boolean(parsed?.isValid());
  const e164 = isValid ? parsed!.number : "";

  return {
    country_name: countryName(country),
    country_code: country,
    dial_code: dialCode,
    local_phone: cleanedLocal,
    full_phone_e164: e164,
    whatsapp_number_e164: e164,
    is_valid: isValid,
  };
}

function detectDefaultCountry(fallback: CountryCode): CountryCode {
  if (typeof navigator === "undefined") return fallback;
  const locale = navigator.language || navigator.languages?.[0] || "";
  const region = locale.split("-")[1]?.toUpperCase() as CountryCode | undefined;
  return region && COUNTRIES.includes(region) ? region : fallback;
}

export function InternationalPhoneInput({
  value,
  onChange,
  error,
  defaultCountry = "IN",
}: Props) {
  const initialCountry = value?.country_code ?? detectDefaultCountry(defaultCountry);
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [localPhone, setLocalPhone] = useState(value?.local_phone ?? "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => buildPhoneValue(country, localPhone), [country, localPhone]);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter((item) => {
      const name = countryName(item).toLowerCase();
      const dial = `+${getCountryCallingCode(item)}`;
      return name.includes(query) || item.toLowerCase().includes(query) || dial.includes(query);
    });
  }, [search]);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className={`flex min-h-[46px] w-full overflow-hidden rounded-xl border bg-[#F8FAFC] transition focus-within:ring-2 focus-within:ring-[#0E7490]/10 ${error ? "border-red-300" : "border-[#D9E2EC] focus-within:border-[#0E7490]"}`}>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex min-w-[136px] items-center gap-2 border-r border-[#D9E2EC] bg-white px-3 text-left text-sm font-semibold text-[#0F172A] outline-none transition hover:bg-[#F1F5F9] sm:min-w-[188px]"
          aria-label="Select phone country"
        >
          <span className="text-lg leading-none">{countryFlag(country)}</span>
          <span className="hidden max-w-[92px] truncate sm:inline">{countryName(country)}</span>
          <span className="ml-auto text-[#0E7490]">+{getCountryCallingCode(country)}</span>
        </button>
        <input
          value={localPhone}
          onChange={(event) => setLocalPhone(cleanLocalPhone(event.target.value))}
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="Local phone number"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
        />
      </div>

      {open ? (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-2xl">
          <div className="border-b border-[#EEF2F7] p-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or dial code"
              className="w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-3 py-2 text-sm outline-none focus:border-[#0E7490]"
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {filteredCountries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCountry(item);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[#E6F4F7] ${item === country ? "bg-[#E6F4F7] font-bold text-[#0A5A70]" : "text-[#334155]"}`}
              >
                <span className="text-lg">{countryFlag(item)}</span>
                <span className="min-w-0 flex-1 truncate">{countryName(item)}</span>
                <span className="font-semibold text-[#0E7490]">+{getCountryCallingCode(item)}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
