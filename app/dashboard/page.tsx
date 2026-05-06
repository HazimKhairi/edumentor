import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { IllustrationLearning } from "@/components/illustrations";
import {
  ASSIGNMENTS,
  ATTENDANCE_SESSIONS,
  COURSES,
  EVENTS,
  FEEDBACK_ENTRIES,
  MESSAGES,
  ROOMS,
} from "@/lib/data";

export const metadata = {
  title: "My learning | EduMentor",
  description: "Continue learning, today's events, assignments due.",
};

const stateBadge: Record<string, string> = {
  now: "badge badge-oxblood",
  soon: "badge badge-saffron",
  later: "badge badge-muted",
};

function ratingFor(courseCode: string) {
  const fb = FEEDBACK_ENTRIES.find((f) => f.course === courseCode);
  if (fb) return { rating: fb.score, reviews: fb.n * 11 };
  return { rating: 4.5, reviews: 84 };
}

export default function DashboardPage() {
  const live = ATTENDANCE_SESSIONS.find((s) => s.state === "Live");
  const openAssignments = ASSIGNMENTS.filter((a) => a.status !== "Closed");
  const pinned = ROOMS.filter((r) => r.pinned);
  const continueCourse = COURSES[0];

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-8">
            <p className="text-sm font-medium text-oxblood mb-1">Sunday, 04 May 2026</p>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, <span className="display-italic text-oxblood">Aiman</span>
            </h1>
            <p className="text-ink-soft mt-2">
              You&apos;re 64% through MAT CS110. PS-04 is due in 2 days.
            </p>
          </div>
          <aside className="col-span-12 md:col-span-4 md:justify-self-end">
            <div className="card p-4 flex items-center gap-4">
              <div className="size-14 rounded-full bg-oxblood text-bone flex items-center justify-center font-display italic text-2xl">
                A
              </div>
              <div className="flex-1">
                <div className="font-semibold">Aiman Hakimi</div>
                <div className="text-xs text-ink-muted">2023607832 , Mentee</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-muted">GPA</div>
                <div className="font-display text-xl tabular">3.74</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <SectionHeading
            eyebrow="Pick up where you left off"
            title="Continue learning"
            link={{ href: "/courses", label: "View all" }}
          />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 card overflow-hidden p-0">
              <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-5">
                  <div className="aspect-video md:aspect-square overflow-hidden">
                    <IllustrationLearning className="w-full h-full" />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-7 p-6 md:p-8 flex flex-col">
                  <span className="badge badge-oxblood w-fit mb-3">In progress</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{continueCourse.title}</h3>
                  <p className="text-sm text-ink-muted">
                    {continueCourse.mentor} , {continueCourse.code}
                  </p>
                  <p className="text-base text-ink-soft mt-4 leading-relaxed flex-1">
                    {continueCourse.abstract}
                  </p>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-ink-muted">Course progress</span>
                      <span className="font-semibold tabular">{continueCourse.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-paper-dark overflow-hidden">
                      <div
                        className="h-full bg-oxblood rounded-full"
                        style={{ width: `${continueCourse.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/discussion" className="btn btn-primary">
                      Continue lesson
                    </Link>
                    <Link href="/assignments" className="btn btn-ghost">
                      View assignments
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {live ? (
              <aside className="col-span-12 lg:col-span-4">
                <div
                  className="rounded-md p-6 h-full flex flex-col"
                  style={{ backgroundColor: "var(--color-ink)", color: "var(--color-bone)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-saffron)" }}>
                      <span className="size-1.5 rounded-full blink" style={{ backgroundColor: "var(--color-saffron)" }} />
                      Live now
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{live.time}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{live.course}</h3>
                  <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>Strong induction, trees</p>

                  <div className="grid grid-cols-3 gap-2 my-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                    <div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Expected</div>
                      <div className="text-xl font-bold tabular">{live.expected}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Present</div>
                      <div className="text-xl font-bold tabular">42</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Late</div>
                      <div className="text-xl font-bold tabular">3</div>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>{live.room}</p>

                  <Link
                    href="/attendance"
                    className="btn btn-lg mt-auto"
                    style={{ backgroundColor: "var(--color-saffron)", color: "#ffffff" }}
                  >
                    Join the room
                  </Link>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <SectionHeading
            title="My courses"
            description={`You're enrolled in ${COURSES.length} courses this term.`}
            link={{ href: "/courses", label: "Browse catalogue" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((c) => (
              <CourseCard
                key={c.id}
                id={c.id}
                code={c.code}
                title={c.title}
                mentor={c.mentor}
                color={c.color as never}
                progress={c.progress}
                {...ratingFor(c.code)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-dark/30 border-y border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <h3 className="font-semibold text-lg mb-4">Today&apos;s schedule</h3>
            <ul className="space-y-3">
              {EVENTS.map((e, i) => (
                <li key={i} className="card p-4 flex items-start gap-3">
                  <div className="shrink-0 text-center min-w-[60px]">
                    <div className="text-xs text-ink-muted">{e.when.split(",")[0]}</div>
                    <div className="font-display text-lg tabular leading-tight">
                      {e.when.split(",")[1]?.trim() || ""}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ink-muted mb-0.5">{e.course}</div>
                    <div className="font-semibold text-sm leading-snug">{e.title}</div>
                    <div className="text-xs text-ink-muted mt-1">{e.place}</div>
                  </div>
                  <span className={stateBadge[e.state]}>
                    {e.state === "now" ? "Live" : e.state === "soon" ? "Soon" : "Later"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <h3 className="font-semibold text-lg mb-4">Due this week</h3>
            <ul className="space-y-3">
              {openAssignments.slice(0, 3).map((a) => {
                const pct = Math.round((a.submissions / a.of) * 100);
                return (
                  <li key={a.id} className="card p-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-ink-muted">{a.code} , {a.course}</span>
                      <span className="badge badge-saffron">{a.weight}%</span>
                    </div>
                    <div className="font-semibold text-sm leading-snug mb-2">{a.title}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-muted">Due {a.due}</span>
                      <span className="text-ink-muted">{pct}% submitted</span>
                    </div>
                    <Link href="/assignments" className="btn btn-ghost btn-sm w-full mt-3">
                      Submit
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <h3 className="font-semibold text-lg mb-4">From the rooms</h3>
            <ul className="space-y-3">
              {pinned.map((r) => (
                <li key={r.id} className="card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-oxblood">Pinned</span>
                    <span className="text-xs text-ink-muted">{r.last}</span>
                  </div>
                  <div className="font-semibold text-sm leading-snug">{r.title}</div>
                  <p className="text-xs text-ink-muted mt-1.5 line-clamp-2">{r.excerpt}</p>
                  <div className="text-xs text-ink-muted mt-2">
                    {r.starter} , {r.posts} posts , {r.members} in
                  </div>
                </li>
              ))}
              {MESSAGES.length ? (
                <li className="card p-4">
                  <div className="text-xs text-ink-muted mb-2">Latest reply</div>
                  <div className="text-sm">
                    <span className="font-semibold text-oxblood">{MESSAGES.at(-1)?.author}</span>
                    <span className="text-ink-muted"> , {MESSAGES.at(-1)?.time}</span>
                  </div>
                  <p className="text-sm mt-1.5 line-clamp-2">{MESSAGES.at(-1)?.body}</p>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Courses enrolled", value: "4", caption: "this term" },
            { label: "Average grade", value: "B+", caption: "across all courses" },
            { label: "Attendance rate", value: "96%", caption: "30-day rolling" },
            { label: "Streak", value: "14d", caption: "consecutive sessions" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className="text-sm text-ink-muted">{s.label}</div>
              <div className="display text-3xl mt-2">{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-dark/30 border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <SectionHeading
            eyebrow="Recommended"
            title="Other junior students also enrolled in"
            link={{ href: "/courses", label: "Browse all" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.slice().reverse().map((c) => (
              <CourseCard
                key={`rec-${c.id}`}
                id={c.id}
                code={c.code}
                title={c.title}
                mentor={c.mentor}
                cohort={c.cohort}
                pace={c.pace}
                color={c.color as never}
                {...ratingFor(c.code)}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="size-20 rounded-full bg-gradient-to-br from-oxblood to-oxblood-deep flex items-center justify-center text-bone font-display italic text-3xl shrink-0">
              A
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-oxblood mb-1">Rate your mentor</div>
              <h3 className="display text-2xl">How was Adam this week?</h3>
              <p className="text-sm text-ink-muted mt-1">
                Quick anonymous review of your senior student mentor | takes 30 seconds.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StarRating value={0} size="md" />
              <Link href="/feedback" className="btn btn-secondary">Leave review</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
