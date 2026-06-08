import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { deleteAssignment } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function DeleteAssignmentPage({
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

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[700px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">Delete</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Delete assignment</h1>
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
                <h2 className="font-semibold text-lg">Delete {a.code}, {a.title}?</h2>
                <p className="text-sm text-ink-muted mt-1">All submissions for this assignment will be archived.</p>
              </div>
            </div>

            <div className="bg-paper-dark/40 rounded-md p-4 mb-5 text-sm space-y-1">
              <p><span className="text-ink-muted">Course:</span> <span className="font-medium">{a.course.code}</span></p>
              <p><span className="text-ink-muted">Type:</span> <span className="font-medium">{a.type}</span></p>
              <p><span className="text-ink-muted">Weight:</span> <span className="font-medium tabular">{a.weight}%</span></p>
              <p><span className="text-ink-muted">Submissions:</span> <span className="font-medium tabular">{a.submissions} of {a.ofCount}</span></p>
            </div>

            <p className="text-sm text-ink-soft leading-relaxed mb-5">
              Mentees will be notified by email. Submitted work and grades
              will be retained in archive for 12 months.
            </p>

            <label className="flex items-start gap-2 text-sm cursor-pointer mb-5">
              <input type="checkbox" className="size-4 mt-0.5 accent-oxblood" />
              <span>I understand this action cannot be undone.</span>
            </label>

            <form action={deleteAssignment} className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <input type="hidden" name="id" value={a.id} />
              <Link href="/mentor/assignments" className="btn btn-ghost">Cancel</Link>
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "var(--color-oxblood)", color: "var(--color-bone)" }}
              >
                Delete assignment
              </button>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
