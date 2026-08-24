import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/login/actions";

// Middleware already redirects unauthenticated requests away from /admin,
// but that's a defense-in-depth belt-and-suspenders check, not the only
// one — a layout render that somehow gets here without a session redirects
// too, rather than trusting middleware alone.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseAdminClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/admin/login");

  return (
    <>
      <div className="admin-header">
        <div className="title">Mahnopoly admin</div>
        <div>
          Signed in as {user.email} &middot;{" "}
          <form action={signOut} style={{ display: "inline" }}>
            <button className="logout-link" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>
      <div className="admin-wrap">
        <div className="admin-tabs">
          <div className="tabgroup">
            <Link className="tab" href="/admin">All properties</Link>
            <Link className="tab" href="/admin/inquiries">Inquiries</Link>
            <Link className="tab" href="/admin/settings">Settings</Link>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
