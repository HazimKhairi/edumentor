import { TrendingUp } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StarRating } from "@/components/star-rating";
import { db } from "@/lib/db";
import { getCoursesView, getFeedbackView, getStats } from "@/lib/queries";
import { requireRole } from "@/lib/session";

type CourseRow = {
  id: string;
  code: string;
  title: string;
  mentor: string;
  enrolled: number;
  capacity: number;
  attendancePct: number | null;
  rating: number | null;
  responses: number;
};

async function getCourseBreakdown(): Promise<CourseRow[]> {
  // Pull attendance counts grouped by course in one shot, then enrich.
  const [courses, attendanceAgg, feedbackAgg] = await Promise.all([
    getCoursesView(),
    db.attendanceSession.findMany({
      where: { state: "Closed" },
      select: {
        courseId: true,
        records: {
          select: { menteeConfirmed: true, mentorVerified: true },
        },
      },
    }),
    db.feedbackEntry.groupBy({
      by: ["courseId"],
      _avg: { score: true },
      _sum: { n: true },
    }),
  ]);

  const attMap = new Map<string, { total: number; verified: number }>();
  for (const s of attendanceAgg) {
    const row = attMap.get(s.courseId) ?? { total: 0, verified: 0 };
    for (const r of s.records) {
      row.total += 1;
      if (r.menteeConfirmed && r.mentorVerified) row.verified += 1;
    }
    attMap.set(s.courseId, row);
  }
  const fbMap = new Map(
    feedbackAgg.map((f) => [f.courseId, { avg: f._avg.score, n: f._sum.n ?? 0 }]),
  );

  return courses.map((c) => {
    const att = attMap.get(c.id);
    const fb = fbMap.get(c.id);
    return {
      id: c.id,
      code: c.code,
      title: c.title,
      mentor: c.mentor,
      enrolled: c.enrolled,
      capacity: c.capacity,
      attendancePct:
        att && att.total > 0 ? Math.round((att.verified / att.total) * 100) : null,
      rating: fb?.avg ?? null,
      responses: fb?.n ?? 0,
    };
  });
}

export const metadata = {
  title: "Reports | EduMentor",
  description: "Term metrics and audits for the registrar.",
};

const SPARK = [42, 48, 51, 56, 49, 58, 63, 60, 67, 71, 68, 74];

const sevBadge: Record<string, string> = {
  Low: "badge badge-muted",
  Medium: "badge badge-saffron",
  High: "badge badge-oxblood",
};

export default async function ReportsPage() {
  await requireRole("Admin");
  const [COURSES, FEEDBACK_ENTRIES, STATS, COURSE_ROWS] = await Promise.all([
    getCoursesView(),
    getFeedbackView(),
    getStats(),
    getCourseBreakdown(),
  ]);
  const totalEnrolled = COURSES.reduce((s, c) => s + c.enrolled, 0);
  const totalCapacity = COURSES.reduce((s, c) => s + c.capacity, 0);
  const fillPct = totalCapacity ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  // Real issues derived from current data
  const ISSUES: { code: string; t: string; c: string; sev: "Low" | "Medium" | "High" }[] = [];
  for (const c of COURSES) {
    const pct = c.capacity ? c.enrolled / c.capacity : 0;
    if (pct >= 0.9) {
      ISSUES.push({
        code: `CAP-${c.code.replace(/\s/g, "")}`,
        t: `Cohort capacity at ${Math.round(pct * 100)}%`,
        c: c.code,
        sev: pct >= 0.95 ? "High" : "Medium",
      });
    }
  }
  for (const f of FEEDBACK_ENTRIES) {
    if (f.score < 3.5) {
      ISSUES.push({
        code: `LOW-${f.id.slice(-4)}`,
        t: `Mentor rating below 3.5 (${f.score.toFixed(1)})`,
        c: `${f.mentor}, ${f.course}`,
        sev: "High",
      });
    }
  }

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
            For Semester 02 / 2026 , Filed by Registrar , 04 May 2026
          </p>

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
              <p className="text-sm text-ink-muted mb-6 inline-flex items-center gap-1.5 flex-wrap">
                <span>Average <span className="font-semibold text-ink tabular">59%</span></span>
                <span className="text-rule">|</span>
                <span className="inline-flex items-center gap-1 text-fern font-semibold">
                  <TrendingUp size={14} /> +18 pp
                </span>
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
                {totalEnrolled} of {totalCapacity} seats , {fillPct}%
              </p>
              <div className="display text-5xl text-oxblood">{fillPct}%</div>
              <ul className="mt-6 space-y-3">
                {COURSES.map((c) => {
                  const pct = Math.round((c.enrolled / c.capacity) * 100);
                  return (
                    <li key={c.id}>
                      <div className="flex items-baseline justify-between text-sm mb-1">
                        <span className="font-medium">{c.code}</span>
                        <span className="text-ink-muted tabular">{pct}% , {c.enrolled}/{c.capacity}</span>
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
            {ISSUES.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Nothing flagged. All cohorts under 90% capacity, all mentors rated 3.5+.
              </p>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <h2 className="font-semibold text-lg mb-4">By course</h2>
          <p className="text-sm text-ink-muted mb-4">
            Attendance, enrolment and feedback per course — to monitor the
            programme course by course, not just overall.
          </p>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Mentor</th>
                  <th className="px-4 py-3 font-semibold text-right">Enrolled</th>
                  <th className="px-4 py-3 font-semibold text-right">Attendance</th>
                  <th className="px-4 py-3 font-semibold text-right">Rating</th>
                  <th className="px-4 py-3 font-semibold text-right">Responses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {COURSE_ROWS.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-muted">
                      No courses yet.
                    </td>
                  </tr>
                ) : (
                  COURSE_ROWS.map((c) => (
                    <tr key={c.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">{c.code}</div>
                        <div className="text-xs text-ink-muted">{c.title}</div>
                      </td>
                      <td className="px-4 py-3">{c.mentor}</td>
                      <td className="px-4 py-3 text-right tabular text-ink-muted">
                        {c.enrolled}/{c.capacity}
                      </td>
                      <td className="px-4 py-3 text-right tabular">
                        {c.attendancePct === null ? (
                          <span className="text-ink-muted">—</span>
                        ) : (
                          `${c.attendancePct}%`
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular">
                        {c.rating === null ? (
                          <span className="text-ink-muted">—</span>
                        ) : (
                          c.rating.toFixed(1)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular text-ink-muted">
                        {c.responses}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
