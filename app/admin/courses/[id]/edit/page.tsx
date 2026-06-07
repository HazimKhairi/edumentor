import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getCourseView } from "@/lib/queries";
import { updateCourse } from "@/lib/actions";

export async function generateStaticParams() {
  const rows = await db.course.findMany({ select: { id: true } });
  return rows.map((c) => ({ id: c.id }));
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("Admin");
  const { id } = await params;
  const c = await getCourseView(id);
  if (!c) notFound();

  const lecturers = await db.user.findMany({
    where: { role: "Admin" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <SiteNav />
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/courses" className="hover:text-ink">Courses</Link>{" / "}
            <span className="text-ink">Edit {c.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit course</h1>
          <p className="mt-2 text-ink-soft">{c.code}, {c.title}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={updateCourse} className="card p-6 md:p-8 space-y-6">
            <input type="hidden" name="id" value={c.id} />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium mb-1.5">Course code</label>
                <input type="text" name="code" defaultValue={c.code} className="input" />
              </div>
              <div className="col-span-12 md:col-span-8">
                <label className="block text-sm font-medium mb-1.5">Course title</label>
                <input type="text" name="title" defaultValue={c.title} className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Abstract</label>
              <textarea
                name="abstract"
                rows={4}
                defaultValue={c.abstract}
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Lecturer</label>
                <select name="lecturerId" defaultValue={c.lecturerId ?? ""} className="input">
                  <option value="">Unassigned</option>
                  {lecturers.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Cohort</label>
                <input type="text" name="cohort" defaultValue={c.cohort} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium mb-1.5">Semester</label>
                <select name="semester" defaultValue={c.semester} className="input">
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-ink-muted bg-paper-dark/40 rounded-sm px-3 py-2">
              Sessions, capacity, pace, progress, enrolment and colour are
              derived from the live course activity and cannot be edited here.
            </p>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-rule">
              <Link href={`/admin/courses/${c.id}/delete`} className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                Delete this course
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
                <button type="submit" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
