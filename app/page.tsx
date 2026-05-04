import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { COURSES, FEEDBACK_ENTRIES, ROLES, STATS } from "@/lib/data";

const CATEGORIES = [
  { label: "All", count: 4 },
  { label: "Computer Science", count: 2 },
  { label: "Mathematics", count: 1 },
  { label: "Statistics", count: 1 },
  { label: "Foundation", count: 1 },
];

function ratingFor(courseCode: string) {
  const fb = FEEDBACK_ENTRIES.find((f) => f.course === courseCode);
  if (fb) return { rating: fb.score, reviews: fb.n * 11 };
  return { rating: 4.5, reviews: 84 };
}

export default function HomePage() {
  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="inline-flex items-center gap-2 badge badge-saffron mb-5">
              <span className="size-1.5 rounded-full bg-saffron" /> Term enrolment is open
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Learn from mentors who actually{" "}
              <span className="display-italic text-oxblood">care</span>.
            </h1>
            <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-xl">
              EduMentor is a small, mentor-led learning platform for UiTM
              cohorts. Pick a course, join the discussion, get real
              feedback on your work — all in one quiet place.
            </p>

            <form className="mt-8 flex items-center gap-2 max-w-xl">
              <label className="relative flex-1">
                <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">⌕</span>
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
              <span className="hidden sm:inline">·</span>
              <span><span className="font-semibold text-ink">158</span> active mentees</span>
              <span className="hidden sm:inline">·</span>
              <span><span className="font-semibold text-ink">12</span> mentors on roster</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <CourseCard
              id={COURSES[0].id}
              code={COURSES[0].code}
              title={COURSES[0].title}
              mentor={COURSES[0].mentor}
              color={COURSES[0].color as never}
              {...ratingFor(COURSES[0].code)}
            />
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

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.label}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-ink text-bone"
                    : "bg-bone text-ink-soft border border-rule hover:border-ink"
                }`}
              >
                {c.label}
                <span className="ml-1.5 text-xs opacity-60">{c.count}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((c) => (
              <CourseCard
                key={c.id}
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
                <ul className="space-y-2 mb-6 text-sm">
                  {role.duties.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <span className="text-oxblood mt-0.5" aria-hidden>✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn btn-secondary btn-sm mt-auto self-start">
                  Continue as {role.key.toLowerCase()} →
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
            <div className="card p-2 bg-oxblood text-bone overflow-hidden">
              <div className="aspect-square rounded-md bg-gradient-to-br from-oxblood to-oxblood-deep flex items-end p-8">
                <div>
                  <div className="text-sm font-semibold text-saffron mb-2">Mentor of the term</div>
                  <div className="display text-4xl">Dr. Aishah <span className="display-italic">Mokhtar</span></div>
                  <p className="text-sm mt-3 opacity-80">MAT CS110 · Discrete Structures</p>
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
              <span className="text-sm text-ink-muted">·</span>
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
                  <span className="size-5 rounded-full bg-saffron/20 text-saffron flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/attendance" className="btn btn-secondary mt-7 inline-flex">
              See it in action →
            </Link>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="card p-3 overflow-hidden">
              <div className="relative aspect-[5/4] rounded-md overflow-hidden bg-gradient-to-br from-ink to-ink-soft">
                <div className="absolute inset-6 border border-bone/20 rounded-sm">
                  {[
                    { x: 8, y: 12, w: 22, h: 28, name: "Aiman", ok: true },
                    { x: 38, y: 10, w: 22, h: 30, name: "Sofea", ok: true },
                    { x: 70, y: 16, w: 20, h: 26, name: "Faris", ok: true },
                    { x: 12, y: 56, w: 22, h: 28, name: "Liyana", ok: false },
                    { x: 44, y: 60, w: 22, h: 28, name: "Hafiz", ok: true },
                    { x: 72, y: 58, w: 20, h: 26, name: "Iman", ok: true },
                  ].map((b) => (
                    <div
                      key={b.name}
                      className={`absolute border ${b.ok ? "border-saffron" : "border-bone/40 border-dashed"} rounded-sm`}
                      style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                    >
                      <div className={`absolute -top-5 left-0 text-[10px] font-semibold ${b.ok ? "text-saffron" : "text-bone/60"}`}>
                        {b.name} {b.ok && "✓"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 left-4 text-xs font-medium text-bone/80 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-oxblood blink" />
                  Live · 5 / 6 matched
                </div>
                <div className="absolute bottom-3 right-4 text-xs text-bone/60">
                  BD-3, Block A · 14:02
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 pb-16">
          <div className="card bg-ink text-bone p-10 md:p-14 grid grid-cols-12 gap-6 items-center border-ink">
            <div className="col-span-12 md:col-span-8">
              <h2 className="display text-3xl md:text-5xl">
                Ready to take a seat at the{" "}
                <span className="display-italic text-saffron">desk?</span>
              </h2>
              <p className="mt-4 text-bone/80 max-w-xl leading-relaxed">
                Sign in with your matric or staff number and pick a role.
                The demo classroom is open — no payment, no permission slip.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-wrap md:justify-end gap-3">
              <Link
                href="/login"
                className="btn btn-lg"
                style={{ background: "var(--color-saffron)", color: "var(--color-ink)" }}
              >
                Sign in →
              </Link>
              <Link
                href="/courses"
                className="btn btn-lg"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "var(--color-bone)", border: "1px solid rgba(255,255,255,0.3)" }}
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
