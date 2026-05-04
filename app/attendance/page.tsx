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

              <div className="card p-3 overflow-hidden">
                <div className="relative aspect-[5/4] rounded-md overflow-hidden bg-gradient-to-br from-ink to-ink-soft">
                  <div className="absolute inset-6 border border-bone/20 rounded-sm">
                    {[
                      { x: 6, y: 12, w: 22, h: 28, name: "Aiman Hakimi", id: "2023607832", ok: true },
                      { x: 36, y: 10, w: 22, h: 30, name: "Nur Sofea", id: "2023608112", ok: true },
                      { x: 68, y: 16, w: 20, h: 26, name: "Faris Adlan", id: "2023611901", ok: true },
                      { x: 10, y: 56, w: 22, h: 28, name: "Liyana Aziz", id: "2023612200", ok: false },
                      { x: 42, y: 60, w: 22, h: 28, name: "Hafiz Ridzwan", id: "2023612555", ok: true },
                      { x: 70, y: 58, w: 20, h: 26, name: "Iman Yusoff", id: "2023612823", ok: false },
                    ].map((b) => (
                      <div
                        key={b.id}
                        className={`absolute border-2 rounded-sm ${b.ok ? "border-saffron" : "border-bone/40 border-dashed"}`}
                        style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                      >
                        <div className={`absolute -top-5 left-0 right-0 flex items-center justify-between text-[10px] font-semibold ${b.ok ? "text-saffron" : "text-bone/60"}`}>
                          <span>{b.name}</span>
                          <span>{b.ok ? "✓" : "?"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-3 left-4 text-xs font-medium text-bone/80 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-oxblood blink" />
                    Recognising · {checkedCount}/{ROSTER.length} matched
                  </div>
                  <div className="absolute bottom-3 right-4 text-xs text-bone/60">
                    {live.room} · {live.time}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn btn-primary">File the roll →</button>
                <button className="btn btn-ghost">Re-scan</button>
                <button className="btn btn-ghost">Manual override</button>
              </div>
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
