import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { UsersTable, type AdminUserRow } from "./users-table";

export const metadata = {
  title: "Manage users | Admin",
};

export default async function AdminUsersPage() {
  await requireRole("Admin");

  const users = await db.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] });
  const rows: AdminUserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    identity: u.identity,
    role: u.role,
    status: u.status,
    joined: u.joined.toISOString().slice(0, 10),
  }));
  const counts = users.reduce<Record<string, number>>((a, u) => {
    a[u.role] = (a[u.role] ?? 0) + 1;
    return a;
  }, {});

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-4">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <span className="text-ink">Users</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Manage users</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {users.length} total, {counts.Mentee ?? 0} mentees, {counts.Mentor ?? 0} mentors, {counts.Admin ?? 0} lecturers.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 pb-12">
          <UsersTable users={rows} />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
