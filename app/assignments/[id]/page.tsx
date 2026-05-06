import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ASSIGNMENTS } from "@/lib/data";

export async function generateStaticParams() {
  return ASSIGNMENTS.map((a) => ({ id: a.id }));
}

const statusBadge: Record<string, string> = {
  Open: "badge badge-fern",
  "Closing soon": "badge badge-saffron",
  Closed: "badge badge-muted",
};

export default async function AssignmentDetailPage(props: PageProps<"/assignments/[id]">) {
  const { id } = await props.params;
  const a = ASSIGNMENTS.find((x) => x.id === id);
  if (!a) notFound();

  const pct = Math.round((a.submissions / a.of) * 100);
  const isClosed = a.status === "Closed";

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/assignments" className="hover:text-ink">Assignments</Link>{" / "}
            <span className="text-ink">{a.code}</span>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={statusBadge[a.status]}>{a.status}</span>
            <span className="text-xs text-ink-muted">{a.course}, {a.type}</span>
            <span className="badge badge-oxblood">{a.weight}% of grade</span>
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
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="card p-6">
              <h2 className="font-semibold text-lg mb-4">Brief</h2>
              <div className="prose prose-sm max-w-none text-ink-soft leading-relaxed space-y-4">
                <p>
                  This {a.type.toLowerCase()} covers material from weeks 3 to 5
                  of {a.course}. Read the brief carefully before submitting.
                  Late work loses two points per day, no exceptions.
                </p>
                <p>
                  Use proper notation. Hand-written or LaTeX submissions are
                  both accepted. PDF only for digital submissions, maximum
                  10MB. Image scans must be legible.
                </p>
              </div>

              <h3 className="font-semibold text-base mt-6 mb-3">Learning outcomes</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Demonstrate clear logical structure in proofs",
                  "Identify the right inductive variable for each problem",
                  "Translate informal arguments into rigorous notation",
                ].map((o) => (
                  <li key={o} className="flex items-start gap-2">
                    <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-lg mb-4">Rubric</h2>
              <ul className="divide-y divide-rule">
                {[
                  { key: "Correctness", weight: 40 },
                  { key: "Clarity of writing", weight: 25 },
                  { key: "Completeness", weight: 20 },
                  { key: "Formatting and notation", weight: 15 },
                ].map((r) => (
                  <li key={r.key} className="py-3 flex items-center justify-between text-sm">
                    <span>{r.key}</span>
                    <span className="font-semibold tabular text-ink-muted">{r.weight}%</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SUBMIT FORM */}
            {!isClosed ? (
              <div className="card p-6" id="submit">
                <h2 className="font-semibold text-lg mb-1">Submit your work</h2>
                <p className="text-sm text-ink-muted mb-5">
                  You can resubmit until the due date. Last submission is the one graded.
                </p>

                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Submission title</label>
                    <input
                      type="text"
                      placeholder={`${a.code} — Aiman Hakimi`}
                      className="input"
                      defaultValue={`${a.code} — Aiman Hakimi`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Notes for the mentor</label>
                    <textarea
                      rows={3}
                      placeholder="Anything you want the mentor to know about your work."
                      className="input"
                      style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Attach files</label>
                    <div className="border-2 border-dashed border-rule rounded-md p-6 text-center bg-paper-dark/40">
                      <p className="text-sm text-ink-muted mb-3">
                        Drag and drop your PDF here, or
                      </p>
                      <button type="button" className="btn btn-ghost btn-sm">
                        Browse files
                      </button>
                      <p className="text-xs text-ink-muted mt-3">
                        PDF only, up to 10MB
                      </p>
                    </div>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-center justify-between text-sm card p-3 bg-paper-dark/30">
                        <span className="flex items-center gap-2">
                          <span className="size-8 rounded bg-oxblood/15 text-oxblood flex items-center justify-center text-xs font-bold">PDF</span>
                          <span>
                            <span className="font-medium block">induction-proof.pdf</span>
                            <span className="text-xs text-ink-muted">2.3 MB, uploaded just now</span>
                          </span>
                        </span>
                        <button type="button" className="text-sm text-oxblood hover:text-oxblood-deep">Remove</button>
                      </li>
                    </ul>
                  </div>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
                    <span>I confirm this is my own work and I have read the conduct policy.</span>
                  </label>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
                    <Link href="/assignments" className="btn btn-ghost">Cancel</Link>
                    <Link href="/assignments" className="btn btn-primary">Submit assignment</Link>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card p-6 bg-paper-dark/40">
                <h2 className="font-semibold text-lg mb-2">This assignment is closed</h2>
                <p className="text-sm text-ink-muted">
                  Submissions are no longer accepted. Final score, A−. Mentor feedback, available below.
                </p>
              </div>
            )}
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
                  <span className="text-ink-muted">Status</span>
                  <span className={statusBadge[a.status]}>{a.status}</span>
                </li>
              </ul>

              <div className="mt-5 pt-5 border-t border-rule">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink-muted">Class submissions</span>
                  <span className="font-semibold tabular">{a.submissions}/{a.of}</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                  <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {!isClosed ? (
                <Link href="#submit" className="btn btn-primary w-full mt-5">
                  Submit work
                </Link>
              ) : null}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-base mb-3">Need help?</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Bring questions to the discussion room or to peer office hours
                with your senior mentor, Thursday 14:00 to 16:00 in Room 4-08.
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
