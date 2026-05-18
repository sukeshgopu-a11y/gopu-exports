"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("./Navbar"));
const Footer = dynamic(() => import("./Footer"));

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
      {!isDashboard && <Footer />}
    </>
  );
}
