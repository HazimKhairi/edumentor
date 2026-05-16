import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ClassFormatPicker } from "@/components/class-format-picker";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { createClassSession } from "@/lib/actions";

export const metadata = {
  title: "Create class | Mentor",
};

export default async function NewClassPage() {
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
            <Link href="/mentor/classes" className="hover:text-ink">Classes</Link>{" / "}
            <span className="text-ink">New</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Schedule a class</h1>
          <p className="mt-2 text-ink-soft">
            Add a peer-led session to the timetable. Mentees in your cohort will see it on their dashboard.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10">
          <form action={createClassSession} className="card p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Course</label>
              <select name="courseId" required className="input">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}, {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Topic</label>
              <input type="text" name="topic" required placeholder="Strong induction on trees" className="input" />
              <p className="text-xs text-ink-muted mt-1.5">
                One sentence describing the focus of this session.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Date</label>
                <input type="date" name="date" required className="input" />
              </div>
              <div className="col-span-12 md:col-span-6">
                <label className="block text-sm font-medium mb-1.5">Start time</label>
                <input type="time" name="time" required defaultValue="14:00" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Room</label>
              <input type="text" name="room" required placeholder="BD-3, Block A" className="input" />
            </div>

            <ClassFormatPicker />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/mentor/classes" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary">Schedule class</button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
