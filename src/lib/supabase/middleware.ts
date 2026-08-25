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

  // Being logged in isn't enough — must be in the staff allowlist (see
  // supabase/schema.sql). Owners get real logins too (see /owner), and
  // without this check an owner session would pass every gate below as
  // if it were staff. src/app/admin/(protected)/layout.tsx repeats this
  // check server-side too — this one just avoids the extra round trip
  // for the common case of no session at all.
  let isStaff = false;
  let isOwner = false;
  if (user?.email) {
    const { data: staffRow } = await supabase
      .from("staff")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();
    isStaff = !!staffRow;

    const { data: ownerRow } = await supabase
      .from("owners")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    isOwner = !!ownerRow;
  }

  // Public even while "logged out" — reset-password/set-password in
  // particular have to be, since their recovery token typically arrives
  // as a URL hash fragment the server never sees at all. Gating them here
  // would redirect to the login page before the client-side recovery flow
  // ever runs.
  const publicAuthPaths = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/owner/login",
    "/owner/set-password",
  ];
  const isPublicAuthPage = publicAuthPaths.includes(request.nextUrl.pathname);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isOwnerRoute = request.nextUrl.pathname.startsWith("/owner");

  if (isAdminRoute && !isPublicAuthPage && !isStaff) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === "/admin/login" && isStaff) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  // Entry to /owner only requires *some* session here, deliberately
  // looser than the isOwner check below — a just-invited owner's very
  // first request after setting their password has a valid session but
  // isn't linked to an owners row yet (see claimOwnerRow in
  // src/lib/owners.ts). That linking is a write, which belongs in
  // src/app/owner/(protected)/layout.tsx, not here; if it fails to find a
  // match at all, that layout redirects back to /owner/login itself.
  if (isOwnerRoute && !isPublicAuthPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/owner/login";
    return NextResponse.redirect(loginUrl);
  }

  // Bouncing away from the login page itself needs the stricter isOwner
  // check, not just "a session exists" — otherwise a staff member (or
  // anyone else with a session but no owners row) who lands on
  // /owner/login would bounce to /owner, which would bounce them right
  // back here, looping.
  if (request.nextUrl.pathname === "/owner/login" && isOwner) {
    const ownerUrl = request.nextUrl.clone();
    ownerUrl.pathname = "/owner";
    return NextResponse.redirect(ownerUrl);
  }

  return response;
}
