import { BAND_BADGE, BAND_RANGES, bandFor } from "@/lib/performance";
import type { MonitoringStudent } from "@/lib/queries";

// Shared monitoring view. The admin page passes every student; the mentor page
// passes only their own mentees. Presentation is identical so both roles read
// the same figures the same way.

function pct(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function PerformanceSummary({ rows }: { rows: MonitoringStudent[] }) {
  const scored = rows.filter((r) => r.overall.percentage !== null);
  const cohortAvg = scored.length
    ? scored.reduce((s, r) => s + (r.overall.percentage as number), 0) / scored.length
    : null;
  const atRisk = scored.filter((r) => (r.overall.percentage as number) < 65).length;
  const ungraded = rows.reduce(
    (s, r) => s + (r.overall.issuedCount - r.overall.gradedCount),
    0,
  );

  const cards = [
    { label: "Students tracked", value: String(rows.length), caption: `${scored.length} with graded work` },
    { label: "Cohort average", value: pct(cohortAvg), caption: "weighted across all marks" },
    { label: "Below 65%", value: String(atRisk), caption: "at risk or critical" },
    { label: "Awaiting marks", value: String(ungraded), caption: "submissions not graded" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card p-5">
          <div className="text-sm text-ink-muted">{c.label}</div>
          <div className="display text-4xl mt-2 tabular">{c.value}</div>
          <div className="text-xs text-ink-muted mt-1">{c.caption}</div>
        </div>
      ))}
    </div>
  );
}

// Spells out how a percentage becomes a band, so the rule is visible on the
// page instead of living only in the code.
export function PerformanceLegend() {
  return (
    <div className="card p-4">
      <p className="text-sm font-semibold mb-1">How performance is worked out</p>
      <p className="text-xs text-ink-muted mb-3">
        Each assignment mark is out of 100. The percentage is a weighted
        average, so an assignment carrying a heavier weight counts for more.
        Work that has not been marked yet is left out of the average and
        counted under Graded instead.
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
        {BAND_RANGES.map((b) => (
          <li key={b.band} className="flex items-center gap-2">
            <span className={BAND_BADGE[b.band]}>{b.band}</span>
            <span className="text-ink-muted tabular">{b.range}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Overall performance percentage per student, across every course they take.
export function OverallTable({ rows }: { rows: MonitoringStudent[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink-muted">No students in scope yet.</p>;
  }

  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="bg-paper-dark/50 text-xs text-ink-muted">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold">Matric</th>
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold text-right">Graded</th>
            <th className="px-4 py-3 font-semibold w-[220px]">Overall performance</th>
            <th className="px-4 py-3 font-semibold">Performance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {rows.map((r) => {
            const band = bandFor(r.overall.percentage);
            return (
              <tr key={r.studentId} className="hover:bg-paper-dark/30">
                <td className="px-4 py-3 font-medium">{r.studentName}</td>
                <td className="px-4 py-3 text-ink-muted tabular">{r.matric}</td>
                <td className="px-4 py-3">
                  {/* Naming the course beats a bare count: the registrar can
                      see which subject a figure belongs to without drilling in. */}
                  <div className="flex flex-col gap-0.5">
                    {r.courses.map((c) => (
                      <span key={c.courseId} className="font-medium">
                        {c.courseCode}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular text-ink-muted">
                  {r.overall.gradedCount}/{r.overall.issuedCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-paper-dark overflow-hidden">
                      <div
                        className="h-full bg-oxblood rounded-full"
                        style={{ width: `${r.overall.percentage ?? 0}%` }}
                      />
                    </div>
                    <span className="tabular font-semibold w-[62px] text-right">
                      {pct(r.overall.percentage)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={BAND_BADGE[band]}>{band}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Per-course breakdown with the individual assignment marks that produced the
// percentage, so a mentor or the registrar can see exactly where a figure
// comes from instead of trusting a single number.
export function CourseBreakdownTable({ rows }: { rows: MonitoringStudent[] }) {
  const cells = rows.flatMap((r) =>
    r.courses.map((c) => ({ student: r, course: c })),
  );

  if (cells.length === 0) {
    return <p className="text-sm text-ink-muted">Nothing to break down yet.</p>;
  }

  return (
    <div className="card p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[860px]">
        <thead className="bg-paper-dark/50 text-xs text-ink-muted">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold">Student</th>
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold">Mentor</th>
            <th className="px-4 py-3 font-semibold">Assignment marks</th>
            <th className="px-4 py-3 font-semibold text-right">Course %</th>
            <th className="px-4 py-3 font-semibold">Performance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {cells.map(({ student, course }) => {
            const band = bandFor(course.performance.percentage);
            return (
              <tr
                key={`${student.studentId}-${course.courseId}`}
                className="hover:bg-paper-dark/30 align-top"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{student.studentName}</div>
                  <div className="text-xs text-ink-muted tabular">{student.matric}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{course.courseCode}</div>
                  <div className="text-xs text-ink-muted">{course.courseTitle}</div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{course.mentorName}</td>
                <td className="px-4 py-3">
                  {course.items.length === 0 ? (
                    <span className="text-xs text-ink-muted">No assignments issued</span>
                  ) : (
                    /* Stacked, not laid out sideways: one assignment per line
                       reads down the column and keeps long lists from pushing
                       the table wider than the screen. */
                    <ul className="flex flex-col items-start gap-1.5">
                      {course.items.map((i) => (
                        <li key={i.assignmentId}>
                          <span
                            title={`${i.title}, weight ${i.weight}`}
                            className={
                              i.mark === null
                                ? "badge badge-muted text-[11px]"
                                : "badge badge-fern text-[11px]"
                            }
                          >
                            {i.code} {i.mark === null ? (i.submitted ? "ungraded" : "no submission") : i.mark}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular font-semibold">
                  {pct(course.performance.percentage)}
                </td>
                <td className="px-4 py-3">
                  <span className={BAND_BADGE[band]}>{band}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
