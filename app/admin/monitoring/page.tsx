import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  CourseBreakdownTable,
  CourseFilter,
  OverallTable,
  PerformanceSummary,
} from "@/components/performance-monitor";
import { db } from "@/lib/db";
import { getMonitoringRows } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export const metadata = {
  title: "Monitoring | EduMentor",
  description: "Assignment marks and overall performance for every student.",
};

export default async function AdminMonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  await requireRole("Admin");
  const { course } = await searchParams;

  const [rows, courses] = await Promise.all([
    getMonitoringRows({ courseId: course || undefined }),
    db.course.findMany({
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
            <Link href="/admin" className="hover:text-ink">Admin</Link>
            {" / "}
            <span className="text-ink">Monitoring</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Student performance monitoring</h1>
          <p className="mt-3 text-ink-soft">
            Assignment marks across every course, with overall performance per
            student.
            {activeCourse ? ` Filtered to ${activeCourse.code}.` : ""}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 pt-10">
          <CourseFilter
            courses={courses}
            active={course}
            basePath="/admin/monitoring"
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
          <OverallTable rows={rows} />
        </div>
      </section>

      <section className="bg-paper-dark/30 border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-semibold text-lg">Marks by course</h2>
            <span className="text-xs text-ink-muted">
              Hover a mark to see the assignment title and weight
            </span>
          </div>
          <CourseBreakdownTable rows={rows} />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
