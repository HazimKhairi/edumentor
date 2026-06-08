import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, ClipboardList, Radio } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import {
  attendanceRate,
  coursesForUserAsRole,
  getAssignmentsView,
  getUpcomingEvents,
} from "@/lib/queries";

export const metadata = {
  title: "My learning | EduMentor",
  description: "Continue learning, today's events, assignments due.",
};

export default async function DashboardPage() {
  const me = await requireUser();
  // Mentee desk is mentee-only. Mentors and admins land here only via stale
  // links — bounce them to their own console so they never see the mentee
  // course list mixed into their view.
  if (me.role === "Mentor") redirect("/mentor");
  if (me.role === "Admin") redirect("/admin");
  // Me1: dashboard scoped strictly to courses I am enrolled in as a Mentee.
  const myCourses = await coursesForUserAsRole(me.id, "Mentee");
  const myCourseCodes = myCourses.map((c) => c.code);

  const [liveSession, openAssignments, myEvents, myAttendance] = await Promise.all([
    db.attendanceSession.findFirst({
      where: { state: "Live", course: { code: { in: myCourseCodes } } },
      include: { course: { select: { code: true } } },
    }),
    getAssignmentsView(myCourseCodes).then((rows) =>
      rows.filter((a) => a.status !== "Closed").slice(0, 3),
    ),
    getUpcomingEvents(myCourseCodes),
    attendanceRate(me.id),
  ]);

  const firstName = me.name.split(" ")[0];
  const nextDue = openAssignments[0];

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[1200px] px-6 pt-8 pb-4">
          <p className="text-xs text-ink-muted mb-1">
            {new Date().toLocaleDateString("en-MY", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {myCourses.length} courses enrolled, {myAttendance}% attendance verified
            {nextDue ? `, ${nextDue.code} due ${nextDue.due}` : ""}.
          </p>
        </div>
      </section>

      {liveSession ? (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 pb-4">
            <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.04] p-4 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-oxblood">
                <Radio size={14} className="animate-pulse" />
                Live now
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {liveSession.course.code}, {liveSession.room}
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
          </div>

          {myCourses.length === 0 ? (
            <div className="card p-6 text-sm text-ink-muted">
              You are not enrolled in any course yet. An admin will assign
              you once registration closes.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  code={c.code}
                  title={c.title}
                  mentor={c.mentor}
                  color={c.color as never}
                  progress={c.progress}
                />
              ))}
            </div>
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
                    <div className="text-xs text-ink-muted w-20 shrink-0">
                      {e.when}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-snug">
                        {e.title}
                      </div>
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
            {openAssignments.length === 0 ? (
              <p className="text-sm text-ink-muted">No open assignments.</p>
            ) : (
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {openAssignments.map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-ink-muted">
                          {a.code}, {a.course}
                        </div>
                        <div className="text-sm font-medium leading-snug truncate">
                          {a.title}
                        </div>
                      </div>
                      <div className="text-xs text-ink-muted tabular shrink-0">
                        Due {a.due}
                      </div>
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
