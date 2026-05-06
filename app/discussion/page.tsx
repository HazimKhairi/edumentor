import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MESSAGES, ROOMS } from "@/lib/data";

export const metadata = {
  title: "Discussion | EduMentor",
  description: "Q&A and discussion rooms for your courses.",
};

const FILTERS = ["All questions", "My questions", "Pinned", "Open", "Resolved"];

export default function DiscussionPage() {
  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Discussion</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Questions & discussion</h1>
          <p className="mt-3 text-ink-soft">
            Ask, answer, and search through the room. Mentors pin what shouldn&apos;t drift.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-12 gap-8">
          <aside className="col-span-12 lg:col-span-4">
            <button className="btn btn-primary w-full mb-6">+ Ask a question</button>

            <h2 className="font-semibold text-base mb-3">Filter</h2>
            <ul className="space-y-1 mb-6">
              {FILTERS.map((f, i) => (
                <li key={f}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm ${
                      i === 0 ? "bg-oxblood/[0.06] text-oxblood font-semibold" : "hover:bg-paper-dark"
                    }`}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="font-semibold text-base mb-3">Rooms</h2>
            <ul className="space-y-2">
              {ROOMS.map((r) => (
                <li key={r.id}>
                  <Link href="#" className="card card-hover p-4 block">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-ink-muted">{r.course}</span>
                      {r.pinned ? <span className="badge badge-saffron">Pinned</span> : null}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug">{r.title}</h3>
                    <p className="text-xs text-ink-muted mt-2 line-clamp-2">{r.excerpt}</p>
                    <div className="text-xs text-ink-muted mt-3 flex items-center justify-between">
                      <span>{r.posts} replies , {r.members} in</span>
                      <span>{r.last}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="col-span-12 lg:col-span-8">
            <div className="card p-6 mb-4 bg-oxblood/[0.04] border-oxblood/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-oxblood">
                  <span className="size-1.5 rounded-full bg-oxblood blink mr-1" /> Live thread
                </span>
                <span className="text-xs text-ink-muted">MAT CS110 , 14 in , 38 replies</span>
              </div>
              <h2 className="display text-2xl mb-2">Proof by induction, again</h2>
              <p className="text-ink-soft">
                Started by Aiman Hakimi , 2 minutes ago , Pinned by Adam (mentor)
              </p>
            </div>

            <ul className="space-y-3">
              {MESSAGES.map((m) => (
                <li key={m.id} className={`card p-5 ${m.role === "Mentor" ? "border-oxblood/30" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                      m.role === "Mentor" ? "bg-oxblood text-bone" : "bg-paper-dark text-ink"
                    }`}>
                      {m.author.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-sm">{m.author}</span>
                        {m.role === "Mentor" ? (
                          <span className="badge badge-oxblood">Mentor</span>
                        ) : (
                          <span className="badge badge-muted">Mentee</span>
                        )}
                        <span className="text-xs text-ink-muted">, {m.time}</span>
                      </div>
                      <p className="text-base leading-relaxed">{m.body}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-ink-muted">
                        <button className="hover:text-ink flex items-center gap-1.5">
                          <ThumbsUp size={14} /> Helpful
                        </button>
                        <button className="hover:text-ink">Reply</button>
                        <button className="hover:text-ink">Share</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="card p-5 mt-6">
              <h3 className="font-semibold text-base mb-3">Your reply</h3>
              <textarea
                rows={4}
                defaultValue="Got it. So the inductive hypothesis is on size n, and we split into two subtrees of strictly smaller size | let me try writing the skeleton."
                className="input"
                style={{ fontFamily: "var(--font-sans)", lineHeight: 1.6 }}
              />
              <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <button className="hover:text-ink">Attach</button>
                  <span>,</span>
                  <button className="hover:text-ink">LaTeX</button>
                  <span>,</span>
                  <button className="hover:text-ink">Photo</button>
                </div>
                <button className="btn btn-primary">Post reply</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
