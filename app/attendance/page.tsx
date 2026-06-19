import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaceAttendance } from "@/components/face-attendance";
import { MenteeAttendanceConfirm } from "@/components/mentee-attendance-confirm";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ChevronRight, Radio } from "lucide-react";
import {
  attendanceForUser,
  getAttendanceSessionsView,
  getClassesForUser,
  getRosterForSession,
  visibilityScope,
} from "@/lib/queries";

export const metadata = {
  title: "Attendance | EduMentor",
  description:
    "Face match, mentee confirms, mentor verifies. Two signatures every session.",
};

const stateBadge: Record<string, string> = {
  Live: "badge badge-oxblood",
  Closed: "badge badge-muted",
};

export default async function AttendancePage() {
  const me = await requireUser();
  // Each mentor handles their own mentees: scope live, history and the by-class
  // list to the mentor assigned to this user per course (admin sees all).
  const scope = await visibilityScope(me);

  const liveRecord = await db.attendanceSession.findFirst({
    where: { state: "Live", ...(scope ?? {}) },
    include: { course: { select: { code: true } } },
  });
  const live = liveRecord
    ? {
        id: liveRecord.id,
        course: liveRecord.course.code,
        room: liveRecord.room,
        date: liveRecord.date.toISOString().slice(0, 10),
        time: liveRecord.time,
        expected: liveRecord.expected,
      }
    : null;

  const sessions = await getAttendanceSessionsView(scope);
  const closed = sessions.filter((s) => s.state === "Closed");

  // Me5: by-class list — click a class to see its info + attendance.
  const myClasses = await getClassesForUser(scope);

  const rosterForRecognition = live ? await getRosterForSession(live.id) : [];

  const myTrail = me.role === "Mentee" ? await attendanceForUser(me.id) : [];

  // Mentee-side props derived from the same data we already loaded.
  let myDescriptor: number[] | null = null;
  let initiallyVerified = false;
  if (live && me.role === "Mentee") {
    const myRosterRow = rosterForRecognition.find((r) => r.id === me.id);
    myDescriptor = myRosterRow?.descriptor ?? null;
    const existing = await db.menteeAttendance.findUnique({
      where: { sessionId_menteeId: { sessionId: live.id, menteeId: me.id } },
    });
    initiallyVerified = Boolean(
      existing?.menteeConfirmed && existing?.mentorVerified,
    );
  }

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-4">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <span className="text-ink">Attendance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
          <p className="mt-2 text-sm text-ink-soft max-w-2xl leading-relaxed">
            Every session needs <span className="font-semibold text-ink">two signatures</span>.
            The mentee&apos;s face is matched in the browser and they tap{" "}
            <span className="font-semibold text-ink">Confirm</span>, then the mentor opens
            their roster and taps <span className="font-semibold text-ink">Verify</span>.
            A session only counts when both signatures are recorded.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <h2 className="font-semibold text-sm mb-3">My classes</h2>
          {myClasses.length === 0 ? (
            <div className="card p-5 text-sm text-ink-muted">
              No classes for your courses yet.
            </div>
          ) : (
            <ul className="card p-0 overflow-hidden divide-y divide-rule">
              {myClasses.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/attendance/${c.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dark/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{c.topic}</span>
                        {c.state === "Live" ? (
                          <span className="badge badge-oxblood inline-flex items-center gap-1">
                            <Radio size={10} className="animate-pulse" /> Live
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-ink-muted tabular mt-0.5">
                        {c.course}, {c.date} {c.time}, {c.room}, mentor {c.mentor}
                      </div>
                    </div>
                    {c.state !== "Live" ? (
                      <span className="badge badge-muted shrink-0">{c.state}</span>
                    ) : null}
                    <ChevronRight size={16} className="text-ink-muted shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {live ? (
        me.role === "Mentor" ? (
          <FaceAttendance roster={rosterForRecognition} session={live} />
        ) : me.role === "Mentee" ? (
          <MenteeAttendanceConfirm
            session={live}
            myUserId={me.id}
            myMatric={me.identity}
            myName={me.name}
            myDescriptor={myDescriptor}
            initiallyVerified={initiallyVerified}
          />
        ) : (
          <section>
            <div className="mx-auto max-w-[1200px] px-6 py-8">
              <div className="card p-5 text-sm text-ink-muted">
                Admin view, no per-session capture from this account. See the live session
                roster in the mentor console.
              </div>
            </div>
          </section>
        )
      ) : (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-8">
            <div className="card p-5 text-sm text-ink-muted">
              No live session right now. The next class will show up here when it starts.
            </div>
          </div>
        </section>
      )}

      {me.role === "Mentee" && myTrail.length > 0 ? (
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1200px] px-6 py-8">
            <h2 className="font-semibold text-sm mb-3">My attendance trail</h2>
            <ul className="card p-0 overflow-hidden divide-y divide-rule">
              {myTrail.map((r) => {
                const counted = r.menteeConfirmed && r.mentorVerified;
                return (
                  <li key={r.sessionId} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{r.session.courseId}</div>
                      <div className="text-xs text-ink-muted tabular">
                        {r.session.date.toISOString().slice(0, 10)} {r.session.time}, {r.session.room}
                      </div>
                    </div>
                    <span
                      className={
                        r.menteeConfirmed ? "badge badge-fern" : "badge badge-muted"
                      }
                    >
                      You {r.menteeConfirmed ? "OK" : "no"}
                    </span>
                    <span
                      className={
                        r.mentorVerified ? "badge badge-fern" : "badge badge-saffron"
                      }
                    >
                      Mentor {r.mentorVerified ? "OK" : "pending"}
                    </span>
                    <span
                      className={
                        counted ? "badge badge-oxblood" : "badge badge-muted"
                      }
                    >
                      {counted ? "Counted" : "Incomplete"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <h2 className="font-semibold text-sm mb-3">Session history</h2>
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
