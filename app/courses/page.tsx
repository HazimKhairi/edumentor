import Link from "next/link";
import { Search } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CategoryFilterableGrid } from "@/components/category-filterable-grid";
import { getCoursesView, getFeedbackView } from "@/lib/queries";

export const metadata = {
  title: "Courses | EduMentor",
  description: "Browse the full course catalogue for the term.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [allCourses, feedback] = await Promise.all([
    getCoursesView(),
    getFeedbackView(),
  ]);

  const ratingMap = new Map(
    feedback.map((f) => [f.course, { rating: f.score, reviews: f.n * 11 }]),
  );
  const ratingFor = (code: string) =>
    ratingMap.get(code) ?? { rating: 4.5, reviews: 84 };

  const query = (q ?? "").trim().toLowerCase();
  const filtered = query
    ? allCourses.filter(
        (c) =>
          c.code.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.mentor.toLowerCase().includes(query) ||
          c.abstract.toLowerCase().includes(query),
      )
    : allCourses;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <span className="text-ink">Courses</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Course catalogue</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {allCourses.length} courses, open for Semester 02 / 2026.
          </p>

          <form
            action="/courses"
            method="GET"
            className="mt-6 flex items-center gap-2 max-w-xl"
          >
            <label className="relative flex-1">
              <Search
                size={16}
                aria-hidden
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search by title, code, or mentor"
                className="input pl-10 py-2.5"
              />
            </label>
            <button type="submit" className="btn btn-primary">Search</button>
            {query ? (
              <Link href="/courses" className="btn btn-ghost btn-sm">
                Clear
              </Link>
            ) : null}
          </form>

          {query ? (
            <p className="text-xs text-ink-muted mt-3">
              {filtered.length} {filtered.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          {filtered.length === 0 ? (
            <div className="card p-8 text-center text-sm text-ink-muted">
              No courses match this search.
            </div>
          ) : (
            <CategoryFilterableGrid
              courses={filtered.map((c) => ({
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
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
