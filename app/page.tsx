import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Marquee } from "@/components/marquee";
import { RuleLabel } from "@/components/rule-label";
import { COURSES, ROLES, STATS, SUBJECT } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <SiteNav />

      {/* MASTHEAD HERO */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-10">
          {/* Left rail: dateline + lede */}
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Vol. I</div>
            <p className="text-base leading-relaxed text-ink-soft">
              <span className="eyebrow-italic text-ink">A new term opens</span>
              {" "}— and with it, a quiet experiment. Every classroom becomes
              a desk. Every desk becomes a column. Every mentor, an editor.
            </p>
            <div className="rule mt-6" />
            <dl className="mt-6 space-y-4 text-xs font-medium uppercase tracking-wide">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subject</dt>
                <dd>{SUBJECT.code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Faculty</dt>
                <dd className="text-right normal-case tracking-normal text-[11px]">UiTM, FCMS</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Section</dt>
                <dd>The Desk</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Edition</dt>
                <dd>04 May 26</dd>
              </div>
            </dl>
          </aside>

          {/* Center: BIG headline */}
          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(64px,11vw,180px)] leading-[0.86] tracking-[-0.045em]">
              The mentor,
              <br />
              the mentee, the{" "}
              <span className="display-italic text-oxblood">
                margin
              </span>{" "}
              between.
            </h1>

            <div className="mt-10 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-7">
                <p className="text-xl leading-relaxed text-ink-soft max-w-2xl">
                  EduMentor is a periodical for the classroom, set in serif.
                  It collects discussion, attendance, assignments, and
                  feedback inside a single quiet folio — so a mentor can
                  conduct, a mentee can author, and an admin can keep the
                  record straight.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
                  >
                    Open the desk
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-3 border border-ink px-5 py-3 text-xs font-medium uppercase tracking-wider hover:bg-ink hover:text-bone transition-colors"
                  >
                    Read the catalogue
                  </Link>
                  <span className="ml-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    No paywall · Demo classroom
                  </span>
                </div>
              </div>

              <aside className="col-span-12 md:col-span-5 border-l border-rule md:pl-6">
                <div className="label mb-3">From the mentors&apos; desk</div>
                <blockquote className="text-lg leading-relaxed">
                  <span className="display-italic text-oxblood">“</span>
                  Strong induction over the size of the tree is what you
                  want. I will write the skeleton on the board.
                  <span className="display-italic text-oxblood">”</span>
                </blockquote>
                <div className="mt-3 numeral">
                  Dr. Aishah Mokhtar — MAT CS110, lecture five
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-b border-rule bg-ink text-bone">
        <Marquee
          className="py-4 text-[20px] display tracking-[-0.02em]"
          items={[
            "Discussion",
            "Assignments",
            "Attendance, by face",
            "Reading log",
            "Mentor feedback",
            "Live class",
            "Periodical reports",
            "Reflections",
          ]}
          separator="—"
        />
      </section>

      {/* STATS BAND */}
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4 px-6 py-12 gap-y-10">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 ${i !== 0 ? "md:border-l md:border-rule" : ""}`}
            >
              <div className="label">{stat.label}</div>
              <div className="display mt-3 text-[64px] leading-none tracking-[-0.04em]">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-ink-muted">{stat.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <RuleLabel numeral="Section A" label="The manifesto" caption="three paragraphs" />
          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 md:col-span-4">
              <div className="numeral">¶ 01 — On reading</div>
              <p className="mt-4 text-lg leading-relaxed first-letter:display first-letter:float-left first-letter:mr-2 first-letter:text-[64px] first-letter:leading-[0.85] first-letter:text-oxblood">
                A classroom is a periodical that publishes itself. The
                mentor is the editor, the mentees are the columnists, and
                the syllabus is the broadsheet they keep returning to.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="numeral">¶ 02 — On marking</div>
              <p className="mt-4 text-lg leading-relaxed">
                Attendance ticks itself with face recognition, but the
                meaningful mark is the one you leave in the margin. We
                made the margin a feature, not a footnote — it&apos;s where
                the work lives.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="numeral">¶ 03 — On evaluation</div>
              <p className="mt-4 text-lg leading-relaxed">
                At term&apos;s end the mentee evaluates the mentor, not the
                other way around. A teacher who survives criticism with
                grace is one worth keeping on the masthead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES — three cards */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <RuleLabel
            numeral="Section B"
            label="Three roles, one folio"
            caption="A · M · S"
          />
          <div className="mt-12 grid grid-cols-12 gap-6">
            {ROLES.map((role, idx) => (
              <article
                key={role.key}
                className="deck col-span-12 md:col-span-4 p-8"
              >
                <div className="flex items-baseline justify-between">
                  <span className="numeral">№ 0{idx + 1}</span>
                  <span className="numeral text-oxblood">{role.abbr}</span>
                </div>
                <h3 className="display mt-6 text-[56px] leading-[0.9] tracking-[-0.04em]">
                  {role.key === "Mentee" ? (
                    <>The <span className="display-italic">mentee</span></>
                  ) : role.key === "Mentor" ? (
                    <>The <span className="display-italic">mentor</span></>
                  ) : (
                    <>The <span className="display-italic">admin</span></>
                  )}
                </h3>
                <p className="mt-4 eyebrow-italic text-[18px] text-ink-soft">
                  {role.oneLiner}
                </p>
                <ul className="mt-6 divide-y divide-rule border-y border-rule">
                  {role.duties.map((d, i) => (
                    <li
                      key={d}
                      className="flex items-baseline gap-4 py-3 text-[14px]"
                    >
                      <span className="numeral shrink-0 w-6">0{i + 1}</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 link-reveal text-xs font-medium uppercase tracking-wider"
                >
                  Sign in as {role.key.toLowerCase()} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COURSE CATALOGUE TEASER */}
      <section className="border-b border-rule bg-paper-dark/60">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <RuleLabel
            numeral="Section C"
            label="Catalogue, this term"
            caption={`${COURSES.length} courses on file`}
          />
          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 md:col-span-5">
              <h2 className="display text-[88px] leading-[0.86] tracking-[-0.04em]">
                A reading list,
                <br />
                <span className="display-italic text-oxblood">
                  bound by mentors.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
                Each course in EduMentor is conducted by a single mentor
                across a fixed cohort. The pace is published, the rubrics
                are open, the discussion lives where the work is being
                done.
              </p>
              <Link
                href="/courses"
                className="mt-8 inline-flex items-center gap-3 border border-ink px-5 py-3 text-xs font-medium uppercase tracking-wider hover:bg-ink hover:text-bone transition-colors"
              >
                Read the full catalogue →
              </Link>
            </div>

            <div className="col-span-12 md:col-span-7">
              <ul className="border-t border-ink">
                {COURSES.map((c, i) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-12 items-baseline gap-4 border-b border-rule py-6"
                  >
                    <span className="col-span-1 numeral">0{i + 1}</span>
                    <div className="col-span-3">
                      <div className="numeral">{c.code}</div>
                      <div className="text-xs text-ink-muted mt-1">{c.cohort}</div>
                    </div>
                    <div className="col-span-5">
                      <div className="display text-[28px] leading-[0.95] tracking-[-0.025em]">
                        {c.title}
                      </div>
                      <div className="text-sm text-ink-muted mt-1 eyebrow-italic">
                        Conducted by {c.mentor}
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <div className="numeral">Pace</div>
                      <div className="text-[13px] mt-1">{c.pace}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-28">
          <div className="grid grid-cols-12 gap-6">
            <div className="hidden md:block md:col-span-2">
              <div className="numeral">Margin note</div>
              <div className="rule mt-3" />
            </div>
            <blockquote className="col-span-12 md:col-span-9 display text-[clamp(40px,6.5vw,96px)] leading-[0.95] tracking-[-0.03em]">
              <span className="display-italic text-oxblood">“</span>
              The aim of a good classroom is to make criticism feel like
              <span className="display-italic"> kindness</span>, and
              kindness feel like
              <span className="display-italic"> rigour</span>.
              <span className="display-italic text-oxblood">”</span>
            </blockquote>
          </div>
          <div className="mt-10 numeral text-right">
            — Editor&apos;s preface, EduMentor 04
          </div>
        </div>
      </section>

      {/* FACE-RECOG ATTENDANCE FEATURE */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <RuleLabel numeral="Section D" label="Attendance, automated" />
            <h2 className="display mt-8 text-[72px] leading-[0.9] tracking-[-0.04em]">
              The roll is called
              <br />
              by the <span className="display-italic text-oxblood">camera.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft max-w-md">
              Open the live class, point the camera, watch the matric
              numbers tick. Mentors override; mentees confirm. A history
              of every session is kept in the back of the folio for
              admins to audit.
            </p>
            <ul className="mt-8 space-y-3 text-[14px]">
              <li className="flex items-baseline gap-3">
                <span className="numeral shrink-0">A</span>
                <span>Recognises a cohort of 60 in under five seconds.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="numeral shrink-0">B</span>
                <span>Manual override for late or excused students.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="numeral shrink-0">C</span>
                <span>Audit trail per session, exportable on demand.</span>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-7 md:pl-6">
            <div className="relative aspect-[5/4] border border-ink bg-bone overflow-hidden">
              {/* mock classroom viewfinder */}
              <div className="absolute inset-0 hatched opacity-[0.06]" />
              <div className="absolute inset-6 border border-ink/30">
                {/* face boxes */}
                {[
                  { x: 8, y: 14, w: 22, h: 28, name: "Aiman H.", id: "2023607832" },
                  { x: 38, y: 12, w: 22, h: 30, name: "Nur Sofea", id: "2023608112" },
                  { x: 70, y: 18, w: 20, h: 26, name: "Faris A.", id: "2023611901" },
                  { x: 12, y: 56, w: 22, h: 28, name: "Liyana A.", id: "2023612200" },
                  { x: 44, y: 60, w: 22, h: 28, name: "Hafiz R.", id: "2023612555" },
                  { x: 72, y: 58, w: 20, h: 26, name: "Iman Y.", id: "2023612823" },
                ].map((b) => (
                  <div
                    key={b.id}
                    className="absolute border border-oxblood"
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      width: `${b.w}%`,
                      height: `${b.h}%`,
                    }}
                  >
                    <div className="absolute -top-5 left-0 right-0 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-oxblood">
                      <span>{b.name}</span>
                      <span>OK</span>
                    </div>
                    <div className="absolute -bottom-4 left-0 text-xs font-medium text-ink-muted">
                      {b.id}
                    </div>
                    {/* corner ticks */}
                    <span className="absolute -left-1 -top-1 size-2 border-l border-t border-oxblood" />
                    <span className="absolute -right-1 -top-1 size-2 border-r border-t border-oxblood" />
                    <span className="absolute -left-1 -bottom-1 size-2 border-l border-b border-oxblood" />
                    <span className="absolute -right-1 -bottom-1 size-2 border-r border-b border-oxblood" />
                  </div>
                ))}
              </div>
              {/* viewfinder HUD */}
              <div className="absolute top-3 left-4 text-xs font-medium uppercase tracking-wider text-ink-muted flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-oxblood blink" />
                Recognising · 6 / 8 matched
              </div>
              <div className="absolute bottom-3 right-4 text-xs font-medium uppercase tracking-wider text-ink-muted">
                BD-3, Block A · 14:02
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — closing */}
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-[1400px] px-6 py-28 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="label text-bone/60">Closing argument</div>
            <h2 className="display mt-6 text-[clamp(56px,9vw,140px)] leading-[0.86] tracking-[-0.04em]">
              Take a seat
              <br />
              at the{" "}
              <span className="display-italic text-saffron">desk.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone/80">
              EduMentor is free to enrol for the demo cohort. Pick a
              role, claim a name, and start a discussion thread before
              the bell rings.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 border border-bone bg-bone px-5 py-3 text-xs font-medium uppercase tracking-wider text-ink hover:bg-saffron hover:border-saffron transition-colors"
              >
                Sign in →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 border border-bone/40 px-5 py-3 text-xs font-medium uppercase tracking-wider hover:border-bone transition-colors"
              >
                Apply as mentor
              </Link>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 md:border-l md:border-bone/20 md:pl-6">
            <div className="label text-bone/60">Numbers, briefly</div>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-bone/60">Mentees enrolled</dt>
                <dd className="display text-[56px] leading-none mt-2">158</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-bone/60">Mentor satisfaction</dt>
                <dd className="display text-[56px] leading-none mt-2">4.6<span className="text-[28px] text-bone/50">/5</span></dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-bone/60">Attendance accuracy</dt>
                <dd className="display text-[56px] leading-none mt-2">98<span className="text-[28px] text-bone/50">.4%</span></dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
