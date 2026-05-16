"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type AssignmentRow = {
  id: string;
  code: string;
  title: string;
  course: string;
  type: string;
  status: string;
  weight: number;
  submissions: number;
  of: number;
  due: string;
  issued: string;
  note: string;
  mineSubmitted: boolean;
  mineGrade: string | null;
};

type Tab = "Open" | "Submitted" | "Graded" | "All";

const statusBadge: Record<string, string> = {
  Open: "badge badge-fern",
  "Closing soon": "badge badge-saffron",
  Closed: "badge badge-muted",
};

export function AssignmentsTabs({ rows }: { rows: AssignmentRow[] }) {
  const [tab, setTab] = useState<Tab>("Open");

  const counts = useMemo(
    () => ({
      Open: rows.filter((a) => a.status !== "Closed").length,
      Submitted: rows.filter((a) => a.mineSubmitted && !a.mineGrade).length,
      Graded: rows.filter((a) => a.mineGrade).length,
      All: rows.length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    switch (tab) {
      case "Open":
        return rows.filter((a) => a.status !== "Closed");
      case "Submitted":
        return rows.filter((a) => a.mineSubmitted && !a.mineGrade);
      case "Graded":
        return rows.filter((a) => a.mineGrade);
      case "All":
        return rows;
    }
  }, [tab, rows]);

  return (
    <>
      <div className="flex items-center gap-1 border-b border-rule -mb-px overflow-x-auto">
        {(["Open", "Submitted", "Graded", "All"] as Tab[]).map((label) => {
          const isActive = tab === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setTab(label)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-oxblood text-oxblood"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs text-ink-muted tabular">
                {counts[label]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-ink-muted py-8 text-center">
            Nothing in this view yet.
          </p>
        ) : (
          filtered.map((a) => {
            const pct = a.of ? Math.round((a.submissions / a.of) * 100) : 0;
            return (
              <article
                key={a.id}
                className="card p-6 grid grid-cols-12 gap-6 items-start"
              >
                <div className="col-span-12 md:col-span-1">
                  <span className="badge badge-muted text-[11px]">{a.code}</span>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={statusBadge[a.status]}>{a.status}</span>
                    <span className="text-xs text-ink-muted">
                      {a.course}, {a.type}
                    </span>
                    <span className="badge badge-oxblood">{a.weight}% of grade</span>
                    {a.mineSubmitted ? (
                      <span className="badge badge-fern">Submitted</span>
                    ) : null}
                    {a.mineGrade ? (
                      <span className="badge badge-saffron">Grade {a.mineGrade}</span>
                    ) : null}
                  </div>
                  <h3 className="font-semibold text-lg leading-snug mb-2">{a.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
                    {a.note}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/assignments/${a.id}#submit`}
                      className="btn btn-primary btn-sm"
                    >
                      {a.mineSubmitted ? "Update submission" : "Submit work"}
                    </Link>
                    <Link
                      href={`/assignments/${a.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      View brief
                    </Link>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 md:text-right">
                  <div className="text-xs text-ink-muted mb-1">Due</div>
                  <div className="text-2xl font-bold">{a.due}</div>
                  <div className="text-xs text-ink-muted mt-2">
                    Issued {a.issued}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span>Class submissions</span>
                      <span className="font-semibold text-ink tabular">
                        {a.submissions}/{a.of}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden">
                      <div
                        className="h-full bg-oxblood rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
