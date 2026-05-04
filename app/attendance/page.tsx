import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ATTENDANCE_SESSIONS, ROSTER } from "@/lib/data";

export const metadata = {
  title: "Attendance — EduMentor",
  description: "Roll, called by the camera. Confirmed by the mentor.",
};

const stateBadge: Record<string, string> = {
  Live: "badge badge-oxblood",
  Closed: "badge badge-muted",
};

export default function AttendancePage() {
  const live = ATTENDANCE_SESSIONS.find((s) => s.state === "Live");
  const closed = ATTENDANCE_SESSIONS.filter((s) => s.state === "Closed");
  const checkedCount = ROSTER.filter((r) => r.checked).length;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Attendance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
          <p className="mt-3 text-ink-soft">
            Roll called by camera, confirmed by mentor. {checkedCount} of {ROSTER.length} matched today.
          </p>
        </div>
      </section>

      {live ? (
        <section>
          <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-oxblood">
                  <span className="size-1.5 rounded-full bg-oxblood blink mr-1" /> Live now
                </span>
                <h2 className="font-semibold text-lg">{live.course} — {live.room}</h2>
              </div>

              {/* Info notice */}
              <div className="card p-4 mb-4 bg-oxblood/[0.04] border-oxblood/20 flex items-start gap-3">
                <span className="size-8 rounded-full bg-oxblood/15 text-oxblood flex items-center justify-center shrink-0 text-base">
                  ℹ
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-ink mb-1">How face recognition works</p>
                  <p className="text-ink-muted leading-relaxed">
                    Point the classroom camera at the cohort. The system
                    matches each face against the roster on the right and
                    marks them <span className="font-semibold text-fern">Present</span>{" "}
                    automatically. Unmatched students stay <span className="font-semibold">Awaiting</span>{" "}
                    until the mentor confirms manually.
                  </p>
                </div>
              </div>

              <div className="card p-0 overflow-hidden">
                {/* Camera header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-rule bg-paper-dark/40">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxblood">
                      <span aria-hidden>📷</span>
                      Camera 01 · {live.room}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
                    <span className="size-1.5 rounded-full bg-oxblood blink" />
                    Recording
                  </span>
                </div>

                {/* Video preview area */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                  {/* center camera icon — placeholder for real video */}
                  <div className="text-center text-bone/70">
                    <div className="text-5xl mb-2">📹</div>
                    <p className="text-sm">Live camera feed placeholder</p>
                    <p className="text-xs text-bone/50 mt-1">In production this shows the classroom camera</p>
                  </div>

                  {/* match indicator overlays */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 bg-bone/95 px-2.5 py-1 rounded-sm text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-oxblood blink" />
                    {checkedCount}/{ROSTER.length} matched · {Math.round((checkedCount / ROSTER.length) * 100)}% accuracy
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-bone/70 font-mono tabular">
                    {live.time} · {live.date}
                  </div>
                </div>

                {/* Match progress strip */}
                <div className="px-4 py-3 border-t border-rule">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-ink-muted">Recognition progress</span>
                    <span className="font-semibold tabular">
                      {checkedCount} of {ROSTER.length} matched
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-paper-dark overflow-hidden">
                    <div
                      className="h-full bg-oxblood rounded-full transition-all"
                      style={{ width: `${(checkedCount / ROSTER.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn btn-primary">File the roll →</button>
                <button className="btn btn-ghost">Re-scan</button>
                <button className="btn btn-ghost">Manual override</button>
              </div>
              <p className="text-xs text-ink-muted mt-3">
                Filing the roll saves today&apos;s attendance to the registrar audit log. Re-scan retries face matching for awaiting students.
              </p>
            </div>

            <aside className="col-span-12 lg:col-span-5">
              <h2 className="font-semibold text-lg mb-4">Roster · {ROSTER.length} students</h2>
              <ul className="card divide-y divide-rule p-0 overflow-hidden">
                {ROSTER.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xs text-ink-muted w-6 tabular">{i + 1}</span>
                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                      s.checked ? "bg-fern/20 text-fern" : "bg-paper-dark text-ink-muted"
                    }`}>
                      {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs text-ink-muted tabular">{s.matric}</div>
                    </div>
                    {s.checked ? (
                      <span className="badge badge-fern">✓ Present</span>
                    ) : (
                      <span className="badge badge-muted">Awaiting</span>
                    )}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="bg-paper-dark/30 border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <h2 className="font-semibold text-lg mb-6">Session history</h2>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50">
                <tr className="text-left text-xs text-ink-muted">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Room</th>
                  <th className="px-4 py-3 font-semibold">Attendance</th>
                  <th className="px-4 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {closed.map((s) => {
                  const pct = Math.round((s.present / s.expected) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-3 tabular">{s.date}</td>
                      <td className="px-4 py-3 tabular text-ink-muted">{s.time}</td>
                      <td className="px-4 py-3 font-medium">{s.course}</td>
                      <td className="px-4 py-3 text-ink-muted">{s.room}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold tabular">{s.present}/{s.expected}</span>{" "}
                        <span className="text-ink-muted">({pct}%)</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={stateBadge[s.state]}>{s.state}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
