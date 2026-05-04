import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { FEEDBACK_ENTRIES } from "@/lib/data";

export const metadata = {
  title: "Feedback — EduMentor",
  description: "End-of-term mentor evaluation. Anonymous, recorded, public.",
};

const RUBRIC = [
  { key: "Pacing of lectures", value: 4 },
  { key: "Clarity of explanation", value: 5 },
  { key: "Quality of feedback on work", value: 4 },
  { key: "Availability outside class", value: 5 },
  { key: "Fairness in grading", value: 4 },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[14px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-oxblood" : "text-rule"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function FeedbackPage() {
  const avg =
    FEEDBACK_ENTRIES.reduce((s, f) => s + f.score, 0) /
    FEEDBACK_ENTRIES.length;

  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 06</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The mentee
              <br /> evaluates the mentor.
            </p>
            <div className="rule mt-6" />
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              At term&apos;s end the mentee writes the review. Names are
              redacted, scores are kept. A teacher who survives criticism
              with grace is one worth keeping on the masthead.
            </p>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">review.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              You are reviewing{" "}
              <span className="eyebrow-italic">Dr. Aishah Mokhtar</span>{" "}
              for MAT CS110, Sem 02 / 2026. Your name will not be
              attached to the score; your words may be quoted in the
              term report.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          {/* Form */}
          <form className="col-span-12 md:col-span-7">
            <RuleLabel numeral="Form 6A" label="Mentor evaluation" caption="MAT CS110" />

            <div className="mt-8 space-y-8 border border-ink bg-bone p-8">
              <div>
                <div className="numeral">Subject of review</div>
                <div className="display text-[40px] leading-tight tracking-[-0.025em] mt-1">
                  Dr. Aishah Mokhtar
                </div>
                <div className="text-xs font-medium uppercase tracking-wide text-ink-muted mt-1">
                  MAT CS110 · Discrete Structures · 24 sessions
                </div>
              </div>

              <div>
                <div className="label mb-3">Rubric</div>
                <ul className="divide-y divide-rule border-y border-rule">
                  {RUBRIC.map((r) => (
                    <li key={r.key} className="grid grid-cols-12 gap-3 items-center py-4">
                      <span className="col-span-7 text-[15px]">{r.key}</span>
                      <div className="col-span-5 flex items-center justify-end gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`size-8 border ${n <= r.value ? "border-ink bg-ink text-bone" : "border-rule text-ink-muted hover:border-ink"} text-[12px] font-mono`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="numeral mt-2">1 — disagree, 5 — agree</div>
              </div>

              <div>
                <label className="label block mb-3">A kind word</label>
                <textarea
                  rows={3}
                  defaultValue="Patient and rigorous. The induction worksheets were the most useful resource of the term."
                  className="w-full bg-paper border border-rule p-4 text-base leading-relaxed outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="label block mb-3">A useful criticism</label>
                <textarea
                  rows={3}
                  defaultValue="Office hours filled up quickly in week 8. A second slot would have helped before the midterm."
                  className="w-full bg-paper border border-rule p-4 text-base leading-relaxed outline-none focus:border-ink"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t-2 border-ink">
                <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-soft cursor-pointer mt-6">
                  <input type="checkbox" className="size-3 accent-ink" defaultChecked />
                  <span>File anonymously</span>
                </label>
                <Link href="/dashboard" className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors mt-6">
                  Submit review →
                </Link>
              </div>
            </div>
          </form>

          {/* Aggregate */}
          <aside className="col-span-12 md:col-span-5 md:border-l md:border-rule md:pl-6">
            <RuleLabel numeral="Aggregate" label="Term scores" caption={`${FEEDBACK_ENTRIES.length} mentors`} />
            <div className="mt-8 border border-ink p-6">
              <div className="numeral">Term average</div>
              <div className="display text-[88px] leading-none tracking-[-0.04em] mt-2">
                {avg.toFixed(1)}
                <span className="display-italic text-oxblood text-[40px] ml-1">/5</span>
              </div>
              <div className="rule-thick mt-4" />
              <div className="numeral mt-4">
                {FEEDBACK_ENTRIES.reduce((s, f) => s + f.n, 0)} responses on file
              </div>
            </div>

            <ul className="mt-8 border-t border-ink">
              {FEEDBACK_ENTRIES.map((f) => (
                <li key={f.id} className="border-b border-rule py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="numeral">{f.course}</span>
                    <Stars n={Math.round(f.score)} />
                  </div>
                  <div className="display text-[20px] leading-tight tracking-[-0.02em] mt-1">
                    {f.mentor}
                  </div>
                  <p className="text-sm leading-relaxed text-ink-soft mt-2 italic">
                    &ldquo;{f.comment}&rdquo;
                  </p>
                  <div className="numeral mt-2">{f.by} · n = {f.n}</div>
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
