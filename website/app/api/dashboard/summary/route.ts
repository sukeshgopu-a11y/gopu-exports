import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { inquiryToApi, type InquiryRow } from "@/src/lib/supabase/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const [totalInquiries, newInquiries, products, markets, responded, recent] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("country").not("country", "is", null).limit(500),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).in("status", ["replied", "closed"]),
    supabase
      .from("inquiries")
      .select("id,name,email,phone,company,country,message,product_id,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<InquiryRow[]>(),
  ]);

  const firstError =
    totalInquiries.error || newInquiries.error || products.error || markets.error || responded.error || recent.error;

  if (firstError) {
    console.error("Dashboard summary failed", firstError.message);
    return NextResponse.json({ error: "Unable to load dashboard summary." }, { status: 500 });
  }

  const countryCount = new Set(
    (markets.data ?? [])
      .map((item) => item.country?.trim())
      .filter((country): country is string => Boolean(country))
  ).size;
  const total = totalInquiries.count ?? 0;

  return NextResponse.json({
    stats: {
      total,
      newCount: newInquiries.count ?? 0,
      products: products.count ?? 0,
      markets: countryCount,
      responseRate: total > 0 ? Math.round(((responded.count ?? 0) / total) * 100) : 0,
    },
    recent: (recent.data ?? []).map(inquiryToApi),
  });
}
