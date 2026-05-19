"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

const OPT_OUT_KEY = "gopu-analytics-opt-out";
const SESSION_KEY = "gopu-analytics-session";

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
  if (window.localStorage.getItem(OPT_OUT_KEY) === "true") return;
  if (navigator.doNotTrack === "1") return;

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
  const routeKey = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    if (pathname?.startsWith("/products/")) {
      trackEvent("product_view", { slug: pathname.split("/").filter(Boolean)[1] ?? "" });
    }
    trackEvent("page_view", {
      title: document.title,
      search: window.location.search,
    });
  }, [pathname, routeKey]);

  useEffect(() => {
    const startedAt = Date.now();
    const sentDepths = new Set<number>();

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

    const onScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const marker of [25, 50, 75, 90]) {
        if (depth >= marker && !sentDepths.has(marker)) {
          sentDepths.add(marker);
          trackEvent("scroll_depth", { depth: marker });
        }
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        trackEvent("session_duration", { seconds: Math.round((Date.now() - startedAt) / 1000) });
      }
    };

    window.addEventListener("gopu:analytics", onCustomEvent);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick);
    return () => {
      onVisibility();
      window.removeEventListener("gopu:analytics", onCustomEvent);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
