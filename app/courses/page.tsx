import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { COURSES } from "@/lib/data";

export const metadata = {
  title: "Catalogue — EduMentor",
  description: "The full course catalogue for the term.",
};

const colorMap: Record<string, string> = {
  oxblood: "bg-oxblood text-bone",
  fern: "bg-fern text-bone",
  saffron: "bg-saffron text-ink",
  ink: "bg-ink text-bone",
};

export default function CoursesPage() {
  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 02</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The reading list,
              <br /> bound for the term.
            </p>
            <div className="rule mt-6" />
            <dl className="mt-6 space-y-4 text-xs font-medium uppercase tracking-wide">
              <div className="flex justify-between"><dt className="text-ink-muted">Term</dt><dd>Sem 02 / 26</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Open</dt><dd>{COURSES.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Capacity</dt><dd>220</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Filled</dt><dd>{COURSES.reduce((s, c) => s + c.enrolled, 0)}</dd></div>
            </dl>
          </aside>
          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">catalogue.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Each course is a folio of its own — a mentor, a cohort,
              a syllabus, a pace. Browse by code or by faculty. Enrol
              with a click; un-enrol the same way.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["All", "MAT", "CSC", "STA", "Year 1", "Year 2", "Foundation"].map((f, i) => (
                <button
                  key={f}
                  className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wide border ${i === 0 ? "border-ink bg-ink text-bone" : "border-rule hover:border-ink"} transition-colors`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel numeral="Section A" label="On the shelf" caption={`${COURSES.length} courses`} />
          <ul className="mt-10 border-t border-ink">
            {COURSES.map((c, i) => (
              <li key={c.id} className="border-b border-rule">
                <article className="grid grid-cols-12 gap-6 py-10">
                  <div className="col-span-12 md:col-span-1">
                    <div className="numeral">№ 0{i + 1}</div>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider ${colorMap[c.color]}`}>
                      {c.code}
                    </span>
                    <div className="numeral mt-3">{c.cohort}</div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <h3 className="display text-[44px] leading-[0.95] tracking-[-0.03em]">
                      {c.title}
                    </h3>
                    <p className="mt-3 eyebrow-italic text-[16px] text-ink-soft">
                      Conducted by {c.mentor}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-ink-soft max-w-xl">
                      {c.abstract}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors"
                      >
                        Open course →
                      </Link>
                      <Link
                        href="/discussion"
                        className="link-reveal text-xs font-medium uppercase tracking-wider"
                      >
                        Discussion
                      </Link>
                      <Link
                        href="/assignments"
                        className="link-reveal text-xs font-medium uppercase tracking-wider"
                      >
                        Assignments
                      </Link>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-3 md:border-l md:border-rule md:pl-6 grid grid-cols-2 gap-y-5">
                    <div>
                      <div className="numeral">Pace</div>
                      <div className="text-[14px] mt-1">{c.pace}</div>
                    </div>
                    <div>
                      <div className="numeral">Sessions</div>
                      <div className="text-[14px] mt-1">{c.sessions}</div>
                    </div>
                    <div>
                      <div className="numeral">Enrolled</div>
                      <div className="text-[14px] mt-1">{c.enrolled} / {c.capacity}</div>
                    </div>
                    <div>
                      <div className="numeral">Progress</div>
                      <div className="text-[14px] mt-1">{c.progress}%</div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-[2px] bg-rule">
                        <div className="h-full bg-ink" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
