import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { createDiscussionRoom } from "@/lib/actions";

export const metadata = {
  title: "Ask a question | Discussion",
};

export default async function NewDiscussionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  const courses = await db.course.findMany({
    select: { id: true, code: true, title: true },
    orderBy: { semester: "asc" },
  });

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[800px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <Link href="/" className="hover:text-ink">Home</Link>{" / "}
            <Link href="/discussion" className="hover:text-ink">Discussion</Link>{" / "}
            <span className="text-ink">Ask</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Ask a question</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Pick a course, write a clear title, and post your first message.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[800px] px-6 py-10">
          {error === "missing" ? (
            <div className="mb-5 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
              All fields are required.
            </div>
          ) : null}
          <form action={createDiscussionRoom} className="card p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Course</label>
              <select name="courseId" required className="input">
                {courses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}, {c.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                required
                maxLength={140}
                placeholder="Proof by induction on binary trees, where do I start?"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your question</label>
              <textarea
                name="body"
                required
                rows={6}
                placeholder="Describe what you've tried and where you're stuck."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
              <Link href="/discussion" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary">Post question</button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
