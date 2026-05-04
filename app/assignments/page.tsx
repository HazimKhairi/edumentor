import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ASSIGNMENTS } from "@/lib/data";

export const metadata = {
  title: "Assignments | EduMentor",
  description: "Submissions, due dates, and graded work.",
};

const statusBadge: Record<string, string> = {
  Open: "badge badge-fern",
  "Closing soon": "badge badge-saffron",
  Closed: "badge badge-muted",
};

const TABS = [
  { label: "Open", count: 3 },
  { label: "Submitted", count: 2 },
  { label: "Graded", count: 5 },
  { label: "All", count: 10 },
];

export default function AssignmentsPage() {
  const open = ASSIGNMENTS.filter((a) => a.status !== "Closed");
  const closed = ASSIGNMENTS.filter((a) => a.status === "Closed");

  return (
    <>
      <SiteNav />

      <section className="bg-bone border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="text-sm text-ink-muted mb-2">
            <span>Home</span> / <span className="text-ink">Assignments</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">My assignments</h1>
          <p className="mt-3 text-ink-soft">
            {open.length} open , {closed.length} closed , Late submissions lose 2 points/day.
          </p>

          <div className="mt-6 flex items-center gap-1 border-b border-rule -mb-px overflow-x-auto">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  i === 0
                    ? "border-oxblood text-oxblood"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-xs text-ink-muted">{t.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-10 space-y-4">
          {open.map((a) => {
            const pct = Math.round((a.submissions / a.of) * 100);
            return (
              <article key={a.id} className="card p-6 grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 md:col-span-1">
                  <span className="badge badge-muted text-[11px]">{a.code}</span>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={statusBadge[a.status]}>{a.status}</span>
                    <span className="text-xs text-ink-muted">{a.course} , {a.type}</span>
                    <span className="badge badge-oxblood">{a.weight}% of grade</span>
                  </div>
                  <h3 className="font-semibold text-lg leading-snug mb-2">{a.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed max-w-xl">{a.note}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <Link href={`/assignments/${a.id}#submit`} className="btn btn-primary btn-sm">
                      Submit work
                    </Link>
                    <Link href={`/assignments/${a.id}`} className="btn btn-ghost btn-sm">
                      View brief
                    </Link>
                    <Link href={`/assignments/${a.id}`} className="text-sm text-oxblood hover:text-oxblood-deep font-medium">
                      Rubric
                    </Link>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 md:text-right">
                  <div className="text-xs text-ink-muted mb-1">Due</div>
                  <div className="display text-2xl">{a.due}</div>
                  <div className="text-xs text-ink-muted mt-2">Issued {a.issued}</div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span>Class submissions</span>
                      <span className="font-semibold text-ink tabular">{a.submissions}/{a.of}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                      <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <h2 className="font-semibold text-lg pt-6 mt-10 border-t border-rule">
            Recently closed
          </h2>
          {closed.map((a) => (
            <article key={a.id} className="card p-5 grid grid-cols-12 gap-4 items-center opacity-80">
              <span className="col-span-2 md:col-span-1 badge badge-muted text-[11px]">{a.code}</span>
              <div className="col-span-10 md:col-span-7">
                <span className={statusBadge[a.status]}>{a.status}</span>
                <h3 className="font-semibold text-base mt-1.5">{a.title}</h3>
                <div className="text-xs text-ink-muted mt-1">{a.course} , Due {a.due}</div>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right">
                <div className="text-sm">
                  <span className="text-ink-muted">Final score:</span>{" "}
                  <span className="font-semibold text-fern">A−</span>
                </div>
                <div className="text-xs text-ink-muted">{a.submissions}/{a.of} submitted</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
