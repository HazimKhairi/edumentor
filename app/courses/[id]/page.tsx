import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseThumb } from "@/components/course-thumb";
import { StarRating } from "@/components/star-rating";
import { COURSES, FEEDBACK_ENTRIES } from "@/lib/data";

export async function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

function ratingFor(courseCode: string) {
  const fb = FEEDBACK_ENTRIES.find((f) => f.course === courseCode);
  if (fb) return { rating: fb.score, reviews: fb.n * 11 };
  return { rating: 4.5, reviews: 84 };
}

export default async function CourseDetailPage(props: PageProps<"/courses/[id]">) {
  const { id } = await props.params;
  const course = COURSES.find((c) => c.id === id);
  if (!course) notFound();

  const r = ratingFor(course.code);
  const fillPct = Math.round((course.enrolled / course.capacity) * 100);

  const SYLLABUS = [
    { week: 1, title: "Logic and propositions" },
    { week: 2, title: "Sets and functions" },
    { week: 3, title: "Relations and partial orders" },
    { week: 4, title: "Mathematical induction" },
    { week: 5, title: "Strong induction on trees" },
    { week: 6, title: "Combinatorics, counting" },
    { week: 7, title: "Graphs, fundamentals" },
    { week: 8, title: "Eulerian and Hamiltonian paths" },
  ];

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="text-sm text-ink-muted mb-2">
              <Link href="/" className="hover:text-ink">Home</Link>{" / "}
              <Link href="/courses" className="hover:text-ink">Courses</Link>{" / "}
              <span className="text-ink">{course.code}</span>
            </div>
            <span className="badge badge-saffron mb-3 inline-block">{course.code}</span>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">{course.abstract}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              <StarRating value={r.rating} count={r.reviews} size="sm" />
              <span className="text-ink-muted">|</span>
              <span><span className="font-semibold tabular">{course.enrolled}</span> junior students enrolled</span>
              <span className="text-ink-muted">|</span>
              <span>{course.sessions} sessions</span>
              <span className="text-ink-muted">|</span>
              <span>{course.cohort}</span>
            </div>

            <div className="mt-5 text-sm space-y-1">
              <div>
                <span className="text-ink-muted">Senior mentor: </span>
                <span className="font-semibold">{course.mentor}</span>
              </div>
              <div>
                <span className="text-ink-muted">Lecturer: </span>
                <span className="font-semibold">{course.lecturer}</span>
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <div className="card p-0 overflow-hidden lg:sticky lg:top-32">
              <CourseThumb code={course.code} title={course.title} color={course.color as never} />
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-ink-muted">Free enrolment</span>
                  <span className="text-xs text-ink-muted">{fillPct}% full</span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden mb-5">
                  <div className="h-full bg-oxblood rounded-full" style={{ width: `${fillPct}%` }} />
                </div>

                <Link
                  href="/dashboard?enrolled=1"
                  className="btn btn-primary btn-lg w-full mb-2"
                >
                  Enrol in this course
                </Link>
                <Link href="#" className="btn btn-ghost w-full text-sm">
                  Add to watchlist
                </Link>

                <ul className="mt-6 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-ink-muted">Pace</span>
                    <span className="font-medium">{course.pace}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-ink-muted">Sessions</span>
                    <span className="font-medium tabular">{course.sessions}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-ink-muted">Capacity</span>
                    <span className="font-medium tabular">{course.enrolled}/{course.capacity}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-ink-muted">Language</span>
                    <span className="font-medium">English, BM</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div>
              <h2 className="text-xl font-bold mb-4">What you will learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Read and write rigorous mathematical proofs",
                  "Apply induction to recursive structures",
                  "Reason about graphs, trees, and combinatorial objects",
                  "Translate problem statements into formal logic",
                  "Use discrete tools to analyse algorithm correctness",
                  "Bridge math intuition with code on weekly labs",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Syllabus</h2>
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {SYLLABUS.map((s) => (
                  <li key={s.week} className="px-5 py-3 flex items-center gap-4 hover:bg-paper-dark/40">
                    <span className="text-xs text-ink-muted w-14 tabular">Week {s.week}</span>
                    <span className="flex-1 text-sm">{s.title}</span>
                    <span className="text-xs text-ink-muted">2 hours</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Senior student mentor</h2>
              <div className="card p-6 flex items-start gap-4">
                <div className="size-16 rounded-full bg-gradient-to-br from-oxblood to-oxblood-deep flex items-center justify-center text-bone text-xl font-bold shrink-0">
                  {course.mentor.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h3 className="font-semibold">{course.mentor}</h3>
                  <p className="text-xs text-ink-muted">
                    Senior B.Sc. CS, CGPA 3.20+ , Faculty of Computer & Mathematical Sciences
                  </p>
                  <div className="mt-2"><StarRating value={r.rating} count={r.reviews} size="sm" /></div>
                  <p className="text-sm mt-3 text-ink-soft leading-relaxed">
                    Patient and clear. Has already passed this course, runs peer
                    sessions every Thursday under {course.lecturer}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <div className="card p-6">
              <h3 className="font-semibold text-base mb-4">Enrolment summary</h3>
              <ul className="space-y-2 text-sm mb-5">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                  <span>Full access to discussion rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                  <span>Submit and review weekly assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                  <span>Attendance recorded automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-fern shrink-0 mt-0.5" aria-hidden />
                  <span>Term-end mentor evaluation</span>
                </li>
              </ul>
              <Link
                href="/dashboard?enrolled=1"
                className="btn btn-primary w-full"
              >
                Confirm enrolment
              </Link>
              <p className="text-xs text-ink-muted mt-3 text-center">
                Free for the demo cohort. Withdraw any time before week 3.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
