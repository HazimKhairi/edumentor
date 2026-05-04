import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import {
  ASSIGNMENTS,
  ATTENDANCE_SESSIONS,
  COURSES,
  EVENTS,
  MESSAGES,
  ROOMS,
  STATS,
  SUBJECT,
} from "@/lib/data";

export const metadata = {
  title: "The Desk — EduMentor",
  description: "Today on the editor's desk: events, assignments, attendance.",
};

const eventState: Record<string, { tone: string; label: string }> = {
  now: { tone: "bg-oxblood text-bone", label: "Live" },
  soon: { tone: "bg-saffron text-ink", label: "Soon" },
  later: { tone: "bg-bone text-ink border border-rule", label: "Later" },
};

export default function DashboardPage() {
  const liveSession = ATTENDANCE_SESSIONS.find((s) => s.state === "Live");
  const openAssignments = ASSIGNMENTS.filter((a) => a.status !== "Closed");
  const pinnedRooms = ROOMS.filter((r) => r.pinned);

  return (
    <>
      <SiteNav />

      {/* Desk masthead */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-10 pb-8">
          <div className="col-span-12 md:col-span-8">
            <div className="numeral mb-4">
              The desk · Edition 04 May 2026 · Folio 01
            </div>
            <h1 className="display text-[clamp(56px,9vw,140px)] leading-[0.86] tracking-[-0.045em]">
              Good afternoon,
              <br />
              <span className="display-italic text-oxblood">Aiman.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.55] text-ink-soft">
              You are signed in as a mentee on{" "}
              <span className="eyebrow-italic text-ink">{SUBJECT.code}</span>.
              The class is in session, with strong induction on the
              board. Your <span className="eyebrow-italic">PS-04</span>{" "}
              is due in two days.
            </p>
          </div>
          <aside className="col-span-12 md:col-span-4 md:border-l md:border-rule md:pl-6 mt-10 md:mt-0">
            <div className="label mb-3">Your card</div>
            <div className="border border-ink bg-bone p-5">
              <div className="flex items-baseline justify-between">
                <span className="numeral">Mentee · MNE</span>
                <span className="numeral text-oxblood">Active</span>
              </div>
              <div className="display text-[34px] leading-tight tracking-[-0.025em] mt-3">
                Aiman Hakimi
              </div>
              <div className="mt-1 text-[12px] font-mono text-ink-muted">
                2023607832 · B.Sc. CS, Y1
              </div>
              <div className="rule mt-4" />
              <div className="grid grid-cols-3 mt-4 text-[10px] font-mono uppercase tracking-[0.22em]">
                <div>
                  <div className="text-ink-muted">Term GPA</div>
                  <div className="text-ink mt-1 text-[14px] tracking-normal">3.74</div>
                </div>
                <div>
                  <div className="text-ink-muted">Attended</div>
                  <div className="text-ink mt-1 text-[14px] tracking-normal">96%</div>
                </div>
                <div className="text-right">
                  <div className="text-ink-muted">Streak</div>
                  <div className="text-ink mt-1 text-[14px] tracking-normal">14d</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Today panel */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel
            numeral="Section A"
            label="Today on the desk"
            caption={`${EVENTS.length} entries`}
          />
          <div className="mt-10 grid grid-cols-12 gap-6">
            {/* Events column */}
            <div className="col-span-12 md:col-span-7">
              <ul className="border-t border-ink">
                {EVENTS.map((e, i) => {
                  const s = eventState[e.state];
                  return (
                    <li
                      key={i}
                      className="grid grid-cols-12 gap-3 items-baseline border-b border-rule py-5"
                    >
                      <div className="col-span-3 md:col-span-2">
                        <span className="numeral">{e.when}</span>
                      </div>
                      <div className="col-span-9 md:col-span-7">
                        <div className="numeral">{e.course}</div>
                        <div className="display text-[24px] leading-[1.05] tracking-[-0.02em] mt-1">
                          {e.title}
                        </div>
                        <div className="numeral mt-1">{e.place}</div>
                      </div>
                      <div className="col-span-12 md:col-span-3 md:text-right">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] ${s.tone}`}
                        >
                          {e.state === "now" ? (
                            <span className="size-1.5 rounded-full bg-bone blink" />
                          ) : null}
                          {s.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Live class watch */}
            <aside className="col-span-12 md:col-span-5 md:border-l md:border-rule md:pl-6">
              <div className="label mb-4">Live class watch</div>
              {liveSession ? (
                <div className="border border-ink bg-ink text-bone p-6">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-bone/60">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-saffron blink" />
                      Now
                    </span>
                    <span>{liveSession.room}</span>
                  </div>
                  <div className="display mt-4 text-[40px] leading-[0.95] tracking-[-0.03em]">
                    {liveSession.course}
                    <span className="block display-italic text-saffron text-[28px] mt-1">
                      strong induction, trees
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-bone/60">
                    <div>
                      <div>Expected</div>
                      <div className="text-bone text-[20px] mt-1 tracking-normal">{liveSession.expected}</div>
                    </div>
                    <div>
                      <div>Present</div>
                      <div className="text-bone text-[20px] mt-1 tracking-normal">42</div>
                    </div>
                    <div className="text-right">
                      <div>Late</div>
                      <div className="text-bone text-[20px] mt-1 tracking-normal">3</div>
                    </div>
                  </div>
                  <div className="rule mt-6 bg-bone/20" />
                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href="/attendance"
                      className="inline-flex items-center gap-2 border border-bone bg-bone px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-ink hover:bg-saffron hover:border-saffron transition-colors"
                    >
                      Join the room →
                    </Link>
                    <Link
                      href="/discussion"
                      className="inline-flex items-center gap-2 border border-bone/40 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] hover:border-bone transition-colors"
                    >
                      Open chat
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Stats strip */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {STATS.slice(0, 4).map((s) => (
                  <div
                    key={s.label}
                    className="border border-rule bg-bone p-4"
                  >
                    <div className="label">{s.label}</div>
                    <div className="display text-[36px] leading-none mt-2 tracking-[-0.03em]">
                      {s.value}
                    </div>
                    <div className="text-[11px] text-ink-muted mt-1">{s.caption}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Assignments + Discussion */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <RuleLabel
              numeral="Section B"
              label="Assignments due"
              caption={`${openAssignments.length} open`}
            />
            <ul className="mt-8 border-t border-ink">
              {openAssignments.map((a) => {
                const pct = Math.round((a.submissions / a.of) * 100);
                return (
                  <li
                    key={a.id}
                    className="border-b border-rule py-6 grid grid-cols-12 gap-3 items-baseline"
                  >
                    <div className="col-span-2">
                      <div className="numeral">{a.code}</div>
                      <div className="numeral mt-1">{a.weight}%</div>
                    </div>
                    <div className="col-span-7">
                      <div className="numeral">{a.course} · {a.type}</div>
                      <div className="display text-[24px] leading-[1.05] tracking-[-0.02em] mt-1">
                        {a.title}
                      </div>
                      <p className="text-[13px] text-ink-soft mt-2 max-w-md leading-relaxed">
                        {a.note}
                      </p>
                    </div>
                    <div className="col-span-3 text-right">
                      <div className="numeral">Due</div>
                      <div className="display text-[28px] leading-none tracking-[-0.02em] mt-1">
                        {a.due.split(" ")[1]}
                        <span className="display-italic text-[18px] text-oxblood ml-1">
                          {a.due.split(" ")[0].toLowerCase()}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="h-[3px] bg-rule">
                          <div
                            className="h-full bg-ink"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="numeral mt-2">
                          {a.submissions}/{a.of} submitted
                        </div>
                      </div>
                      <div className="numeral mt-2">
                        <span className={a.status === "Closing soon" ? "text-oxblood" : ""}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <Link
                href="/assignments"
                className="link-reveal text-[12px] font-mono uppercase tracking-[0.22em]"
              >
                Open the assignments folio →
              </Link>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-5 md:border-l md:border-rule md:pl-6">
            <RuleLabel numeral="Section C" label="On the floor" caption="Discussion" />
            <ul className="mt-8 space-y-1 border-t border-ink">
              {pinnedRooms.map((r) => (
                <li key={r.id} className="border-b border-rule py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="numeral">{r.course} · pinned</span>
                    <span className="numeral">{r.last}</span>
                  </div>
                  <div className="display text-[22px] leading-tight tracking-[-0.02em] mt-1">
                    {r.title}
                  </div>
                  <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{r.excerpt}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-ink-muted">
                    <span>by {r.starter} · {r.role}</span>
                    <span>{r.posts} posts · {r.members} in</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-ink bg-bone p-5">
              <div className="numeral">Latest from the room</div>
              <ul className="mt-4 space-y-3">
                {MESSAGES.slice(-3).map((m) => (
                  <li key={m.id} className="grid grid-cols-12 gap-3 items-baseline">
                    <span className="col-span-2 numeral">{m.time}</span>
                    <div className="col-span-10">
                      <div className="text-[12px] font-mono uppercase tracking-[0.18em]">
                        <span className={m.role === "Mentor" ? "text-oxblood" : ""}>
                          {m.author}
                        </span>
                      </div>
                      <p className="text-[14px] leading-snug mt-1">{m.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/discussion"
                className="inline-flex mt-4 items-center gap-2 link-reveal text-[11px] font-mono uppercase tracking-[0.22em]"
              >
                Read the room →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* My courses */}
      <section className="border-b border-rule bg-paper-dark/40">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <RuleLabel
            numeral="Section D"
            label="Enrolled courses"
            caption={`${COURSES.length} on the shelf`}
          />
          <div className="mt-10 grid grid-cols-12 gap-6">
            {COURSES.map((c, i) => (
              <article key={c.id} className="col-span-12 md:col-span-6 lg:col-span-3 deck p-6 flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="numeral">№ 0{i + 1}</span>
                  <span className="numeral text-oxblood">{c.code}</span>
                </div>
                <h3 className="display mt-4 text-[26px] leading-[1.05] tracking-[-0.025em]">
                  {c.title}
                </h3>
                <p className="text-[12px] text-ink-muted mt-1 eyebrow-italic">
                  {c.mentor}
                </p>
                <p className="text-[13px] text-ink-soft mt-4 leading-relaxed flex-1">
                  {c.abstract}
                </p>
                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="numeral">Progress</span>
                    <span className="numeral">{c.progress}%</span>
                  </div>
                  <div className="h-[2px] bg-rule mt-2">
                    <div className="h-full bg-ink" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-ink-muted">
                  <span>{c.pace}</span>
                  <span>{c.enrolled}/{c.capacity}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer rail — quick actions */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12 grid grid-cols-12 gap-3">
          {[
            { href: "/discussion", n: "01", t: "Open discussion", b: "Read the room and reply." },
            { href: "/assignments", n: "02", t: "Submit work", b: "Drop your PS-04 here." },
            { href: "/attendance", n: "03", t: "Mark attendance", b: "Confirm your face for today." },
            { href: "/feedback", n: "04", t: "Leave feedback", b: "End-of-term mentor review." },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="col-span-12 md:col-span-3 group block border border-rule bg-bone p-6 hover:border-ink transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <span className="numeral">{q.n}</span>
                <span className="numeral group-hover:text-oxblood transition-colors">→</span>
              </div>
              <div className="display text-[26px] leading-tight tracking-[-0.025em] mt-3">
                {q.t}
              </div>
              <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{q.b}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
