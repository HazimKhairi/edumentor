import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StarRating } from "@/components/star-rating";
import { StarPicker } from "@/components/star-picker";
import { requireUser } from "@/lib/session";
import { coursesForUser, getFeedbackView } from "@/lib/queries";
import { submitFeedback } from "@/lib/actions";
import { RequiredMark } from "@/components/required-mark";

export const metadata = {
  title: "Reviews | EduMentor",
  description: "Mentor evaluations from the cohort.",
};

const errorCopy: Record<string, string> = {
  missing: "Pick a course, a rating, and write a comment.",
  "no-mentor": "That course has no mentor assigned yet.",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const me = await requireUser();
  const { error, submitted } = await searchParams;
  const [enrolled, allFeedback] = await Promise.all([
    coursesForUser(me),
    getFeedbackView(),
  ]);
  const avg = allFeedback.length
    ? allFeedback.reduce((s, f) => s + f.score, 0) / allFeedback.length
    : 0;
  const totalResponses = allFeedback.reduce((s, f) => s + f.n, 0);

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Reviews</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Mentor reviews</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Review a mentor for a course you are enrolled in. Anonymous by default.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className="card p-6 md:p-8">
              <h2 className="font-semibold text-base mb-1">Write a review</h2>
              <p className="text-xs text-ink-muted mb-5">
                Reviews stay anonymous unless you tick the box below.
              </p>

              {submitted ? (
                <div className="mb-5 rounded-md border border-fern/40 bg-fern/10 px-3 py-2 text-sm text-fern">
                  Thanks, your review has been posted.
                </div>
              ) : null}
              {error && errorCopy[error] ? (
                <div className="mb-5 rounded-md border border-oxblood/40 bg-oxblood/[0.06] px-3 py-2 text-sm text-oxblood">
                  {errorCopy[error]}
                </div>
              ) : null}

              {enrolled.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  You are not enrolled in any course yet.{" "}
                  <Link href="/courses" className="text-oxblood font-semibold">
                    Browse the catalogue
                  </Link>{" "}
                  to start.
                </p>
              ) : (
                <form action={submitFeedback} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Course<RequiredMark />
                    </label>
                    <select name="courseId" required className="input">
                      {enrolled.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}, {c.title}, mentor {c.mentor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Overall rating<RequiredMark />
                    </label>
                    <StarPicker />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Comment<RequiredMark />
                    </label>
                    <textarea
                      name="comment"
                      required
                      rows={4}
                      placeholder="What worked, what could be better."
                      className="input"
                      style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="anonymous"
                      className="size-4 accent-oxblood"
                      defaultChecked
                    />
                    <span>Submit anonymously (recommended)</span>
                  </label>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
                    <Link href="/dashboard" className="btn btn-ghost">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Submit review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div
              className="rounded-md p-6 mb-4"
              style={{ backgroundColor: "var(--color-oxblood)", color: "var(--color-bone)" }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--color-saffron)" }}
              >
                Term average
              </p>
              <div className="text-5xl font-bold">
                {avg.toFixed(1)}
                <span className="text-2xl ml-1" style={{ color: "var(--color-saffron)" }}>
                  / 5
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                {totalResponses} responses across {allFeedback.length} reviews
              </p>
            </div>

            <h3 className="font-semibold text-base mb-3 mt-6">Recent reviews</h3>
            {allFeedback.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No reviews yet. Be the first.
              </p>
            ) : (
              <ul className="space-y-3">
                {allFeedback.map((f) => (
                  <li key={f.id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-ink-muted">{f.course}</span>
                      <StarRating value={f.score} size="xs" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{f.mentor}</h4>
                    <p className="text-sm text-ink-soft leading-relaxed italic">
                      &ldquo;{f.comment}&rdquo;
                    </p>
                    <div className="text-xs text-ink-muted mt-3 pt-3 border-t border-rule">
                      {f.by}, n = {f.n}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
