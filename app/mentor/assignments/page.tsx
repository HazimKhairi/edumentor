import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { courseIdsForUser, getAssignmentsView } from "@/lib/queries";

export const metadata = {
  title: "Manage assignments | Mentor",
};

const statusBadge: Record<string, string> = {
  Open: "badge badge-fern",
  "Closing soon": "badge badge-saffron",
  Closed: "badge badge-muted",
};

export default async function MentorAssignmentsPage() {
  const user = await requireRole(["Mentor", "Admin"]);
  // M4: only assignments for courses I actually mentor (or all, if admin).
  const myCourseIds = await courseIdsForUser(user.id, user.role);
  const myCourseCodes = (
    await db.course.findMany({
      where: { id: { in: myCourseIds } },
      select: { code: true },
    })
  ).map((c) => c.code);
  const assignments = await getAssignmentsView(myCourseCodes);

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <span className="text-ink">Assignments</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage assignments</h1>
              <p className="mt-2 text-ink-soft">{assignments.length} assignments across your courses.</p>
            </div>
            <Link href="/mentor/assignments/new" className="btn btn-primary">
              <Plus size={16} /> Add assignment
            </Link>
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
                placeholder="Search by code or title"
                className="input pl-9 py-2"
              />
            </label>
            <select className="input max-w-[180px] py-2 text-sm">
              <option>All courses</option>
              <option>MAT CS110</option>
              <option>CSC 234</option>
              <option>MAT 210</option>
            </select>
          </div>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {assignments.map((a) => {
                  const pct = a.of > 0 ? Math.round((a.submissions / a.of) * 100) : 0;
                  return (
                    <tr key={a.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-3 font-medium tabular">{a.code}</td>
                      <td className="px-4 py-3">
                        <Link href={`/assignments/${a.id}`} className="font-medium hover:text-oxblood">
                          {a.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{a.course}</td>
                      <td className="px-4 py-3 text-ink-muted">{a.type}</td>
                      <td className="px-4 py-3 tabular">{a.weight}%</td>
                      <td className="px-4 py-3 tabular text-ink-muted">{a.due}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="tabular text-xs">{a.submissions}/{a.of}</span>
                          <div className="h-1 w-16 rounded-full bg-paper-dark overflow-hidden">
                            <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={statusBadge[a.status]}>{a.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/mentor/assignments/${a.id}/edit`}
                            className="size-8 rounded-sm border border-rule hover:border-ink flex items-center justify-center"
                            aria-label={`Edit ${a.code}`}
                          >
                            <Pencil size={14} />
                          </Link>
                          <Link
                            href={`/mentor/assignments/${a.id}/delete`}
                            className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                            aria-label={`Delete ${a.code}`}
                          >
                            <Trash2 size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
