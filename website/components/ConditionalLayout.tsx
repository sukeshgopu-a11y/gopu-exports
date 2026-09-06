"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AnalyticsTracker = dynamic(() => import("./AnalyticsTracker"), {
  ssr: false,
});

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPrivateArea = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  const [analyticsReady, setAnalyticsReady] = useState(false);

  useEffect(() => {
    if (isPrivateArea) return;

    const windowWithIdle = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (windowWithIdle.requestIdleCallback) {
      const idleId = windowWithIdle.requestIdleCallback(() => setAnalyticsReady(true), {
        timeout: 2500,
      });
      return () => windowWithIdle.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setAnalyticsReady(true), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [isPrivateArea]);

  return (
    <>
      {!isPrivateArea && <Navbar />}
      <div
        id="main-content"
        className={isPrivateArea ? undefined : "min-h-screen min-h-[100svh] overflow-x-clip"}
      >
        {children}
      </div>
      {!isPrivateArea && analyticsReady && <AnalyticsTracker />}
      {!isPrivateArea && <Footer />}
    </>
  );
}
