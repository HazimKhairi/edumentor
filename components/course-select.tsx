"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Course picker for the monitoring pages. A dropdown rather than a row of
// pills, so the list stays readable as the catalogue grows. Navigating on
// change keeps the pages themselves server components.
export function CourseSelect({
  courses,
  active,
  basePath,
}: {
  courses: { id: string; code: string; title: string }[];
  active?: string;
  basePath: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(active ?? "");

  if (courses.length === 0) return null;

  return (
    <div className="max-w-sm">
      <label
        htmlFor="monitoring-course"
        className="block text-sm font-medium mb-1.5"
      >
        Course
      </label>
      <select
        id="monitoring-course"
        name="course"
        className="input"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          router.push(next ? `${basePath}?course=${next}` : basePath);
        }}
      >
        <option value="">All courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.code}, {c.title}
          </option>
        ))}
      </select>
    </div>
  );
}
