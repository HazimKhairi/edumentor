import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { MESSAGES, ROOMS } from "@/lib/data";

export const metadata = {
  title: "Discussion — EduMentor",
  description: "The room: pinned threads and live conversation.",
};

export default function DiscussionPage() {
  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 03</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The room is open.
              <br />Take a chair.
            </p>
            <div className="rule mt-6" />
            <p className="mt-6 text-[14px] leading-relaxed text-ink-soft">
              Discussion threads stay attached to the course they belong
              to. Mentors pin what should not drift; mentees write what
              must be remembered.
            </p>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">room.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[18px] leading-[1.55] text-ink-soft">
              Live now: <span className="eyebrow-italic">Proof by induction, again</span> — fourteen mentees in.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          {/* Rooms list */}
          <aside className="col-span-12 md:col-span-4">
            <RuleLabel numeral="Section A" label="Threads" caption={`${ROOMS.length} active`} />
            <ul className="mt-8 border-t border-ink">
              {ROOMS.map((r) => (
                <li key={r.id} className={`border-b border-rule py-5 ${r.pinned ? "bg-bone -mx-2 px-2" : ""}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="numeral">
                      {r.pinned ? "★ Pinned" : "Open"}
                    </span>
                    <span className="numeral">{r.last}</span>
                  </div>
                  <h3 className="display text-[22px] leading-[1.05] tracking-[-0.02em] mt-2">
                    {r.title}
                  </h3>
                  <div className="numeral mt-1">{r.course}</div>
                  <p className="mt-2 text-[13px] text-ink-soft leading-relaxed">{r.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                    <span>by {r.starter} · {r.role}</span>
                    <span>{r.posts} · {r.members} in</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Active thread */}
          <div className="col-span-12 md:col-span-8 md:border-l md:border-rule md:pl-6">
            <div className="flex items-baseline justify-between">
              <RuleLabel numeral="Live" label="Proof by induction, again" />
              <span className="numeral">14 in · 38 posts</span>
            </div>

            <div className="mt-8 border border-ink bg-bone">
              {/* thread header */}
              <div className="flex items-center justify-between border-b border-rule px-6 py-3 text-[10px] font-mono uppercase tracking-[0.22em]">
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-oxblood blink" />
                  <span>Live · MAT CS110 · Room 01</span>
                </div>
                <span className="text-ink-muted">14:09 GMT+8</span>
              </div>

              <ul className="divide-y divide-rule">
                {MESSAGES.map((m) => (
                  <li key={m.id} className="px-6 py-5 grid grid-cols-12 gap-4">
                    <div className="col-span-2 md:col-span-2">
                      <div className="size-9 border border-ink flex items-center justify-center text-[11px] font-mono uppercase tracking-[0.18em]">
                        {m.author.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="numeral mt-2">{m.time}</div>
                    </div>
                    <div className="col-span-10">
                      <div className="flex items-baseline gap-3">
                        <span className={`text-[13px] font-medium ${m.role === "Mentor" ? "text-oxblood" : ""}`}>
                          {m.author}
                        </span>
                        <span className="numeral">{m.role}</span>
                      </div>
                      <p className="mt-2 text-[15px] leading-[1.55] text-ink">{m.body}</p>
                      <div className="mt-3 flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-muted">
                        <button className="link-reveal">Reply</button>
                        <button className="link-reveal">Quote</button>
                        <button className="link-reveal">Mark useful</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* composer */}
              <div className="border-t-2 border-ink px-6 py-5">
                <div className="numeral mb-3">Compose a reply</div>
                <textarea
                  rows={3}
                  defaultValue="Got it. So the inductive hypothesis is on size n, and we split into two subtrees of strictly smaller size — let me try writing the skeleton."
                  className="w-full bg-paper border border-rule p-4 text-[14px] leading-relaxed outline-none focus:border-ink"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-muted">
                    <button className="link-reveal">Attach</button>
                    <button className="link-reveal">LaTeX</button>
                    <button className="link-reveal">Photo of board</button>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
                  >
                    Send →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
