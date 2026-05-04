import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { COURSES, FEEDBACK_ENTRIES } from "@/lib/data";

export const metadata = {
  title: "Courses — EduMentor",
  description: "Browse the full course catalogue for the term.",
};

const FILTERS = [
  {
    title: "Subject",
    options: [
      { label: "Computer Science", count: 2 },
      { label: "Mathematics", count: 1 },
      { label: "Statistics", count: 1 },
      { label: "Foundation", count: 1 },
    ],
  },
  {
    title: "Level",
    options: [
      { label: "Foundation", count: 1 },
      { label: "Year 1", count: 1 },
      { label: "Year 2", count: 2 },
      { label: "Year 3", count: 0 },
    ],
  },
  {
    title: "Schedule",
    options: [
      { label: "Mornings", count: 2 },
      { label: "Afternoons", count: 2 },
      { label: "Online available", count: 4 },
    ],
  },
  {
    title: "Mentor",
    options: [
      { label: "Dr. Aishah Mokhtar", count: 2 },
      { label: "Encik Faiz Rashid", count: 1 },
      { label: "Pn. Liyana Hashim", count: 1 },
    ],
  },
];

function ratingFor(courseCode: string) {
  const fb = FEEDBACK_ENTRIES.find((f) => f.course === courseCode);
  if (fb) return { rating: fb.score, reviews: fb.n * 11 };
  return { rating: 4.5, reviews: 84 };
}

export default function CoursesPage() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Courses</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Course catalogue</h1>
          <p className="mt-3 text-ink-soft max-w-2xl">
            {COURSES.length} courses · open for Semester 02 / 2026 · taught by 12 mentors.
          </p>

          <form className="mt-6 flex items-center gap-2 max-w-xl">
            <label className="relative flex-1">
              <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">⌕</span>
              <input
                type="search"
                placeholder="Search by title, code, or mentor"
                className="input pl-10 py-2.5"
              />
            </label>
            <button className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-base">Filters</h2>
                <button className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                  Clear all
                </button>
              </div>

              {FILTERS.map((f) => (
                <details key={f.title} open className="border-b border-rule pb-4 group">
                  <summary className="list-none cursor-pointer flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">{f.title}</span>
                    <span aria-hidden className="text-ink-muted group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <ul className="space-y-2">
                    {f.options.map((o) => (
                      <li key={o.label}>
                        <label className="flex items-center justify-between gap-2 cursor-pointer text-sm">
                          <span className="flex items-center gap-2">
                            <input type="checkbox" className="size-4 accent-oxblood" />
                            <span>{o.label}</span>
                          </span>
                          <span className="text-xs text-ink-muted">({o.count})</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}

              <div className="border-b border-rule pb-4">
                <h3 className="font-semibold text-sm mb-3">Rating</h3>
                <ul className="space-y-2">
                  {[4.5, 4.0, 3.5].map((r) => (
                    <li key={r}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="radio" name="rating" className="size-4 accent-oxblood" />
                        <span className="text-saffron">
                          {"★".repeat(Math.floor(r))}
                          {"☆".repeat(5 - Math.floor(r))}
                        </span>
                        <span>{r}+ &amp; up</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ink-muted">
                Showing <span className="font-semibold text-ink">{COURSES.length}</span> courses
              </p>
              <select className="input max-w-[200px] py-2 text-sm">
                <option>Most popular</option>
                <option>Newest</option>
                <option>Highest rated</option>
                <option>A → Z</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {COURSES.map((c) => (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  code={c.code}
                  title={c.title}
                  mentor={c.mentor}
                  cohort={c.cohort}
                  pace={c.pace}
                  enrolled={c.enrolled}
                  capacity={c.capacity}
                  sessions={c.sessions}
                  color={c.color as never}
                  {...ratingFor(c.code)}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-12">
              <button className="btn btn-ghost btn-sm" disabled>← Prev</button>
              <button className="size-9 rounded-sm border border-ink bg-ink text-bone text-sm font-semibold">1</button>
              <button className="size-9 rounded-sm border border-rule hover:border-ink text-sm">2</button>
              <button className="size-9 rounded-sm border border-rule hover:border-ink text-sm">3</button>
              <button className="btn btn-ghost btn-sm">Next →</button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
