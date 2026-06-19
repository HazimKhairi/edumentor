import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, ClipboardList, Lock, Radio, Star } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { chooseMentor } from "@/lib/actions";
import {
  attendanceRate,
  chosenCourseIdsForMentee,
  coursesForUserAsRole,
  getAssignmentsView,
  getUpcomingEvents,
  pendingMentorChoices,
  visibilityScope,
} from "@/lib/queries";

export const metadata = {
  title: "My learning | EduMentor",
  description: "Continue learning, today's events, assignments due.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ chosen?: string; error?: string }>;
}) {
  const me = await requireUser();
  // Admins never have a mentee desk. Mentors land here only if they ALSO study
  // a course as a mentee (G4 dual-role) — otherwise bounce them to their
  // console so they never see an empty mentee view.
  if (me.role === "Admin") redirect("/admin");
  if (me.role === "Mentor") {
    const menteeEnrolments = await db.enrollment.count({
      where: { userId: me.id, asRole: "Mentee" },
    });
    if (menteeEnrolments === 0) redirect("/mentor");
  }
  const { chosen, error } = await searchParams;

  // A mentee must pick a mentor for each enrolled course before its content
  // unlocks. Pending = enrolled but no mentor chosen; active = mentor chosen.
  const [allCourses, pending, chosenIds] = await Promise.all([
    coursesForUserAsRole(me.id, "Mentee"),
    pendingMentorChoices(me.id),
    chosenCourseIdsForMentee(me.id),
  ]);
  const chosenSet = new Set(chosenIds);
  // Me1 + gate: active sections scoped strictly to courses with a chosen mentor.
  const myCourses = allCourses.filter((c) => chosenSet.has(c.id));
  // Each mentee only sees content from the mentor assigned to them per course,
  // never another mentor's of the same course. The chosen-mentor pairs that
  // back visibilityScope are exactly the active (gated) courses above.
  const scope = await visibilityScope(me);

  const [liveSession, openAssignments, myEvents, myAttendance] = await Promise.all([
    db.attendanceSession.findFirst({
      where: { state: "Live", ...(scope ?? {}) },
      include: { course: { select: { code: true } } },
    }),
    getAssignmentsView(scope).then((rows) =>
      rows.filter((a) => a.status !== "Closed").slice(0, 3),
    ),
    getUpcomingEvents(scope),
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
            {myCourses.length} active, {pending.length} awaiting a mentor, {myAttendance}% attendance verified
            {nextDue ? `, ${nextDue.code} due ${nextDue.due}` : ""}.
          </p>
        </div>
      </section>

      {chosen ? (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 pb-2">
            <div className="rounded-md border border-fern/40 bg-fern/[0.06] px-4 py-2.5 text-sm text-fern font-medium">
              Mentor chosen. The course is unlocked , classes, assignments and your group discussion are now open.
            </div>
          </div>
        </section>
      ) : null}
      {error ? (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 pb-2">
            <div className="rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-4 py-2.5 text-sm text-oxblood">
              {error === "mentor-full"
                ? "That mentor just filled up. Pick another one."
                : error === "mentor-overloaded"
                  ? "That mentor is already at their limit across all subjects. Pick another one."
                  : "Could not record your choice. Try again."}
            </div>
          </div>
        </section>
      ) : null}

      {pending.length > 0 ? (
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-oxblood" />
              <h2 className="font-semibold text-lg">Choose your mentor</h2>
            </div>
            <p className="text-sm text-ink-muted mb-4">
              You are enrolled but haven&apos;t picked a mentor yet. Pick one per
              subject to unlock its classes, assignments and discussion group.
            </p>
            <div className="space-y-4">
              {pending.map((p) => (
                <div key={p.course.id} className="card p-5">
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <div>
                      <div className="text-xs text-ink-muted">{p.course.code}, Semester {p.course.semester}</div>
                      <div className="font-semibold">{p.course.title}</div>
                    </div>
                  </div>
                  {p.mentors.length === 0 ? (
                    <p className="text-sm text-ink-muted">
                      No mentors assigned to this subject yet. Check back once the
                      admin assigns one.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {p.mentors.map((m) => (
                        <form key={m.mentorId} action={chooseMentor} className="contents">
                          <input type="hidden" name="courseId" value={p.course.id} />
                          <input type="hidden" name="mentorId" value={m.mentorId} />
                          <div className="rounded-md border border-rule p-3 flex flex-col gap-2">
                            <div className="font-medium text-sm">{m.name}</div>
                            <div className="text-xs text-ink-muted flex items-center gap-2 flex-wrap">
                              {m.rating != null ? (
                                <span className="inline-flex items-center gap-1">
                                  <Star size={11} className="text-saffron fill-saffron" />
                                  {m.rating.toFixed(1)}
                                </span>
                              ) : (
                                <span>New mentor</span>
                              )}
                              {m.cgpa != null ? <span>CGPA {m.cgpa.toFixed(2)}</span> : null}
                            </div>
                            <div className="text-xs text-ink-muted">
                              {m.full ? "Full" : `${m.remaining} of ${m.capacity} slots left`}
                            </div>
                            <button
                              type="submit"
                              disabled={m.full}
                              className="btn btn-primary btn-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {m.full ? "Full" : "Choose"}
                            </button>
                          </div>
                        </form>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
              {pending.length > 0
                ? "Pick a mentor above to unlock your first course."
                : "You are not enrolled in any course yet. An admin will assign you once registration closes."}
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
