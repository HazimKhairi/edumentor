// Configuration constants for EduMentor. Real data lives in MySQL (Prisma).
// This module only holds enums, brand strings, programme rules, and navigation.

import type { Role as PrismaRole, ClassFormat as PrismaClassFormat } from "@prisma/client";

export type Role = PrismaRole;
export type ClassFormat = PrismaClassFormat;

export const SUBJECT = {
  code: "MAT CS110",
  title: "Discrete Structures for Computing",
  faculty: "Faculty of Computer & Mathematical Sciences",
  semester: "Semester 02 / 2026",
};

// B.Sc. (Hons) Computer Science is a 6-semester programme at FCMS.
export const SEMESTERS = [1, 2, 3, 4, 5, 6] as const;
export type Semester = (typeof SEMESTERS)[number];

// A mentor cannot mentor more than this many subjects at once.
export const MENTOR_SUBJECT_CAP = 3;
// Mentors must hold this CGPA or above.
export const MENTOR_MIN_CGPA = 3.2;

export const ROLES: {
  key: Role;
  abbr: string;
  oneLiner: string;
  duties: string[];
}[] = [
  {
    key: "Admin",
    abbr: "ADM",
    oneLiner: "Lecturer steward of the academic record.",
    duties: [
      "Manage course catalogue",
      "Govern student and mentor accounts",
      "Add evaluation rubrics",
      "Issue performance reports",
    ],
  },
  {
    key: "Mentor",
    abbr: "MNT",
    oneLiner: "Student leading the mentee cohort for subjects already passed.",
    duties: [
      "Run peer-led classes and study rooms",
      "Issue and review assignments",
      "Tick attendance with face recognition",
      "Publish reading and feedback",
    ],
  },
  {
    key: "Mentee",
    abbr: "MNE",
    oneLiner: "Student keeping a personal study log under a peer mentor.",
    duties: [
      "Enroll in courses",
      "Submit assignments and reflections",
      "Join discussions and live sessions",
      "Evaluate the mentor at term end",
    ],
  },
];

export const NAV = [
  { href: "/dashboard", label: "Desk", numeral: "01" },
  { href: "/courses", label: "Courses", numeral: "02" },
  { href: "/discussion", label: "Discussion", numeral: "03" },
  { href: "/assignments", label: "Assignments", numeral: "04" },
  { href: "/attendance", label: "Attendance", numeral: "05" },
  { href: "/feedback", label: "Feedback", numeral: "06" },
];

// Pure filters: callers pass the candidate list from the DB.
export function coursesForMentee<T extends { semester: number }>(
  semester: Semester,
  courses: T[],
): T[] {
  return courses.filter((c) => c.semester === semester);
}

export function coursesForMentor<T extends { semester: number }>(
  semester: Semester,
  courses: T[],
): T[] {
  return courses.filter((c) => c.semester < semester);
}
