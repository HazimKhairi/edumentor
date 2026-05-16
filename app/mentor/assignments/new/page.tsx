import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { createAssignment } from "@/lib/actions";

export const metadata = {
  title: "Add assignment | Mentor",
};

export default async function AddAssignmentPage() {
  await requireRole(["Mentor", "Admin"]);
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
            <span className="text-ink">New</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Create an assignment</h1>
          <p className="mt-2 text-ink-soft">
            Mentees enrolled in the selected course will be notified when this is published.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={createAssignment} className="card p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <input type="text" name="code" required placeholder="PS-04" className="input" />
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" name="title" required placeholder="Relations, equivalence classes, partitions" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Course</label>
                <select name="courseId" required className="input">
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code}, {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Type</label>
                <select name="type" className="input">
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
                placeholder="Describe what mentees need to do, what to submit, and what success looks like."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Issued</label>
                <input type="date" name="issued" required className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Due</label>
                <input type="date" name="due" required className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Weight</label>
                <input type="number" name="weight" defaultValue={10} className="input" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-1.5">Cohort size</label>
                <input type="number" name="ofCount" defaultValue={48} className="input" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/mentor/assignments" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary">Save assignment</button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
