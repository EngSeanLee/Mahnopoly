import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { claimOwnerRow, getOwnerByAuthUser } from "@/lib/owners";
import { signOut } from "@/app/owner/login/actions";

// Middleware already redirects unauthenticated requests away from /owner,
// but that's a defense-in-depth belt-and-suspenders check, not the only
// one. This also does the one thing middleware can't: on an owner's very
// first login, link their new Supabase Auth account back to the owners
// row we created for them by email (see claimOwnerRow in
// src/lib/owners.ts for why that has to happen server-side).
export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseAdminClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user || !user.email) redirect("/owner/login");

  let owner = supabase ? await getOwnerByAuthUser(supabase, user.id) : undefined;
  if (!owner) {
    await claimOwnerRow(user.id, user.email);
    owner = supabase ? await getOwnerByAuthUser(supabase, user.id) : undefined;
  }
  // Logged in, but no owners row matches this email at all — not someone
  // this portal knows about.
  if (!owner) redirect("/owner/login");

  return (
    <>
      <div className="admin-header">
        <div className="title">Mahnopoly Owner Portal</div>
        <div>
          Signed in as {owner.name} &middot;{" "}
          <form action={signOut} style={{ display: "inline" }}>
            <button className="logout-link" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>
      <div className="admin-wrap">{children}</div>
    </>
  );
}
