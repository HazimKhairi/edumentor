import Link from "next/link";
import { ArrowRight, Calendar, ClipboardEdit, Users, Camera } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getAssignmentsView, coursesForUserAsRole } from "@/lib/queries";

export const metadata = {
  title: "Mentor console | EduMentor",
  description: "Mentor console for the mentee cohort.",
};

export default async function MentorLanding() {
  const user = await requireRole(["Mentor", "Admin"]);

  const TILES = [
    {
      href: "/mentor/classes",
      icon: Calendar,
      title: "Classes",
      desc: "Schedule sessions, open the room, mark attendance.",
    },
    {
      href: "/mentor/assignments",
      icon: ClipboardEdit,
      title: "Assignments",
      desc: "Create, edit, and grade work for your cohort.",
    },
    {
      href: "/discussion",
      icon: Users,
      title: "Discussion",
      desc: "Pin threads, answer questions, host office hours.",
    },
    {
      href: "/attendance",
      icon: Camera,
      title: "Attendance",
      desc: "Camera check-in with manual override.",
    },
  ];

  // M2: scope strictly by enrollment-as-Mentor, never by name match.
  const myCourses = await coursesForUserAsRole(user.id, "Mentor");
  const myCourseCodes = myCourses.map((c) => c.code);
  const myAssignments = await getAssignmentsView(myCourseCodes);
  const upcoming = await db.classSession.findMany({
    where: {
      state: "Scheduled",
      course: { code: { in: myCourseCodes } },
    },
  });
  const ratingAgg = await db.feedbackEntry.aggregate({
    where: { mentorId: user.id },
    _avg: { score: true },
    _count: true,
  });
  const myRating = ratingAgg._avg.score;
  const myRatingCount = ratingAgg._count;

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <span className="text-ink">Mentor</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-ink-soft">
            {myCourses.length} courses, {myAssignments.length} assignments, {upcoming.length} upcoming sessions.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Courses I mentor</div>
            <div className="text-3xl font-bold mt-1">{myCourses.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Open assignments</div>
            <div className="text-3xl font-bold mt-1">{myAssignments.filter((a) => a.status !== "Closed").length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Upcoming sessions</div>
            <div className="text-3xl font-bold mt-1">{upcoming.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-ink-muted">Mentor rating</div>
            <div className="text-3xl font-bold mt-1">
              {myRating !== null && myRating !== undefined ? (
                <>
                  {myRating.toFixed(1)}
                  <span className="text-amber-500 ml-1">★</span>
                </>
              ) : (
                <span className="text-ink-muted text-base">No reviews yet</span>
              )}
            </div>
            <div className="text-xs text-ink-muted mt-1">{myRatingCount} reviews</div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-xl font-bold mb-6">Quick actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TILES.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="card card-hover p-6 flex items-start gap-4 group"
                  >
                    <span className="size-12 rounded-md bg-oxblood/10 text-oxblood flex items-center justify-center shrink-0">
                      <Icon size={22} />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1 group-hover:text-oxblood transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-sm text-ink-muted leading-relaxed">{t.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-ink-muted group-hover:text-oxblood mt-1 shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <h2 className="text-xl font-bold mb-6">My courses</h2>
            <ul className="space-y-3">
              {myCourses.map((c) => (
                <li key={c.id} className="card p-4">
                  <div className="text-xs text-ink-muted mb-1">{c.code}</div>
                  <h3 className="font-semibold text-sm leading-snug">{c.title}</h3>
                  <div className="text-xs text-ink-muted mt-2 flex items-center justify-between">
                    <span>{c.enrolled} enrolled</span>
                    <span>{c.pace}</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
