"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Search, Trash2, Users } from "lucide-react";

export type CourseRow = {
  id: string;
  code: string;
  title: string;
  mentor: string;
  cohort: string;
  enrolled: number;
  capacity: number;
};

// Subject is derived from the course code prefix (MAT133 -> Mathematics).
const SUBJECT_BY_PREFIX: Record<string, string> = {
  MAT: "Mathematics",
  STA: "Statistics",
  CSC: "Computer Science",
  CS: "Computer Science",
  CST: "Computer Science",
};

function subjectOf(code: string): string {
  const m = code.match(/^[A-Za-z]+/);
  const prefix = m ? m[0].toUpperCase() : "";
  return SUBJECT_BY_PREFIX[prefix] ?? "Other";
}

export function CoursesTable({ courses }: { courses: CourseRow[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");

  const subjects = useMemo(() => {
    const set = new Set(courses.map((c) => subjectOf(c.code)));
    return ["All subjects", ...Array.from(set).sort()];
  }, [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q);
      const matchesSubject =
        subject === "All subjects" || subjectOf(c.code) === subject;
      return matchesQuery && matchesSubject;
    });
  }, [courses, query, subject]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <label className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code or title"
            className="input pl-9 py-2"
          />
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input max-w-[180px] py-2 text-sm"
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-dark/50 text-xs text-ink-muted">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Mentor</th>
              <th className="px-4 py-3 font-semibold">Cohort</th>
              <th className="px-4 py-3 font-semibold">Enrolment</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-muted">
                  No courses match your search.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const pct = Math.round((c.enrolled / c.capacity) * 100);
                return (
                  <tr key={c.id} className="hover:bg-paper-dark/30">
                    <td className="px-4 py-3 font-medium tabular">{c.code}</td>
                    <td className="px-4 py-3">
                      <Link href={`/courses/${c.id}`} className="font-medium hover:text-oxblood">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{c.mentor}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.cohort}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="tabular text-xs">{c.enrolled}/{c.capacity}</span>
                        <div className="h-1 w-20 rounded-full bg-paper-dark overflow-hidden">
                          <div className="h-full bg-oxblood rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/courses/${c.id}`}
                          className="size-8 rounded-sm border border-rule hover:border-ink flex items-center justify-center"
                          aria-label={`View roster for ${c.code}`}
                        >
                          <Users size={14} />
                        </Link>
                        <Link
                          href={`/admin/courses/${c.id}/edit`}
                          className="size-8 rounded-sm border border-rule hover:border-ink flex items-center justify-center"
                          aria-label={`Edit ${c.code}`}
                        >
                          <Pencil size={14} />
                        </Link>
                        <Link
                          href={`/admin/courses/${c.id}/delete`}
                          className="size-8 rounded-sm border border-rule hover:border-oxblood hover:bg-oxblood/5 hover:text-oxblood flex items-center justify-center"
                          aria-label={`Delete ${c.code}`}
                        >
                          <Trash2 size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
