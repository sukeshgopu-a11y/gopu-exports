"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default function LocaleDetector() {
  useEffect(() => {
    if (window.localStorage.getItem("gopu-locale-detected")) return;
    const pathLocale = window.location.pathname.split("/").filter(Boolean)[0];
    if (pathLocale && isLocale(pathLocale)) return;

    const preferred = navigator.language.split("-")[0]?.toLowerCase();
    window.localStorage.setItem("gopu-locale-detected", "1");

    if (preferred && preferred !== DEFAULT_LOCALE && isLocale(preferred)) {
      window.location.href = `/${preferred}`;
    }
  }, []);

  return null;
}
