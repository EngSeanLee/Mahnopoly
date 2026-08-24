import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the staff session cookie on every request (Supabase sessions
// expire and need rotating) and gates everything under /admin except the
// login page itself. Called from middleware.ts at the repo root.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Supabase not configured yet — don't block admin routes on a 500, but
  // don't let them through either. Falls through to the login page, which
  // will fail the same way the inquiry form does until env vars are set.
  if (!url || !publishableKey) return response;

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public even while "logged out" — reset-password in particular has to
  // be, since its recovery token typically arrives as a URL hash
  // fragment the server never sees at all. Gating it here would redirect
  // to /admin/login before the client-side recovery flow ever runs.
  const publicAuthPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
  const isPublicAuthPage = publicAuthPaths.includes(request.nextUrl.pathname);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isPublicAuthPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === "/admin/login" && user) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}
