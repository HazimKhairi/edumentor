import Link from "next/link";
import { Search, Trash2, UserPlus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { USERS } from "@/lib/data";

export const metadata = {
  title: "Manage users | Admin",
};

const roleBadge: Record<string, string> = {
  Admin: "badge badge-oxblood",
  Mentor: "badge badge-saffron",
  Mentee: "badge badge-fern",
};

const statusBadge: Record<string, string> = {
  Active: "badge badge-fern",
  Probation: "badge badge-saffron",
  Suspended: "badge badge-oxblood",
};

export default function AdminUsersPage() {
  const counts = USERS.reduce<Record<string, number>>((a, u) => {
    a[u.role] = (a[u.role] ?? 0) + 1;
    return a;
  }, {});

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <span className="text-ink">Users</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage users</h1>
              <p className="mt-2 text-ink-soft">
                {USERS.length} total, {counts.Mentee ?? 0} mentees, {counts.Mentor ?? 0} mentors, {counts.Admin ?? 0} lecturers.
              </p>
            </div>
            <button className="btn btn-primary">
              <UserPlus size={16} /> Invite user
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <label className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                placeholder="Search by name, identity, role"
                className="input pl-9 py-2"
              />
            </label>
            <select className="input max-w-[180px] py-2 text-sm">
              <option>All roles</option>
              <option>Mentee</option>
              <option>Mentor</option>
              <option>Admin</option>
            </select>
          </div>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Identity</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-paper-dark/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-paper-dark text-ink-muted flex items-center justify-center text-xs font-semibold">
                          {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular text-ink-muted">{u.identity}</td>
                    <td className="px-4 py-3"><span className={roleBadge[u.role]}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={statusBadge[u.status]}>{u.status}</span></td>
                    <td className="px-4 py-3 text-ink-muted tabular">{u.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/users/${u.id}/delete`}
                          className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                          aria-label={`Delete ${u.name}`}
                        >
                          <Trash2 size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
