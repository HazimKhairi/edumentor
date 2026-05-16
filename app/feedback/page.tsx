import Link from "next/link";
import { Star } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StarRating } from "@/components/star-rating";
import { getFeedbackView } from "@/lib/queries";

export const metadata = {
  title: "Reviews | EduMentor",
  description: "End-of-term mentor evaluations.",
};

const RUBRIC = [
  { key: "Pacing of lectures", value: 4 },
  { key: "Clarity of explanation", value: 5 },
  { key: "Quality of feedback on work", value: 4 },
  { key: "Availability outside class", value: 5 },
  { key: "Fairness in grading", value: 4 },
];

export default async function FeedbackPage() {
  const FEEDBACK_ENTRIES = await getFeedbackView();
  const avg = FEEDBACK_ENTRIES.length
    ? FEEDBACK_ENTRIES.reduce((s, f) => s + f.score, 0) / FEEDBACK_ENTRIES.length
    : 0;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Reviews</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Mentor reviews</h1>
          <p className="mt-3 text-ink-soft">
            Mentees review their mentors. Anonymous, recorded, and considered by the registrar at term&apos;s end.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          {/* Form */}
          <div className="col-span-12 lg:col-span-7">
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-4 pb-5 border-b border-rule mb-6">
                <div className="size-14 rounded-full bg-gradient-to-br from-oxblood to-oxblood-deep flex items-center justify-center text-bone font-display italic text-2xl">
                  A
                </div>
                <div>
                  <p className="text-sm text-ink-muted">You&apos;re reviewing your mentor</p>
                  <h2 className="font-semibold text-lg">Adam Iskandar Razak</h2>
                  <p className="text-xs text-ink-muted">MAT CS110 , Discrete Structures , 24 sessions</p>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Overall rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} stars`}
                        className="text-amber-500 transition-transform hover:scale-110"
                      >
                        <Star size={28} fill="currentColor" />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-ink-muted">5.0 Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Detailed rubric</label>
                  <ul className="space-y-3">
                    {RUBRIC.map((r) => (
                      <li key={r.key} className="grid grid-cols-12 gap-3 items-center">
                        <span className="col-span-12 sm:col-span-6 text-sm">{r.key}</span>
                        <div className="col-span-12 sm:col-span-6 flex items-center gap-1 sm:justify-end">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              className={`size-9 rounded-sm border text-sm font-medium transition-colors ${
                                n <= r.value
                                  ? "border-oxblood bg-oxblood text-bone"
                                  : "border-rule text-ink-muted hover:border-ink"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-ink-muted mt-3">1 | disagree , 5 | strongly agree</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">A kind word</label>
                  <textarea
                    rows={3}
                    defaultValue="Patient and clear. The induction worksheets were the most useful resource of the term."
                    className="input"
                    style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">A useful criticism</label>
                  <textarea
                    rows={3}
                    defaultValue="Peer office hours filled up quickly in week 8. A second slot would have helped before the midterm."
                    className="input"
                    style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="size-4 accent-oxblood" defaultChecked />
                  <span>Submit anonymously (recommended)</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
                  <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
                  <Link href="/dashboard" className="btn btn-primary">Submit review</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Aggregate */}
          <aside className="col-span-12 lg:col-span-5">
            <div
              className="rounded-md p-6 mb-4"
              style={{ backgroundColor: "var(--color-oxblood)", color: "var(--color-bone)" }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-saffron)" }}>Term average</p>
              <div className="text-5xl font-bold">
                {avg.toFixed(1)}
                <span className="text-2xl ml-1" style={{ color: "var(--color-saffron)" }}>/ 5</span>
              </div>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                {FEEDBACK_ENTRIES.reduce((s, f) => s + f.n, 0)} responses across {FEEDBACK_ENTRIES.length} mentors
              </p>
            </div>

            <h3 className="font-semibold text-base mb-3 mt-6">Recent reviews</h3>
            <ul className="space-y-3">
              {FEEDBACK_ENTRIES.map((f) => (
                <li key={f.id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-ink-muted">{f.course}</span>
                    <StarRating value={f.score} size="xs" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{f.mentor}</h4>
                  <p className="text-sm text-ink-soft leading-relaxed italic">
                    &ldquo;{f.comment}&rdquo;
                  </p>
                  <div className="text-xs text-ink-muted mt-3 pt-3 border-t border-rule">
                    {f.by} , n = {f.n}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
