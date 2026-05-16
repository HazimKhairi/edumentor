import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { updateAssignment } from "@/lib/actions";

export async function generateStaticParams() {
  const rows = await db.assignment.findMany({ select: { id: true } });
  return rows.map((a) => ({ id: a.id }));
}

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["Mentor", "Admin"]);
  const { id } = await params;
  const a = await db.assignment.findUnique({
    where: { id },
    include: { course: { select: { code: true } } },
  });
  if (!a) notFound();

  const courses = await db.course.findMany({
    select: { id: true, code: true, title: true },
    orderBy: { semester: "asc" },
  });

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">Edit {a.code}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit assignment</h1>
          <p className="mt-2 text-ink-soft">{a.code}, {a.title}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={updateAssignment} className="card p-6 md:p-8 space-y-6">
            <input type="hidden" name="id" value={a.id} />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <input type="text" name="code" defaultValue={a.code} className="input" />
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" name="title" defaultValue={a.title} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Course</label>
                <select name="courseId" className="input" defaultValue={a.courseId}>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code}, {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Type</label>
                <select name="type" className="input" defaultValue={a.type}>
                  <option>Problem Set</option>
                  <option>Lab</option>
                  <option>Essay</option>
                  <option>Quiz</option>
                  <option>Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Brief</label>
              <textarea
                name="note"
                rows={5}
                defaultValue={a.note}
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Issued</label>
                <input type="date" name="issued" defaultValue={a.issued.toISOString().slice(0, 10)} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Due</label>
                <input type="date" name="due" defaultValue={a.due.toISOString().slice(0, 10)} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Weight</label>
                <input type="number" name="weight" defaultValue={a.weight} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select name="status" className="input" defaultValue={a.status}>
                  <option value="Open">Open</option>
                  <option value="ClosingSoon">Closing soon</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Submissions</label>
                <input type="number" name="submissions" defaultValue={a.submissions} className="input" min="0" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Cohort size</label>
                <input type="number" name="ofCount" defaultValue={a.ofCount} className="input" min="0" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-rule">
              <Link href={`/mentor/assignments/${a.id}/delete`} className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                Delete this assignment
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/mentor/assignments" className="btn btn-ghost">Cancel</Link>
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
