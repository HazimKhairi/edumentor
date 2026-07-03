import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Users } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getCourseView } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("Admin");
  const { id } = await params;
  const c = await getCourseView(id);
  if (!c) notFound();

  // Everyone enrolled in this course, with the role they hold here.
  const enrolments = await db.enrollment.findMany({
    where: { courseId: id },
    include: { user: { select: { id: true, name: true, identity: true } } },
  });
  // Each mentee's chosen mentor for this course (if picked yet).
  const choices = await db.mentorshipAssignment.findMany({
    where: { courseId: id },
    include: { mentor: { select: { name: true } } },
  });
  const choiceMap = new Map(choices.map((m) => [m.menteeId, m.mentor.name]));

  // Mentors first, then mentees, each alphabetical.
  const roster = enrolments.slice().sort((a, b) => {
    if (a.asRole !== b.asRole) return a.asRole === "Mentor" ? -1 : 1;
    return a.user.name.localeCompare(b.user.name);
  });
  const mentorCount = roster.filter((e) => e.asRole === "Mentor").length;
  const menteeCount = roster.filter((e) => e.asRole === "Mentee").length;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1100px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/courses" className="hover:text-ink">Courses</Link>{" / "}
            <span className="text-ink">{c.code}</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{c.code}, {c.title}</h1>
              <p className="mt-2 text-ink-soft">
                Semester {c.semester} , {c.cohort} , lecturer {c.lecturer}
              </p>
            </div>
            <Link href={`/admin/courses/${c.id}/edit`} className="btn btn-ghost">
              <Pencil size={16} /> Edit details
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-10 space-y-5">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-oxblood" />
            <h2 className="text-lg font-semibold">Enrolled students</h2>
          </div>
          <p className="text-sm text-ink-muted -mt-3">
            {roster.length} enrolled , {mentorCount} mentor{mentorCount === 1 ? "" : "s"} , {menteeCount} mentee{menteeCount === 1 ? "" : "s"}. Mentees show the mentor they picked for {c.code}.
          </p>

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Matric</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold">Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {roster.map((e) => {
                  const chosen = choiceMap.get(e.user.id);
                  return (
                    <tr key={e.user.id} className="hover:bg-paper-dark/30">
                      <td className="px-4 py-2.5 font-medium">{e.user.name}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-muted tabular">{e.user.identity}</td>
                      <td className="px-4 py-2.5">
                        <span className={e.asRole === "Mentor" ? "badge badge-saffron" : "badge badge-muted"}>
                          {e.asRole}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {e.asRole === "Mentor" ? (
                          <span className="text-ink-muted">—</span>
                        ) : chosen ? (
                          <span className="badge badge-fern">{chosen}</span>
                        ) : (
                          <span className="badge badge-muted">Pending pick</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {roster.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-ink-muted text-center">
                      No students enrolled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
