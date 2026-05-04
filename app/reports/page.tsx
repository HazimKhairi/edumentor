import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StarRating } from "@/components/star-rating";
import { COURSES, FEEDBACK_ENTRIES, STATS } from "@/lib/data";

export const metadata = {
  title: "Reports — EduMentor",
  description: "Term metrics and audits for the registrar.",
};

const SPARK = [42, 48, 51, 56, 49, 58, 63, 60, 67, 71, 68, 74];

const ISSUES = [
  { code: "OP-014", t: "Mentor unread queue > 48h", c: "Encik Faiz Rashid", sev: "Medium" },
  { code: "OP-015", t: "Cohort capacity at 90%", c: "MAT CS110", sev: "Low" },
  { code: "OP-016", t: "Two mentees on probation", c: "STA 116", sev: "High" },
  { code: "OP-017", t: "Camera offline last Mon", c: "Lab 2", sev: "Medium" },
];

const sevBadge: Record<string, string> = {
  Low: "badge badge-muted",
  Medium: "badge badge-saffron",
  High: "badge badge-oxblood",
};

export default function ReportsPage() {
  const totalEnrolled = COURSES.reduce((s, c) => s + c.enrolled, 0);
  const totalCapacity = COURSES.reduce((s, c) => s + c.capacity, 0);
  const fillPct = Math.round((totalEnrolled / totalCapacity) * 100);

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Reports</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Term reports</h1>
          <p className="mt-3 text-ink-soft">
            For Semester 02 / 2026 · Filed by Registrar · 04 May 2026
          </p>

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {["This week", "Last 4 weeks", "Term"].map((p, i) => (
              <button
                key={p}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0 ? "bg-ink text-bone" : "bg-bone text-ink-soft border border-rule hover:border-ink"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm ml-auto">Export PDF →</button>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="text-sm text-ink-muted">{s.label}</div>
              <div className="display text-4xl mt-2">{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="card p-6">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold text-lg">Attendance, by week</h3>
                <span className="text-xs text-ink-muted">Last 12 weeks</span>
              </div>
              <p className="text-sm text-ink-muted mb-6">
                Average <span className="font-semibold text-ink tabular">59%</span> · Trend{" "}
                <span className="font-semibold text-fern">↗ +18 pp</span>
              </p>
              <div className="flex items-end justify-between gap-2 h-48">
                {SPARK.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-sm ${
                        i === SPARK.length - 1 ? "bg-oxblood" : "bg-paper-dark"
                      }`}
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-xs text-ink-muted tabular">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="card p-6">
              <h3 className="font-semibold text-lg">Cohort fill</h3>
              <p className="text-sm text-ink-muted mb-4">
                {totalEnrolled} of {totalCapacity} seats · {fillPct}%
              </p>
              <div className="display text-5xl text-oxblood">{fillPct}%</div>
              <ul className="mt-6 space-y-3">
                {COURSES.map((c) => {
                  const pct = Math.round((c.enrolled / c.capacity) * 100);
                  return (
                    <li key={c.id}>
                      <div className="flex items-baseline justify-between text-sm mb-1">
                        <span className="font-medium">{c.code}</span>
                        <span className="text-ink-muted tabular">{pct}% · {c.enrolled}/{c.capacity}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                        <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-dark/30 border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-semibold text-lg mb-4">Mentor evaluations</h2>
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Course</th>
                    <th className="px-4 py-3 font-semibold">Mentor</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold text-right">Responses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {FEEDBACK_ENTRIES.map((f) => (
                    <tr key={f.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-3 font-medium">{f.course}</td>
                      <td className="px-4 py-3">{f.mentor}</td>
                      <td className="px-4 py-3"><StarRating value={f.score} size="xs" /></td>
                      <td className="px-4 py-3 text-right tabular text-ink-muted">{f.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-semibold text-lg mb-4">Open issues</h2>
            <ul className="space-y-3">
              {ISSUES.map((i) => (
                <li key={i.code} className="card p-4 flex items-start gap-3">
                  <span className="badge badge-muted text-[11px]">{i.code}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{i.t}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{i.c}</div>
                  </div>
                  <span className={sevBadge[i.sev]}>{i.sev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <div className="card p-6 md:p-8 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-9">
              <p className="text-sm font-semibold text-oxblood mb-2">Editor&apos;s note</p>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                The term is on schedule. Two cohorts will need additional
                office-hour slots before the midterm. One camera fault is
                scheduled for replacement on Friday.
              </h3>
            </div>
            <div className="col-span-12 md:col-span-3 md:border-l md:border-rule md:pl-6 text-sm text-ink-muted">
              <div>Filed by Registrar</div>
              <div>04 May 2026, 14:42</div>
              <div className="mt-3 font-semibold text-ink">— EduMentor</div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
