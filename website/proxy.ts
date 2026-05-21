import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (pathname === "/dashboard/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/admin/login") {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminUser } = user
    ? await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .eq("role", "admin")
        .maybeSingle()
    : { data: null };

  if (!user || !adminUser) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("reason", user ? "admin" : "session");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/login"],
};
