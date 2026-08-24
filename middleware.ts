import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
  // Vercel's Edge runtime rejected this middleware — something in the
  // @supabase/ssr chain isn't Edge-compatible. Node.js runtime middleware
  // is stable as of Next.js 15.5+; costs a little latency vs. Edge, not
  // meaningful for an admin-only route.
  runtime: "nodejs",
};
