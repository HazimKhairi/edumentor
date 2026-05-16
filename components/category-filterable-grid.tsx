"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";

type CourseTile = {
  id: string;
  code: string;
  title: string;
  mentor: string;
  cohort: string;
  pace: string;
  color: string;
  rating?: number;
  reviews?: number;
};

type Category = "All" | "Computer Science" | "Mathematics" | "Statistics" | "Foundation";

const CATEGORIES: Category[] = [
  "All",
  "Computer Science",
  "Mathematics",
  "Statistics",
  "Foundation",
];

function bucket(code: string): Category {
  // CSC* or anything containing "CS" → Computer Science (catches MAT CS110)
  if (/\bCSC|\bCS\d|\bCS\s|\bCS\b/i.test(code)) return "Computer Science";
  if (code.startsWith("MAT")) return "Mathematics";
  if (code.startsWith("STA")) return "Statistics";
  return "Foundation";
}

export function CategoryFilterableGrid({ courses }: { courses: CourseTile[] }) {
  const [active, setActive] = useState<Category>("All");

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      All: courses.length,
      "Computer Science": 0,
      Mathematics: 0,
      Statistics: 0,
      Foundation: 0,
    };
    for (const course of courses) c[bucket(course.code)] += 1;
    return c;
  }, [courses]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? courses
        : courses.filter((c) => bucket(c.code) === active),
    [active, courses],
  );

  return (
    <>
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((label) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-ink text-bone"
                  : "bg-bone text-ink-soft border border-rule hover:border-ink"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-60 tabular">{counts[label]}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted py-8 text-center">
          No courses in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <CourseCard
              key={c.id}
              id={c.id}
              code={c.code}
              title={c.title}
              mentor={c.mentor}
              cohort={c.cohort}
              pace={c.pace}
              color={c.color as never}
              rating={c.rating}
              reviews={c.reviews}
            />
          ))}
        </div>
      )}
    </>
  );
}
