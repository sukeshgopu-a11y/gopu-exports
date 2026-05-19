"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CONSENT_KEY = "gopu-analytics-consent";
const SESSION_KEY = "gopu-analytics-session";

type Consent = "accepted" | "declined" | null;

function getSessionId() {
  let sessionId = window.localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "Other";
}

async function trackEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4000);

  try {
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        session_id: getSessionId(),
        path: window.location.pathname,
        referrer: document.referrer || "",
        device: detectDevice(),
        browser: detectBrowser(),
        metadata,
      }),
      keepalive: true,
      signal: controller.signal,
    });
  } catch {
    // Analytics must never interrupt buyer journeys.
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>(() => {
    if (typeof window === "undefined") return null;
    return (window.localStorage.getItem(CONSENT_KEY) as Consent) ?? null;
  });
  const routeKey = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    if (consent !== "accepted") return;
    trackEvent("page_view", {
      title: document.title,
      search: window.location.search,
    });
  }, [consent, routeKey]);

  useEffect(() => {
    if (consent !== "accepted") return;

    const onCustomEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ eventType?: string; metadata?: Record<string, unknown> }>).detail;
      if (detail?.eventType) trackEvent(detail.eventType, detail.metadata ?? {});
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!link) return;

      const label = (link.getAttribute("aria-label") || link.textContent || "").trim().slice(0, 120);
      const href = "href" in link ? link.href : "";
      if (href.includes("wa.me") || href.includes("whatsapp")) {
        trackEvent("whatsapp_click", { label, href });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_click", { label });
      } else if (href.startsWith("tel:")) {
        trackEvent("phone_click", { label });
      } else if (/quote|enquiry|inquiry|contact/i.test(label) || /\/contact|\/enquiry/i.test(href)) {
        trackEvent("cta_click", { label, href });
      }
    };

    window.addEventListener("gopu:analytics", onCustomEvent);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("gopu:analytics", onCustomEvent);
      document.removeEventListener("click", onClick);
    };
  }, [consent]);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  if (consent) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 sm:bottom-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
      <div>
        <p className="text-sm font-bold text-slate-900">Privacy-friendly website analytics</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          We use anonymous analytics to understand buyer interest and improve product enquiry flows. No passwords or form messages are tracked.
        </p>
      </div>
      <div className="mt-3 flex gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => choose("declined")}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="rounded-lg bg-[#0E7490] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0A5A70]"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
