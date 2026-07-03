import Link from "next/link";
import { Plus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { requireRole } from "@/lib/session";
import { getCoursesView } from "@/lib/queries";
import { CoursesTable } from "./courses-table";

export const metadata = {
  title: "Manage courses | Admin",
  description: "Admin course management.",
};

export default async function AdminCoursesPage() {
  await requireRole("Admin");
  const courses = await getCoursesView();
  const rows = courses.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    mentor: c.mentor,
    cohort: c.cohort,
    enrolled: c.enrolled,
    capacity: c.capacity,
  }));

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <span className="text-ink">Courses</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage courses</h1>
              <p className="mt-2 text-ink-soft">{courses.length} courses in the catalogue.</p>
            </div>
            <Link href="/admin/courses/new" className="btn btn-primary">
              <Plus size={16} /> Add course
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <CoursesTable courses={rows} />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
