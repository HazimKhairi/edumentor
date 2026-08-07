import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  CourseBreakdownTable,
  OverallTable,
  PerformanceLegend,
  PerformanceSummary,
} from "@/components/performance-monitor";
import { CourseSelect } from "@/components/course-select";
import { db } from "@/lib/db";
import { getMonitoringRows } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export const metadata = {
  title: "Monitoring | EduMentor",
  description: "Assignment marks and overall performance for your mentees.",
};

export default async function MentorMonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const me = await requireRole("Mentor");
  const { course } = await searchParams;

  // Scoped by mentorId, so this view can only ever contain mentees assigned to
  // the signed-in mentor. A course id in the query string narrows the view but
  // cannot widen it past that scope.
  const [rows, courses] = await Promise.all([
    getMonitoringRows({ mentorId: me.id, courseId: course || undefined }),
    db.course.findMany({
      where: { enrollments: { some: { userId: me.id, asRole: "Mentor" } } },
      select: { id: true, code: true, title: true },
      orderBy: { semester: "asc" },
    }),
  ]);

  const activeCourse = courses.find((c) => c.id === course);

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/mentor" className="hover:text-ink">Mentor</Link>
            {" / "}
            <span className="text-ink">Monitoring</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">My mentees&rsquo; performance</h1>
          <p className="mt-3 text-ink-soft">
            Assignment marks and overall performance for the mentees assigned to
            you.
            {activeCourse ? ` Filtered to ${activeCourse.code}.` : ""}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 pt-10">
          <CourseSelect
            courses={courses}
            active={course}
            basePath="/mentor/monitoring"
          />
        </div>
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <PerformanceSummary rows={rows} />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 pb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold text-lg">Overall performance</h2>
            <span className="text-xs text-ink-muted">
              Weighted average of graded work
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="text-sm text-ink-muted">
              No mentees assigned to you yet. Once a mentee picks you for a
              course, their marks appear here.
            </p>
          ) : (
            <OverallTable rows={rows} />
          )}
        </div>
      </section>

      {rows.length > 0 ? (
        <section className="bg-paper-dark/30 border-t border-rule">
          <div className="mx-auto max-w-[1400px] px-6 py-10">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-semibold text-lg">Marks by course</h2>
              <Link
                href="/mentor/assignments"
                className="text-xs text-oxblood font-semibold"
              >
                Go to assignments to enter marks
              </Link>
            </div>
            <CourseBreakdownTable rows={rows} />
            <div className="mt-6">
              <PerformanceLegend />
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  );
}
