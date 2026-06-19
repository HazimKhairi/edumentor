import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, UserPlus, Users } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getCourseView, mentorOptionsForCourse } from "@/lib/queries";
import {
  assignMentorToCourse,
  removeMentorFromCourse,
  setMentorCapacity,
} from "@/lib/actions";
import { MENTOR_COURSE_CAP, MENTOR_MENTEE_CAP } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole("Admin");
  const { id } = await params;
  const { error } = await searchParams;
  const c = await getCourseView(id);
  if (!c) notFound();

  const mentors = await mentorOptionsForCourse(id);
  const assignedIds = new Set(mentors.map((m) => m.mentorId));
  const poolFull = mentors.length >= MENTOR_COURSE_CAP;

  // Eligible to add: Mentor-role users who passed this subject (their semester
  // is strictly above the course semester) and aren't already in the pool.
  const eligible = (
    await db.user.findMany({
      where: { role: "Mentor", semester: { gt: c.semester } },
      select: { id: true, name: true, cgpa: true, semester: true },
      orderBy: { name: "asc" },
    })
  ).filter((m) => !assignedIds.has(m.id));

  // Mentee roster with their chosen mentor (or pending).
  const menteeEnrolments = await db.enrollment.findMany({
    where: { courseId: id, asRole: "Mentee" },
    include: { user: { select: { id: true, name: true, identity: true } } },
  });
  const choices = await db.mentorshipAssignment.findMany({
    where: { courseId: id },
    include: { mentor: { select: { name: true } } },
  });
  const choiceMap = new Map(choices.map((m) => [m.menteeId, m.mentor.name]));

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
        <div className="mx-auto max-w-[1100px] px-6 py-10 grid gap-8 lg:grid-cols-5">
          {/* Mentor pool */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-oxblood" />
              <h2 className="text-lg font-semibold">
                Assigned mentors ({mentors.length}/{MENTOR_COURSE_CAP})
              </h2>
            </div>
            <p className="text-sm text-ink-muted -mt-3">
              Mentees pick one of these for {c.code}. A subject takes up to{" "}
              {MENTOR_COURSE_CAP} mentors, and capacity caps how many mentees each
              mentor accepts, keeping the ratio balanced.
            </p>

            {error === "mentor-cap" ? (
              <div className="rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
                This subject already has the maximum of {MENTOR_COURSE_CAP}{" "}
                mentors. Remove one before adding another.
              </div>
            ) : null}

            {mentors.length === 0 ? (
              <div className="card p-6 text-sm text-ink-muted">
                No mentors assigned yet. Add one below so mentees can choose.
              </div>
            ) : (
              <div className="space-y-3">
                {mentors.map((m) => (
                  <div key={m.mentorId} className="card p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {m.taken}/{m.capacity} mentees
                          {m.cgpa != null ? ` , CGPA ${m.cgpa.toFixed(2)}` : ""}
                          {m.rating != null ? ` , rating ${m.rating.toFixed(1)}` : ""}
                          {m.full ? " , full" : ` , ${m.remaining} slots left`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <form action={setMentorCapacity} className="flex items-center gap-1.5">
                          <input type="hidden" name="courseId" value={c.id} />
                          <input type="hidden" name="mentorId" value={m.mentorId} />
                          <label className="text-xs text-ink-muted">Cap</label>
                          <input
                            type="number"
                            name="capacity"
                            min={Math.max(1, m.taken)}
                            defaultValue={m.capacity}
                            className="input py-1 w-16 text-sm"
                          />
                          <button type="submit" className="btn btn-ghost btn-sm">Save</button>
                        </form>
                        <form action={removeMentorFromCourse}>
                          <input type="hidden" name="courseId" value={c.id} />
                          <input type="hidden" name="mentorId" value={m.mentorId} />
                          <button
                            type="submit"
                            className="btn btn-ghost btn-sm text-oxblood hover:text-oxblood-deep"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assign new mentor */}
            <form action={assignMentorToCourse} className="card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-oxblood" />
                <h3 className="font-medium">Assign a mentor</h3>
              </div>
              <input type="hidden" name="courseId" value={c.id} />
              {poolFull ? (
                <p className="text-sm text-ink-muted">
                  Mentor pool is full ({MENTOR_COURSE_CAP} max). Remove a mentor
                  before adding another.
                </p>
              ) : eligible.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No eligible mentors left. A mentor must have passed {c.code}
                  {" "}(their semester above {c.semester}) and not already be in the pool.
                </p>
              ) : (
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-12 sm:col-span-7">
                    <label className="block text-sm font-medium mb-1.5">Mentor</label>
                    <select name="mentorId" className="input" required>
                      {eligible.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (sem {m.semester}{m.cgpa != null ? `, CGPA ${m.cgpa.toFixed(2)}` : ""})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium mb-1.5">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      min={1}
                      defaultValue={MENTOR_MENTEE_CAP}
                      className="input"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <button type="submit" className="btn btn-primary w-full">Assign</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Mentee roster */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Mentees ({menteeEnrolments.length})</h2>
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-dark/50 text-xs text-ink-muted">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 font-semibold">Mentee</th>
                    <th className="px-4 py-2.5 font-semibold">Mentor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {menteeEnrolments.map((e) => {
                    const chosen = choiceMap.get(e.user.id);
                    return (
                      <tr key={e.user.id}>
                        <td className="px-4 py-2.5">
                          <div className="font-medium">{e.user.name}</div>
                          <div className="text-xs text-ink-muted tabular">{e.user.identity}</div>
                        </td>
                        <td className="px-4 py-2.5">
                          {chosen ? (
                            <span className="badge badge-fern">{chosen}</span>
                          ) : (
                            <span className="badge badge-muted">Pending pick</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {menteeEnrolments.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-4 text-ink-muted text-center">
                        No mentees enrolled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
