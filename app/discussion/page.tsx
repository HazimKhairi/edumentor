import Link from "next/link";
import { Plus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { DiscussionFilter } from "@/components/discussion-filter";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { courseIdsForUser, getRoomsView } from "@/lib/queries";

export const metadata = {
  title: "Discussion | EduMentor",
  description: "Q&A and discussion rooms for your courses.",
};

export default async function DiscussionPage() {
  const me = await requireUser();
  // Me3: only rooms for courses I am part of (enrolled mentee, or teaching
  // mentor, or admin sees everything).
  const myCourseIds = await courseIdsForUser(me.id, me.role);
  const myCourseIdSet = new Set(myCourseIds);
  const allRooms = await getRoomsView();
  const rooms = allRooms.filter((r) => myCourseIdSet.has(r.courseId));
  const myCourses = await db.course.findMany({
    where: { id: { in: myCourseIds } },
    select: { code: true },
  });
  const myCourseCodes = myCourses.map((c) => c.code);

  const rowsForClient = rooms.map((r) => ({
    id: r.id,
    title: r.title,
    course: r.course,
    pinned: r.pinned,
    posts: r.posts,
    members: r.members,
    excerpt: r.excerpt,
    last: r.last,
    starterId: r.starterId,
  }));

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Discussion</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Questions and discussion</h1>
              <p className="mt-2 text-sm text-ink-muted">
                Ask, answer, and search through the room. Mentors pin what shouldn&apos;t drift.
              </p>
            </div>
            <Link href="/discussion/new" className="btn btn-primary">
              <Plus size={16} /> Ask a question
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <DiscussionFilter
            rooms={rowsForClient}
            myUserId={me.id}
            myCourseCodes={myCourseCodes}
          />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
