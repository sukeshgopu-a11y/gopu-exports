"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Topbar() {
  return (
    <header className="min-h-20 bg-white border-b border-gray-100 px-4 py-4 sm:px-6 lg:h-24 lg:px-10 flex items-center justify-between gap-4">

      {/* Left */}
      <div className="flex items-center gap-4">
        <BrandLogo markOnly className="hidden h-11 w-11 md:block" />
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            Welcome back, Admin
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="hidden items-center gap-5 md:flex">

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 w-80">
          <Search className="text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative bg-gray-100 p-3 rounded-2xl hover:bg-gray-200 transition">
          <Bell size={22} className="text-gray-700" />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-2xl">
          <UserCircle size={38} className="text-gray-700" />

          <div>
            <p className="font-semibold text-sm text-[#0F172A]">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              admin@gopuexports.com
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
