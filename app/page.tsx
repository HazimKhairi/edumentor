import Link from "next/link";
import { Check, Search } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { CategoryFilterableGrid } from "@/components/category-filterable-grid";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { IllustrationMentor } from "@/components/illustrations";
import { ROLES } from "@/lib/data";
import { getCoursesView, getFeedbackView, getStats } from "@/lib/queries";

export default async function HomePage() {
  const COURSES = await getCoursesView();
  const FEEDBACK_ENTRIES = await getFeedbackView();
  const STATS = await getStats();

  function ratingFor(courseCode: string) {
    const fb = FEEDBACK_ENTRIES.find((f) => f.course === courseCode);
    if (fb) return { rating: fb.score, reviews: fb.n * 11 };
    return { rating: 4.5, reviews: 84 };
  }

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Learn from mentors who actually{" "}
              <span className="display-italic text-oxblood">care</span>.
            </h1>
            <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-xl">
              EduMentor is a small, mentor-led learning platform for UiTM
              cohorts. Pick a course, join the discussion, get real
              feedback on your work | all in one quiet place.
            </p>

            <form className="mt-8 flex items-center gap-2 max-w-xl">
              <label className="relative flex-1">
                <Search size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="search"
                  placeholder="What do you want to learn? e.g. discrete math"
                  className="input pl-10 py-3 text-base"
                />
              </label>
              <button className="btn btn-primary btn-lg">Search</button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <StarRating value={4.6} />
                <span>average mentor rating</span>
              </div>
              <span className="hidden sm:inline">,</span>
              <span><span className="font-semibold text-ink">158</span> mentees enrolled</span>
              <span className="hidden sm:inline">,</span>
              <span><span className="font-semibold text-ink">12</span> student mentors</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            {COURSES[0] ? (
              <CourseCard
                id={COURSES[0].id}
                code={COURSES[0].code}
                title={COURSES[0].title}
                mentor={COURSES[0].mentor}
                color={COURSES[0].color as never}
                {...ratingFor(COURSES[0].code)}
              />
            ) : (
              <div className="card p-6 text-sm text-ink-muted">
                No courses in the catalogue yet. An admin will add the first one soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-paper-dark/40 border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-2xl md:text-3xl font-bold text-ink">{s.value}</div>
              <div className="text-sm font-semibold text-ink mt-1">{s.label}</div>
              <div className="text-xs text-ink-muted">{s.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP COURSES */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading
            eyebrow="Top this term"
            title="Courses students are loving"
            description="Hand-picked classes with high mentor ratings, healthy discussion, and real feedback."
            link={{ href: "/courses", label: "Browse all courses" }}
          />

          <CategoryFilterableGrid
            courses={COURSES.map((c) => ({
              id: c.id,
              code: c.code,
              title: c.title,
              mentor: c.mentor,
              cohort: c.cohort,
              pace: c.pace,
              color: c.color,
              ...ratingFor(c.code),
            }))}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-paper-dark/30 border-y border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading
            eyebrow="How it works"
            title="Three roles, one quiet folio"
            description="Whether you're learning, teaching, or stewarding the catalogue, EduMentor gives you a clear seat at the desk."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((role, idx) => (
              <article key={role.key} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="size-10 rounded-full bg-oxblood text-bone flex items-center justify-center font-display italic text-xl">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-ink">{role.key}</h3>
                    <div className="text-xs text-ink-muted">{role.abbr}</div>
                  </div>
                </div>
                <p className="text-base text-ink-soft mb-4">{role.oneLiner}</p>
                <ul className="space-y-2 mb-4 text-sm">
                  {role.duties.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check size={16} className="text-oxblood mt-1 shrink-0" aria-hidden />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                {role.key === "Mentor" ? (
                  <p className="text-xs text-ink-muted mb-4 p-2 rounded-sm bg-paper-dark/50">
                    <span className="font-semibold text-ink">Eligibility:</span> student with CGPA 3.20 or above, having passed the subjects they will mentor.
                  </p>
                ) : null}
                {role.key === "Admin" ? (
                  <p className="text-xs text-ink-muted mb-4 p-2 rounded-sm bg-paper-dark/50">
                    <span className="font-semibold text-ink">Eligibility:</span> faculty lecturer, account issued by registrar.
                  </p>
                ) : null}
                <Link
                  href={role.key === "Admin" ? "/login" : "/register"}
                  className="btn btn-secondary btn-sm mt-auto self-start"
                >
                  Continue as {role.key.toLowerCase()}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MENTOR SPOTLIGHT */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-16 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <div className="card p-0 overflow-hidden">
              <div className="relative aspect-square">
                <IllustrationMentor className="absolute inset-0 w-full h-full" />
                <div
                  className="absolute inset-x-0 bottom-0 p-6"
                  style={{ background: "linear-gradient(to top, rgba(28,26,23,0.85), rgba(28,26,23,0))", color: "var(--color-bone)" }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-saffron)" }}>
                    Mentor of the term
                  </div>
                  <div className="text-2xl font-bold">Adam Iskandar Razak</div>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                    Final-year B.Sc. CS, MAT CS110 peer mentor
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <SectionHeading
              eyebrow="Mentor spotlight"
              title="Patient. Rigorous. Always on time for office hours."
            />
            <blockquote className="text-2xl md:text-3xl font-bold text-ink-soft leading-snug">
              <span className="display-italic text-oxblood">“</span>
              The aim of a good classroom is to make criticism feel like
              kindness, and kindness feel like rigour.
              <span className="display-italic text-oxblood">”</span>
            </blockquote>
            <div className="mt-5 flex items-center gap-4">
              <StarRating value={4.7} count={451} size="md" />
              <span className="text-sm text-ink-muted">,</span>
              <span className="text-sm text-ink-muted">24 sessions this term</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-primary">Open her courses</Link>
              <Link href="/discussion" className="btn btn-ghost">Read her room</Link>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-paper-dark/30 border-y border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <SectionHeading
            eyebrow="From the students"
            title="What mentees are saying"
            link={{ href: "/feedback", label: "All reviews" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEEDBACK_ENTRIES.map((f) => (
              <article key={f.id} className="card p-6">
                <StarRating value={f.score} size="sm" />
                <p className="mt-3 text-base text-ink leading-relaxed">
                  &ldquo;{f.comment}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-rule flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{f.mentor}</div>
                    <div className="text-xs text-ink-muted">{f.course}</div>
                  </div>
                  <span className="text-xs text-ink-muted">{f.n} reviews</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ATTENDANCE FEATURE */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-16 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-6">
            <div className="text-sm font-semibold text-oxblood mb-3">Smart attendance</div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink">
              The roll, called by the camera.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
              Open the live class, point the camera at the room, and watch
              matric numbers tick off. Mentors override; mentees confirm.
              An audit trail per session is kept for the registrar.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Recognises a cohort of 60 in under five seconds",
                "Manual override for late or excused students",
                "Audit trail per session, exportable on demand",
                "98.4% accuracy across the last 30 days",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="size-5 rounded-full bg-saffron/20 text-saffron flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/attendance" className="btn btn-secondary mt-7 inline-flex">
              See it in action
            </Link>
          </div>

          <div className="col-span-12 md:col-span-6">
            {/* Live attendance preview card */}
            <div className="card p-0 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-rule bg-paper-dark/50">
                <div className="text-sm font-semibold">MAT CS110, Live class</div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-oxblood">
                  <span className="size-1.5 rounded-full bg-oxblood blink" />
                  Live now
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm text-ink-muted">Recognised today</span>
                  <span className="text-sm font-semibold tabular">5 of 6 matched</span>
                </div>
                <div className="h-2 rounded-full bg-paper-dark overflow-hidden mb-5">
                  <div className="h-full bg-oxblood rounded-full" style={{ width: "83%" }} />
                </div>

                <ul className="divide-y divide-rule">
                  {[
                    { name: "Aiman Hakimi", matric: "2023607832", ok: true },
                    { name: "Nur Sofea", matric: "2023608112", ok: true },
                    { name: "Faris Adlan", matric: "2023611901", ok: true },
                    { name: "Liyana Aziz", matric: "2023612200", ok: false },
                    { name: "Hafiz Ridzwan", matric: "2023612555", ok: true },
                    { name: "Iman Yusoff", matric: "2023612823", ok: true },
                  ].map((s) => (
                    <li key={s.matric} className="flex items-center gap-3 py-2.5">
                      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        s.ok ? "bg-fern/15 text-fern" : "bg-paper-dark text-ink-muted"
                      }`}>
                        {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{s.name}</div>
                        <div className="text-xs text-ink-muted tabular">{s.matric}</div>
                      </div>
                      {s.ok ? (
                        <span className="badge badge-fern inline-flex items-center gap-1">
                          <Check size={12} /> Present
                        </span>
                      ) : (
                        <span className="badge badge-muted">Awaiting</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 pb-16">
          <div
            className="rounded-md p-10 md:p-14 grid grid-cols-12 gap-6 items-center"
            style={{ backgroundColor: "var(--color-ink)", color: "var(--color-bone)" }}
          >
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-bone)" }}>
                Ready to start learning with EduMentor?
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Sign in with your matric or staff number and pick a role.
                The demo classroom is open, no payment, no permission slip.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-wrap md:justify-end gap-3">
              <Link
                href="/login"
                className="btn btn-lg"
                style={{ backgroundColor: "var(--color-saffron)", color: "#ffffff" }}
              >
                Sign in
              </Link>
              <Link
                href="/courses"
                className="btn btn-lg"
                style={{
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "var(--color-bone)",
                  backgroundColor: "transparent",
                }}
              >
                Browse courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
