import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AssignmentsTabs } from "@/components/assignments-tabs";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { courseIdsForUser, getAssignmentsView } from "@/lib/queries";

export const metadata = {
  title: "Assignments | EduMentor",
  description: "Submissions, due dates, and graded work.",
};

export default async function AssignmentsPage() {
  const me = await requireUser();
  // Me4: only show assignments for courses I am enrolled in (or, if mentor,
  // teaching). Without this, Nazrul (MAT183 mentee) sees MAT133/MAT210/etc.
  const myCourseIds = await courseIdsForUser(me.id, me.role);
  const myCourseCodes = (
    await db.course.findMany({
      where: { id: { in: myCourseIds } },
      select: { code: true },
    })
  ).map((c) => c.code);
  const assignments = await getAssignmentsView(myCourseCodes);
  const mySubmissions = await db.assignmentSubmission.findMany({
    where: { menteeId: me.id },
    select: { assignmentId: true, grade: true },
  });
  const mineByAssignment = new Map(
    mySubmissions.map((s) => [s.assignmentId, s] as const),
  );

  const rows = assignments.map((a) => {
    const mine = mineByAssignment.get(a.id);
    return {
      id: a.id,
      code: a.code,
      title: a.title,
      course: a.course,
      type: a.type,
      status: a.status,
      weight: a.weight,
      submissions: a.submissions,
      of: a.of,
      due: a.due,
      issued: a.issued,
      note: a.note,
      mineSubmitted: Boolean(mine),
      mineGrade: mine?.grade ?? null,
    };
  });

  const open = rows.filter((a) => a.status !== "Closed").length;
  const closed = rows.length - open;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Assignments</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">My assignments</h1>
          <p className="mt-3 text-ink-soft">
            {open} open, {closed} closed. Late submissions lose 2 points per day.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <AssignmentsTabs rows={rows} />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
