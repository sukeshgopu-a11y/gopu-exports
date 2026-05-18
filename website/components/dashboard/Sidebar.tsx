"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Image as ImageIcon,
  LogOut,
  Tag,
  Award,
  BookOpen,
  FileText,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const NAV = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Categories", href: "/dashboard/categories", icon: Tag },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award },
  { name: "Blogs", href: "/dashboard/blogs", icon: BookOpen },
  { name: "Gallery", href: "/dashboard/gallery", icon: ImageIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0B1220] text-white px-5 py-7 flex flex-col shrink-0">

      {/* Logo */}
      <div className="mb-10 px-2">
        <BrandLogo variant="light" className="h-12 w-auto" />
        <div className="mt-2 text-[9px] font-semibold tracking-[0.35em] text-[#67C9D8]">
          ADMIN
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ name, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                active
                  ? "bg-[#0E7490] text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition text-sm font-medium mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>

      <div className="mt-4 pt-4 border-t border-white/10 px-2">
        <p className="text-xs text-slate-500">GOPU Exports</p>
        <p className="text-[10px] text-slate-600 mt-0.5">Admin Panel v2.0</p>
      </div>
    </aside>
  );
}
