import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaceAttendance } from "@/components/face-attendance";
import { ATTENDANCE_SESSIONS, ROSTER } from "@/lib/data";

export const metadata = {
  title: "Attendance | EduMentor",
  description: "Roll, called by the camera. Confirmed by the mentor.",
};

const stateBadge: Record<string, string> = {
  Live: "badge badge-oxblood",
  Closed: "badge badge-muted",
};

export default function AttendancePage() {
  const live = ATTENDANCE_SESSIONS.find((s) => s.state === "Live");
  const closed = ATTENDANCE_SESSIONS.filter((s) => s.state === "Closed");
  const rosterForRecognition = ROSTER.map(({ id, name, matric }) => ({
    id,
    name,
    matric,
  }));

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
            Roll called by camera, confirmed by the mentor.
            Recognition runs in the browser with face-api.js.
          </p>
        </div>
      </section>

      {live ? (
        <FaceAttendance roster={rosterForRecognition} session={live} />
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
