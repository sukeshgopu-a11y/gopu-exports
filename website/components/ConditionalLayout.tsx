"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnalyticsTracker from "./AnalyticsTracker";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div id="main-content">{children}</div>
      {!isDashboard && (
        <>
          <AnalyticsTracker />
        </>
      )}
      {!isDashboard && <Footer />}
    </>
  );
}
