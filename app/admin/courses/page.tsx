import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { COURSES } from "@/lib/data";

export const metadata = {
  title: "Manage courses | Admin",
  description: "Admin course management.",
};

export default function AdminCoursesPage() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <span className="text-ink">Courses</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage courses</h1>
              <p className="mt-2 text-ink-soft">{COURSES.length} courses in the catalogue.</p>
            </div>
            <Link href="/admin/courses/new" className="btn btn-primary">
              <Plus size={16} /> Add course
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
              <option>All subjects</option>
              <option>Mathematics</option>
              <option>Computer Science</option>
              <option>Statistics</option>
            </select>
          </div>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Mentor (senior)</th>
                  <th className="px-4 py-3 font-semibold">Cohort</th>
                  <th className="px-4 py-3 font-semibold">Enrolment</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {COURSES.map((c) => {
                  const pct = Math.round((c.enrolled / c.capacity) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-3 font-medium tabular">{c.code}</td>
                      <td className="px-4 py-3">
                        <Link href={`/courses/${c.id}`} className="font-medium hover:text-oxblood">
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{c.mentor}</td>
                      <td className="px-4 py-3 text-ink-muted">{c.cohort}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="tabular text-xs">{c.enrolled}/{c.capacity}</span>
                          <div className="h-1 w-20 rounded-full bg-paper-dark overflow-hidden">
                            <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/courses/${c.id}/edit`}
                            className="size-8 rounded-sm border border-rule hover:border-ink flex items-center justify-center"
                            aria-label={`Edit ${c.code}`}
                          >
                            <Pencil size={14} />
                          </Link>
                          <Link
                            href={`/admin/courses/${c.id}/delete`}
                            className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                            aria-label={`Delete ${c.code}`}
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
