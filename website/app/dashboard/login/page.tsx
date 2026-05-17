"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">

        <div className="mb-8 text-center">
          <div className="text-[32px] font-black tracking-[-0.03em] text-[#0F172A]">
            GOPU
          </div>
          <div className="text-[10px] font-semibold tracking-[0.35em] text-[#0E7490]">
            EXPORTS ADMIN
          </div>
          <p className="mt-4 text-sm text-[#64748B]">
            Sign in to your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@gopuexports.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D9E2EC] rounded-2xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#0E7490] focus:border-[#0E7490]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[#374151]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D9E2EC] rounded-2xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#0E7490] focus:border-[#0E7490]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 transition text-white py-3 rounded-2xl font-semibold text-sm"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
