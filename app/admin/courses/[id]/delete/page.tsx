import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { COURSES } from "@/lib/data";

export async function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

export default async function DeleteCoursePage(props: PageProps<"/admin/courses/[id]/delete">) {
  const { id } = await props.params;
  const c = COURSES.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <>
      <SiteNav />
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[700px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/courses" className="hover:text-ink">Courses</Link>{" / "}
            <span className="text-ink">Delete</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Delete course</h1>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[700px] px-6 py-10">
          <div className="card p-6 md:p-8" style={{ borderColor: "rgba(122, 31, 31, 0.3)" }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="size-10 rounded-md bg-oxblood/10 text-oxblood flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 className="font-semibold text-lg">Delete {c.code}, {c.title}?</h2>
                <p className="text-sm text-ink-muted mt-1">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-paper-dark/40 rounded-md p-4 mb-5 text-sm space-y-1">
              <p><span className="text-ink-muted">Code:</span> <span className="font-medium">{c.code}</span></p>
              <p><span className="text-ink-muted">Senior mentor:</span> <span className="font-medium">{c.mentor}</span></p>
              <p><span className="text-ink-muted">Enrolled junior students:</span> <span className="font-medium tabular">{c.enrolled}</span></p>
              <p><span className="text-ink-muted">Sessions:</span> <span className="font-medium tabular">{c.sessions}</span></p>
            </div>

            <p className="text-sm text-ink-soft leading-relaxed mb-5">
              All discussion threads, assignments, attendance records, and
              feedback associated with this course will be archived. Enrolled
              junior students will be notified by email and unenrolled.
            </p>

            <label className="flex items-start gap-2 text-sm cursor-pointer mb-5">
              <input type="checkbox" className="size-4 mt-0.5 accent-oxblood" />
              <span>I understand this will archive {c.enrolled} junior-student records and cannot be undone.</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/admin/courses" className="btn btn-ghost">Cancel</Link>
              <Link
                href="/admin/courses"
                className="btn"
                style={{ backgroundColor: "var(--color-oxblood)", color: "var(--color-bone)" }}
              >
                Delete course
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
