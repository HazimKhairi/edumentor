import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardList, PlayCircle, Radio } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  ASSIGNMENTS,
  ATTENDANCE_SESSIONS,
  EVENTS,
  attendanceRate,
  coursesForUser,
  getCurrentUser,
} from "@/lib/data";

export const metadata = {
  title: "My learning | EduMentor",
  description: "Continue learning, today's events, assignments due.",
};

export default function DashboardPage() {
  const me = getCurrentUser();
  const myCourses = coursesForUser(me);
  const myCourseCodes = new Set(myCourses.map((c) => c.code));

  const live = ATTENDANCE_SESSIONS.find(
    (s) => s.state === "Live" && myCourseCodes.has(s.course),
  );
  const myAssignments = ASSIGNMENTS.filter(
    (a) => myCourseCodes.has(a.course) && a.status !== "Closed",
  ).slice(0, 3);
  const myEvents = EVENTS.filter((e) => myCourseCodes.has(e.course)).slice(0, 4);
  const myAttendance = attendanceRate(me.id);

  const firstName = me.name.split(" ")[0];
  const nextDue = myAssignments[0];

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-4">
          <p className="text-xs text-ink-muted mb-1">Sunday, 04 May 2026</p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {myCourses.length} courses enrolled, {myAttendance}% attendance verified
            {nextDue ? `, ${nextDue.code} due ${nextDue.due}` : ""}.
          </p>
        </div>
      </section>

      {live ? (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 pb-4">
            <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.04] p-4 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-oxblood">
                <Radio size={14} className="animate-pulse" />
                Live now
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {live.course}, {live.room}
                </div>
                <div className="text-xs text-ink-muted">
                  Verify your presence with face recognition before the room closes.
                </div>
              </div>
              <Link href="/attendance" className="btn btn-primary btn-sm">
                Verify presence
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold text-lg">Continue learning</h2>
            <Link href="/courses" className="text-sm text-ink-muted hover:text-ink inline-flex items-center gap-1">
              Browse catalogue <ArrowRight size={12} />
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="card p-6 text-sm text-ink-muted">
              You are not enrolled in any course yet.{" "}
              <Link href="/courses" className="text-oxblood font-semibold">
                Browse the catalogue
              </Link>{" "}
              to start.
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map((c) => (
                <li key={c.id} className="card p-5 flex flex-col gap-3">
                  <div>
                    <div className="text-xs text-ink-muted tabular mb-1">{c.code}</div>
                    <h3 className="font-semibold text-base leading-snug">{c.title}</h3>
                    <p className="text-xs text-ink-muted mt-1">
                      Mentor, {c.mentor}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-ink-muted">Progress</span>
                      <span className="font-semibold tabular">{c.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                      <div
                        className="h-full bg-oxblood rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Link
                      href={`/courses/${c.id}`}
                      className="btn btn-primary btn-sm flex-1 justify-center"
                    >
                      <PlayCircle size={14} /> Continue learning
                    </Link>
                    <Link
                      href="/discussion"
                      className="btn btn-ghost btn-sm"
                      aria-label={`Open discussion for ${c.code}`}
                    >
                      Discuss
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock size={16} className="text-ink-muted" />
              <h3 className="font-semibold text-sm">Upcoming for my courses</h3>
            </div>
            {myEvents.length === 0 ? (
              <p className="text-sm text-ink-muted">Nothing scheduled.</p>
            ) : (
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {myEvents.map((e, i) => (
                  <li key={i} className="px-4 py-3 flex items-start gap-3">
                    <div className="text-xs text-ink-muted w-20 shrink-0">{e.when}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-snug">{e.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {e.course}, {e.place}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={16} className="text-ink-muted" />
              <h3 className="font-semibold text-sm">Due this week</h3>
            </div>
            {myAssignments.length === 0 ? (
              <p className="text-sm text-ink-muted">No open assignments.</p>
            ) : (
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {myAssignments.map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-ink-muted">{a.code}, {a.course}</div>
                        <div className="text-sm font-medium leading-snug truncate">{a.title}</div>
                      </div>
                      <div className="text-xs text-ink-muted tabular shrink-0">Due {a.due}</div>
                    </div>
                    <Link
                      href="/assignments"
                      className="text-xs text-oxblood font-semibold mt-1.5 inline-block"
                    >
                      Open assignment
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
