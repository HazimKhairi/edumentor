import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CheckCircle2, ExternalLink, FileText } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSeeMentorContent, getAssignmentsView } from "@/lib/queries";
import { submitAssignmentWork, withdrawSubmission } from "@/lib/actions";
import { RequiredMark } from "@/components/required-mark";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  Open: "badge badge-fern",
  "Closing soon": "badge badge-saffron",
  Closed: "badge badge-muted",
};

function errorMessage(error: string | undefined): string | null {
  if (!error) return null;
  if (error === "missing") return "Write something in the submission box.";
  if (error === "closed") return "Submissions for this assignment are closed.";
  // Forwarded message from lib/upload.ts (size or type errors)
  return decodeURIComponent(error);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const me = await requireUser();
  const { id } = await params;
  const { error, submitted } = await searchParams;
  const assignments = await getAssignmentsView();
  const a = assignments.find((x) => x.id === id);
  if (!a) notFound();

  // Scope: a mentee may only open an assignment from their own mentor for that
  // course; a mentor only their own. Admins bypass. Without this, any URL
  // leaks another mentor's assignment.
  if (!(await canSeeMentorContent(me, a.courseId, a.mentorId))) notFound();

  const mySubmission = await db.assignmentSubmission.findUnique({
    where: { assignmentId_menteeId: { assignmentId: a.id, menteeId: me.id } },
  });

  const pct = a.of ? Math.round((a.submissions / a.of) * 100) : 0;
  const isClosed = a.status === "Closed";

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">{a.code}</span>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={statusBadge[a.status]}>{a.status}</span>
            <span className="text-xs text-ink-muted">{a.course}, {a.type}</span>
            <span className="badge badge-oxblood">{a.weight}% of grade</span>
            {mySubmission ? (
              <span className="badge badge-fern inline-flex items-center gap-1">
                <CheckCircle2 size={12} /> Submitted
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{a.title}</h1>
          <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">{a.note}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span>Issued <span className="text-ink font-medium">{a.issued}</span></span>
            <span>Due <span className="text-ink font-medium">{a.due}</span></span>
            <span>{a.submissions}/{a.of} submitted ({pct}%)</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-lg mb-4">Brief</h2>
              <p className="text-ink-soft leading-relaxed whitespace-pre-line">
                {a.note}
              </p>

              <h3 className="font-semibold text-base mt-6 mb-3">Rubric</h3>
              <ul className="divide-y divide-rule">
                {[
                  { key: "Correctness", weight: 40 },
                  { key: "Clarity of writing", weight: 25 },
                  { key: "Completeness", weight: 20 },
                  { key: "Formatting and notation", weight: 15 },
                ].map((r) => (
                  <li key={r.key} className="py-2.5 flex items-center justify-between text-sm">
                    <span>{r.key}</span>
                    <span className="font-semibold tabular text-ink-muted">{r.weight}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6" id="submit">
              {submitted ? (
                <div className="mb-4 rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern">
                  Submission recorded.
                </div>
              ) : null}
              {errorMessage(error) ? (
                <div className="mb-4 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
                  {errorMessage(error)}
                </div>
              ) : null}

              {isClosed && !mySubmission ? (
                <>
                  <h2 className="font-semibold text-lg mb-2">This assignment is closed</h2>
                  <p className="text-sm text-ink-muted">
                    Submissions are no longer accepted.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-semibold text-lg mb-1">
                    {mySubmission ? "Your submission" : "Submit your work"}
                  </h2>
                  <p className="text-sm text-ink-muted mb-5">
                    {mySubmission
                      ? "You can re-submit until the due date. Last submission is the one graded."
                      : "Paste a write-up or attach a link to your work (Github, Google Docs, etc.)."}
                  </p>

                  <form
                    action={submitAssignmentWork}
                    className="space-y-4"
                  >
                    <input type="hidden" name="assignmentId" value={a.id} />

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Write-up<RequiredMark />
                      </label>
                      <textarea
                        name="body"
                        required
                        rows={6}
                        defaultValue={mySubmission?.body ?? ""}
                        placeholder="Notes, summary, or the answer itself."
                        className="input"
                        style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Upload file (optional)
                        </label>
                        <input
                          type="file"
                          name="file"
                          accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.zip,.csv,.xlsx,.pptx"
                          className="block w-full text-sm file:mr-3 file:rounded-sm file:border file:border-rule file:bg-paper-dark file:text-ink file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-paper-dark/70"
                        />
                        <p className="text-xs text-ink-muted mt-1.5">
                          PDF, Word, slides, image, or zip. 8 MB max.
                        </p>
                        {mySubmission?.fileName && mySubmission?.filePath ? (
                          <p className="text-xs text-ink-muted mt-1.5">
                            Current:{" "}
                            <a
                              href={mySubmission.filePath}
                              className="text-oxblood font-medium hover:underline"
                              target="_blank"
                              rel="noopener"
                            >
                              {mySubmission.fileName}
                            </a>
                            . Upload a new file to replace.
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Or link to file / repo (optional)
                        </label>
                        <input
                          type="url"
                          name="linkUrl"
                          defaultValue={mySubmission?.linkUrl ?? ""}
                          placeholder="https://github.com/... or Drive link"
                          className="input"
                        />
                        <p className="text-xs text-ink-muted mt-1.5">
                          Use this if your work lives elsewhere.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
                      <Link href="/assignments" className="btn btn-ghost">Cancel</Link>
                      <button type="submit" className="btn btn-primary">
                        {mySubmission ? "Update submission" : "Submit work"}
                      </button>
                    </div>
                  </form>

                  {mySubmission && (mySubmission.fileName || mySubmission.linkUrl) ? (
                    <div className="mt-5 pt-5 border-t border-rule space-y-2">
                      <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
                        On record
                      </p>
                      {mySubmission.filePath && mySubmission.fileName ? (
                        <a
                          href={mySubmission.filePath}
                          target="_blank"
                          rel="noopener"
                          className="card p-3 flex items-center gap-3 hover:border-ink"
                        >
                          <span className="size-8 rounded bg-oxblood/15 text-oxblood flex items-center justify-center">
                            <FileText size={14} />
                          </span>
                          <span className="text-sm font-medium flex-1 truncate">
                            {mySubmission.fileName}
                          </span>
                          <span className="text-xs text-ink-muted">Download</span>
                        </a>
                      ) : null}
                      {mySubmission.linkUrl ? (
                        <a
                          href={mySubmission.linkUrl}
                          target="_blank"
                          rel="noopener"
                          className="card p-3 flex items-center gap-3 hover:border-ink"
                        >
                          <span className="size-8 rounded bg-saffron/15 text-saffron flex items-center justify-center">
                            <ExternalLink size={14} />
                          </span>
                          <span className="text-sm font-medium flex-1 truncate">
                            {mySubmission.linkUrl}
                          </span>
                          <span className="text-xs text-ink-muted">Open</span>
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {mySubmission ? (
                    <form action={withdrawSubmission} className="mt-3">
                      <input type="hidden" name="assignmentId" value={a.id} />
                      <button
                        type="submit"
                        className="text-xs text-oxblood hover:text-oxblood-deep font-medium"
                      >
                        Withdraw submission
                      </button>
                    </form>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-base mb-4">Submission status</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-baseline justify-between">
                  <span className="text-ink-muted">Due</span>
                  <span className="font-semibold">{a.due}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-ink-muted">Issued</span>
                  <span className="font-medium">{a.issued}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-ink-muted">Type</span>
                  <span className="font-medium">{a.type}</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-ink-muted">Weight</span>
                  <span className="font-semibold tabular">{a.weight}%</span>
                </li>
                <li className="flex items-baseline justify-between">
                  <span className="text-ink-muted">Mine</span>
                  {mySubmission ? (
                    <span className="badge badge-fern inline-flex items-center gap-1">
                      <Check size={10} /> In
                    </span>
                  ) : (
                    <span className="badge badge-muted">Not submitted</span>
                  )}
                </li>
                {mySubmission?.grade ? (
                  <li className="flex items-baseline justify-between">
                    <span className="text-ink-muted">Grade</span>
                    <span className="font-semibold text-fern">{mySubmission.grade}</span>
                  </li>
                ) : null}
              </ul>

              <div className="mt-5 pt-5 border-t border-rule">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink-muted">Class submissions</span>
                  <span className="font-semibold tabular">{a.submissions}/{a.of}</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                  <div
                    className="h-full bg-oxblood rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-base mb-3">Need help?</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Bring questions to the discussion room.
              </p>
              <Link href="/discussion" className="btn btn-ghost btn-sm w-full">
                Open discussion
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
