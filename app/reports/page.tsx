import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { COURSES, FEEDBACK_ENTRIES, STATS } from "@/lib/data";

export const metadata = {
  title: "Reports — EduMentor",
  description: "The administrator's broadsheet: term metrics and audits.",
};

const SPARK = [42, 48, 51, 56, 49, 58, 63, 60, 67, 71, 68, 74];

const ISSUES = [
  { code: "OP-014", t: "Mentor unread queue > 48h", c: "Encik Faiz Rashid", sev: "Med" },
  { code: "OP-015", t: "Cohort capacity at 90%", c: "MAT CS110", sev: "Low" },
  { code: "OP-016", t: "Two mentees on probation", c: "STA 116", sev: "High" },
  { code: "OP-017", t: "Camera offline last Mon", c: "Lab 2", sev: "Med" },
];

const sevTone: Record<string, string> = {
  Low: "bg-bone border border-rule",
  Med: "bg-saffron text-ink",
  High: "bg-oxblood text-bone",
};

export default function ReportsPage() {
  const totalEnrolled = COURSES.reduce((s, c) => s + c.enrolled, 0);
  const totalCapacity = COURSES.reduce((s, c) => s + c.capacity, 0);
  const fillPct = Math.round((totalEnrolled / totalCapacity) * 100);

  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 07</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The administrator&apos;s
              <br /> broadsheet.
            </p>
            <div className="rule mt-6" />
            <dl className="mt-6 space-y-4 text-[12px] font-mono uppercase tracking-[0.18em]">
              <div className="flex justify-between"><dt className="text-ink-muted">Period</dt><dd>Sem 02 / 26</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Issued</dt><dd>04 May 26</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Author</dt><dd className="text-right">Registrar</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Confidential</dt><dd>No</dd></div>
            </dl>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">report.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[18px] leading-[1.55] text-ink-soft">
              A weekly broadsheet for the registrar. Cohort health, mentor
              workloads, attendance accuracy, and the open issues that
              need a quiet word before next session.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] border border-ink bg-ink text-bone">
                This week
              </button>
              <button className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] border border-rule hover:border-ink transition-colors">
                Last 4 weeks
              </button>
              <button className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] border border-rule hover:border-ink transition-colors">
                Term
              </button>
              <button className="ml-auto px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] border border-rule hover:border-ink transition-colors">
                Export PDF →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metric grid */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel numeral="Section A" label="Term metrics" caption="four numbers, briefly" />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-0 border-y border-ink">
            {STATS.map((s, i) => (
              <div key={s.label} className={`p-6 ${i !== 0 ? "border-l border-rule" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""}`}>
                <div className="label">{s.label}</div>
                <div className="display text-[56px] leading-none mt-3 tracking-[-0.04em]">{s.value}</div>
                <div className="text-[12px] text-ink-muted mt-2">{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <RuleLabel numeral="Section B" label="Attendance, by week" caption="last 12 weeks" />
            <div className="mt-8 border border-ink p-6 bg-bone">
              <div className="flex items-end justify-between gap-2 h-56">
                {SPARK.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full ${i === SPARK.length - 1 ? "bg-oxblood" : "bg-ink"}`}
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-[10px] font-mono text-ink-muted">W{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="rule-thick mt-6" />
              <div className="grid grid-cols-3 mt-4 text-[10px] font-mono uppercase tracking-[0.22em]">
                <div>
                  <div className="text-ink-muted">Avg</div>
                  <div className="text-ink mt-1 text-[14px] tracking-normal">59%</div>
                </div>
                <div>
                  <div className="text-ink-muted">Peak</div>
                  <div className="text-ink mt-1 text-[14px] tracking-normal">74% · W12</div>
                </div>
                <div className="text-right">
                  <div className="text-ink-muted">Trend</div>
                  <div className="text-oxblood mt-1 text-[14px] tracking-normal">↗ +18 pp</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-5">
            <RuleLabel numeral="Section C" label="Cohort fill" caption={`${fillPct}%`} />
            <div className="mt-8 border border-ink p-6 bg-bone">
              <div className="display text-[88px] leading-none tracking-[-0.04em]">
                {fillPct}<span className="display-italic text-oxblood text-[40px]">%</span>
              </div>
              <div className="numeral mt-2">
                {totalEnrolled} of {totalCapacity} seats taken
              </div>
              <div className="rule mt-6" />
              <ul className="mt-6 space-y-3">
                {COURSES.map((c) => {
                  const pct = Math.round((c.enrolled / c.capacity) * 100);
                  return (
                    <li key={c.id}>
                      <div className="flex items-baseline justify-between text-[12px] font-mono uppercase tracking-[0.18em]">
                        <span>{c.code}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-[2px] bg-rule mt-1.5">
                        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Mentor scores + Issues */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <RuleLabel numeral="Section D" label="Mentor evaluations" caption={`${FEEDBACK_ENTRIES.length} on file`} />
            <ul className="mt-8 border-t border-ink">
              {FEEDBACK_ENTRIES.map((f) => (
                <li key={f.id} className="grid grid-cols-12 gap-4 items-baseline border-b border-rule py-5">
                  <div className="col-span-2 numeral">{f.course}</div>
                  <div className="col-span-5">
                    <div className="display text-[22px] leading-tight tracking-[-0.02em]">
                      {f.mentor}
                    </div>
                    <p className="text-[13px] leading-snug text-ink-soft mt-1 italic">
                      &ldquo;{f.comment}&rdquo;
                    </p>
                  </div>
                  <div className="col-span-3">
                    <div className="numeral">Score</div>
                    <div className="display text-[28px] leading-none tracking-[-0.02em] mt-1">
                      {f.score.toFixed(1)}
                      <span className="display-italic text-[16px] text-oxblood ml-1">/5</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="numeral">n = {f.n}</div>
                    <Link href="#" className="block mt-2 link-reveal text-[10px] font-mono uppercase tracking-[0.22em]">
                      Open →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col-span-12 md:col-span-5">
            <RuleLabel numeral="Section E" label="Open issues" caption={`${ISSUES.length} on the desk`} />
            <ul className="mt-8 border-t border-ink">
              {ISSUES.map((i) => (
                <li key={i.code} className="border-b border-rule py-4 grid grid-cols-12 gap-3 items-baseline">
                  <div className="col-span-2 numeral">{i.code}</div>
                  <div className="col-span-7">
                    <div className="text-[14px]">{i.t}</div>
                    <div className="numeral mt-1">{i.c}</div>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className={`inline-block px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] ${sevTone[i.sev]}`}>
                      {i.sev}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="#" className="mt-6 inline-flex items-center gap-2 link-reveal text-[11px] font-mono uppercase tracking-[0.22em]">
              Read the full audit log →
            </Link>
          </aside>
        </div>
      </section>

      {/* Sign-off */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-9">
              <div className="label">Editor&apos;s note</div>
              <p className="display text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[-0.03em] mt-6">
                The term is{" "}
                <span className="display-italic text-oxblood">on schedule.</span>{" "}
                Two cohorts will need additional office-hour slots before the midterm.
                One camera fault is scheduled for replacement on Friday.
              </p>
            </div>
            <div className="col-span-12 md:col-span-3 md:border-l md:border-rule md:pl-6 numeral">
              Filed by Registrar
              <br />
              04 May 2026, 14:42
              <div className="rule mt-4" />
              <div className="mt-4 text-ink">— EduMentor</div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
