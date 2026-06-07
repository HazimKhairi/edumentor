import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, GraduationCap, ShieldAlert, Trash2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import {
  attendanceForUser,
  attendanceRate,
  coursesForUser,
  getAssignmentsView,
} from "@/lib/queries";

export async function generateStaticParams() {
  const rows = await db.user.findMany({ select: { id: true } });
  return rows.map((u) => ({ id: u.id }));
}

const roleBadge: Record<string, string> = {
  Admin: "badge badge-oxblood",
  Mentor: "badge badge-saffron",
  Mentee: "badge badge-fern",
};

const statusBadge: Record<string, string> = {
  Active: "badge badge-fern",
  Probation: "badge badge-saffron",
  Suspended: "badge badge-oxblood",
};

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("Admin");
  const { id } = await params;
  const u = await db.user.findUnique({ where: { id } });
  if (!u) notFound();

  const enrolled = await coursesForUser(u);
  const isStudent = u.role === "Mentee" || u.role === "Mentor";
  const rate = isStudent ? await attendanceRate(u.id) : null;
  const trail = isStudent ? await attendanceForUser(u.id) : [];
  const enrolledCodes = enrolled.map((c) => c.code);
  const courseAssignments = enrolledCodes.length
    ? await getAssignmentsView(enrolledCodes)
    : [];

  return (
    <>
      <SiteNav />

      <section>
        <div className="mx-auto max-w-[1000px] px-6 pt-8 pb-4">
          <div className="text-xs text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/admin" className="hover:text-ink">Admin</Link>{" / "}
            <Link href="/admin/users" className="hover:text-ink">Users</Link>{" / "}
            <span className="text-ink">{u.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-full bg-paper-dark text-ink-muted flex items-center justify-center text-base font-semibold shrink-0">
                {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{u.name}</h1>
                <p className="text-sm text-ink-muted mt-0.5 tabular">{u.identity}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={roleBadge[u.role]}>{u.role}</span>
                  <span className={statusBadge[u.status]}>{u.status}</span>
                  {u.semester ? (
                    <span className="text-xs text-ink-muted">Semester {u.semester}</span>
                  ) : null}
                  {typeof u.cgpa === "number" ? (
                    <span className="text-xs text-ink-muted tabular">CGPA {u.cgpa.toFixed(2)}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users/${u.id}/delete`}
                className="btn btn-ghost btn-sm"
                aria-label="Delete user"
              >
                <Trash2 size={14} /> Delete
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1000px] px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="text-xs text-ink-muted">Courses</div>
            <div className="text-2xl font-bold mt-1 tabular">{enrolled.length}</div>
            <div className="text-xs text-ink-muted mt-1">
              {u.role === "Mentor" ? "subjects mentored" : "this term"}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted">Verified attendance</div>
            <div className="text-2xl font-bold mt-1 tabular">
              {rate === null ? "n/a" : `${rate}%`}
            </div>
            <div className="text-xs text-ink-muted mt-1">
              {rate === null ? "not a student account" : "across closed sessions"}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted">CGPA</div>
            <div className="text-2xl font-bold mt-1 tabular">
              {typeof u.cgpa === "number" ? u.cgpa.toFixed(2) : "n/a"}
            </div>
            <div className="text-xs text-ink-muted mt-1">cumulative</div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1000px] px-6 pb-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-ink-muted" />
              <h2 className="font-semibold text-sm">
                {u.role === "Mentor" ? "Subjects mentored" : "Courses enrolled"}
              </h2>
            </div>
            {enrolled.length === 0 ? (
              <p className="text-sm text-ink-muted">None.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolled.map((c) => (
                  <CourseCard
                    key={c.id}
                    id={c.id}
                    code={c.code}
                    title={c.title}
                    mentor={c.mentor}
                    color={c.color as never}
                    progress={c.progress}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {isStudent && trail.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap size={16} className="text-ink-muted" />
                <h2 className="font-semibold text-sm">Attendance trail</h2>
              </div>
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {trail.map((r) => {
                  const fully = r.menteeConfirmed && r.mentorVerified;
                  return (
                    <li key={r.sessionId} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {r.session.courseId}
                        </div>
                        <div className="text-xs text-ink-muted tabular">
                          {r.session.date.toISOString().slice(0, 10)} {r.session.time}, {r.session.room}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={
                            r.menteeConfirmed ? "badge badge-fern" : "badge badge-muted"
                          }
                          title="Mentee confirmed via face recognition"
                        >
                          Mentee {r.menteeConfirmed ? "OK" : "no"}
                        </span>
                        <span
                          className={
                            r.mentorVerified ? "badge badge-fern" : "badge badge-saffron"
                          }
                          title="Mentor verified on roster"
                        >
                          Mentor {r.mentorVerified ? "OK" : "pending"}
                        </span>
                        <span
                          className={
                            fully ? "badge badge-oxblood" : "badge badge-muted"
                          }
                        >
                          {fully ? "Counted" : "Incomplete"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {courseAssignments.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={16} className="text-ink-muted" />
                <h2 className="font-semibold text-sm">Coursework load</h2>
              </div>
              <ul className="card p-0 overflow-hidden divide-y divide-rule">
                {courseAssignments.map((a) => (
                  <li key={a.id} className="px-4 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-ink-muted tabular">{a.code}, {a.course}</div>
                      <div className="text-sm font-medium truncate">{a.title}</div>
                    </div>
                    <span
                      className={
                        a.status === "Closed"
                          ? "badge badge-muted"
                          : a.status === "Closing soon"
                            ? "badge badge-saffron"
                            : "badge badge-fern"
                      }
                    >
                      {a.status}
                    </span>
                    <div className="text-xs text-ink-muted tabular shrink-0 w-20 text-right">
                      Due {a.due}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
