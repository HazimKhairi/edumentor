import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RuleLabel } from "@/components/rule-label";
import { ASSIGNMENTS } from "@/lib/data";

export const metadata = {
  title: "Assignments — EduMentor",
  description: "The folio of work, due and delivered.",
};

const statusTone: Record<string, string> = {
  Open: "bg-bone border border-rule text-ink",
  "Closing soon": "bg-saffron text-ink",
  Closed: "bg-ink text-bone",
};

export default function AssignmentsPage() {
  const open = ASSIGNMENTS.filter((a) => a.status !== "Closed");
  const closed = ASSIGNMENTS.filter((a) => a.status === "Closed");

  const totalWeight = ASSIGNMENTS.reduce((s, a) => s + a.weight, 0);

  return (
    <>
      <SiteNav />

      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-6 pt-12 pb-12">
          <aside className="col-span-12 md:col-span-3 md:border-r md:border-rule md:pr-6">
            <div className="numeral mb-3">№ 04 / Section 04</div>
            <p className="eyebrow-italic text-[18px] leading-snug text-ink">
              The folio of work,
              <br /> due and delivered.
            </p>
            <div className="rule mt-6" />
            <dl className="mt-6 space-y-4 text-xs font-medium uppercase tracking-wide">
              <div className="flex justify-between"><dt className="text-ink-muted">Open</dt><dd>{open.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Closed</dt><dd>{closed.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Weight</dt><dd>{totalWeight}%</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Late tax</dt><dd>−2/day</dd></div>
            </dl>
          </aside>

          <div className="col-span-12 md:col-span-9 md:pl-6">
            <h1 className="display text-[clamp(56px,10vw,160px)] leading-[0.86] tracking-[-0.045em]">
              The{" "}
              <span className="display-italic text-oxblood">work.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Problem sets, labs, and essays. Pick one, read the brief,
              file your submission. Late submissions lose two points per
              day, no exceptions, no negotiations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel numeral="Section A" label="Open assignments" caption={`${open.length} due`} />
          <ul className="mt-10 border-t border-ink">
            {open.map((a, i) => {
              const pct = Math.round((a.submissions / a.of) * 100);
              return (
                <li key={a.id} className="border-b border-rule">
                  <article className="grid grid-cols-12 gap-6 py-8 items-baseline">
                    <div className="col-span-12 md:col-span-1 numeral">№ 0{i + 1}</div>
                    <div className="col-span-12 md:col-span-2">
                      <div className="numeral">{a.code}</div>
                      <div className="numeral mt-1 text-oxblood">{a.weight}% weight</div>
                      <div className="numeral mt-1">{a.type}</div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="numeral">{a.course}</div>
                      <h3 className="display text-[32px] leading-[1.0] tracking-[-0.025em] mt-1">
                        {a.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-soft max-w-xl">
                        {a.note}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link href="#" className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-xs font-medium uppercase tracking-wider text-bone hover:bg-oxblood hover:border-oxblood transition-colors">
                          Submit work →
                        </Link>
                        <Link href="#" className="link-reveal text-xs font-medium uppercase tracking-wider">
                          Read brief
                        </Link>
                        <Link href="#" className="link-reveal text-xs font-medium uppercase tracking-wider">
                          Rubric
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-3 md:text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusTone[a.status]}`}>
                        {a.status}
                      </span>
                      <div className="mt-4 numeral">Due</div>
                      <div className="display text-[36px] leading-none tracking-[-0.03em] mt-1">
                        {a.due.split(" ")[1]}
                        <span className="display-italic text-[20px] text-oxblood ml-1">
                          {a.due.split(" ")[0].toLowerCase()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="numeral text-right">Submission rate</div>
                        <div className="h-[3px] bg-rule mt-2">
                          <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="numeral mt-2 text-right">{a.submissions}/{a.of} · {pct}%</div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <RuleLabel numeral="Section B" label="Recently closed" caption={`${closed.length} on file`} />
          <ul className="mt-10 border-t border-ink">
            {closed.map((a) => (
              <li key={a.id} className="grid grid-cols-12 gap-4 items-baseline border-b border-rule py-5 text-ink-muted">
                <span className="col-span-2 numeral">{a.code}</span>
                <div className="col-span-7">
                  <div className="numeral">{a.course}</div>
                  <div className="display text-[22px] leading-tight mt-1 tracking-[-0.02em] text-ink">
                    {a.title}
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-1 text-xs font-medium uppercase tracking-wider bg-ink text-bone">
                    {a.status}
                  </span>
                  <div className="numeral mt-2">Due {a.due} · {a.submissions}/{a.of}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
