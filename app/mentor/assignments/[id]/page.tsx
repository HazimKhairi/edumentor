import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink, FileText, Pencil } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { menteeIdsForMentor } from "@/lib/queries";
import { gradeSubmission } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function MentorAssignmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ graded?: string; error?: string }>;
}) {
  const me = await requireRole(["Mentor", "Admin"]);
  const { id } = await params;
  const { graded, error } = await searchParams;

  const assignment = await db.assignment.findUnique({
    where: { id },
    include: { course: { select: { id: true, code: true, title: true } } },
  });
  if (!assignment) notFound();

  // Mentor may only open assignments they own — not another mentor's of the
  // same course. Admin bypasses.
  if (me.role === "Mentor" && assignment.mentorId !== me.id) notFound();

  // Submissions to show: a mentor sees only their assigned mentees' work; an
  // admin sees everyone's.
  const menteeFilter =
    me.role === "Mentor"
      ? { menteeId: { in: await menteeIdsForMentor(me.id, assignment.courseId) } }
      : {};

  const submissions = await db.assignmentSubmission.findMany({
    where: { assignmentId: id, ...menteeFilter },
    include: { mentee: { select: { name: true, identity: true } } },
    orderBy: { submittedAt: "asc" },
  });

  const gradedCount = submissions.filter((s) => s.grade).length;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1000px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>{" / "}
            <Link href="/mentor/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">{assignment.code}</span>
          </div>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs text-ink-muted">
                {assignment.code}, {assignment.course.code}, weight {assignment.weight}%
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{assignment.title}</h1>
              <p className="mt-2 text-ink-soft">
                {submissions.length} submission{submissions.length === 1 ? "" : "s"} from your mentees, {gradedCount} graded.
              </p>
            </div>
            <Link href={`/mentor/assignments/${assignment.id}/edit`} className="btn btn-ghost">
              <Pencil size={16} /> Edit assignment
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1000px] px-6 py-10 space-y-4">
          {graded ? (
            <div className="rounded-md border border-fern/40 bg-fern/[0.06] px-4 py-2.5 text-sm text-fern font-medium">
              Grade saved.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-4 py-2.5 text-sm text-oxblood">
              {error === "not-your-mentee"
                ? "That submission is not from one of your mentees."
                : decodeURIComponent(error)}
            </div>
          ) : null}

          {submissions.length === 0 ? (
            <div className="card p-6 text-sm text-ink-muted">
              No submissions yet from your mentees.
            </div>
          ) : (
            <ul className="space-y-4">
              {submissions.map((s) => (
                <li key={s.id} className="card p-5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <div className="font-medium">{s.mentee.name}</div>
                      <div className="text-xs text-ink-muted tabular">{s.mentee.identity}</div>
                    </div>
                    <div className="text-xs text-ink-muted tabular">
                      submitted {s.submittedAt.toISOString().slice(0, 10)}
                    </div>
                  </div>

                  <div
                    className="text-sm text-ink-soft bg-paper-dark/30 rounded-md px-3 py-2.5 mb-3"
                    style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
                  >
                    {s.body}
                  </div>

                  {(s.fileName || s.linkUrl) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {s.fileName && s.filePath ? (
                        <a
                          href={s.filePath}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-2 rounded-md border border-rule px-3 py-1.5 text-xs hover:border-ink"
                        >
                          <FileText size={12} />
                          <span className="truncate max-w-[200px]">{s.fileName}</span>
                        </a>
                      ) : null}
                      {s.linkUrl ? (
                        <a
                          href={s.linkUrl}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1.5 text-xs text-oxblood underline"
                        >
                          <ExternalLink size={12} />
                          <span className="truncate max-w-[240px]">{s.linkUrl}</span>
                        </a>
                      ) : null}
                    </div>
                  )}

                  <form action={gradeSubmission} className="flex items-end gap-2 pt-3 border-t border-rule">
                    <input type="hidden" name="submissionId" value={s.id} />
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Grade</label>
                      <input
                        type="text"
                        name="grade"
                        defaultValue={s.grade ?? ""}
                        placeholder="e.g. A, 18/20, 85%"
                        className="input py-1.5 w-40 text-sm"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                      {s.grade ? "Update grade" : "Save grade"}
                    </button>
                    {s.grade ? (
                      <span className="inline-flex items-center gap-1 text-xs text-fern font-medium pb-2">
                        <CheckCircle2 size={13} /> {s.grade}
                      </span>
                    ) : null}
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
