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
// Default mentee-slot limit per mentor per course, used when an offering does
// not set its own Enrollment.capacity. Keeps mentor:mentee ratios balanced so
// no single mentor is oversubscribed (SV Syaza's balance concern).
export const MENTOR_MENTEE_CAP = 5;
// A subject may have at most this many mentors assigned to it (SV Syaza: cap
// the mentor pool per subject so it stays manageable).
export const MENTOR_COURSE_CAP = 10;
// A mentor handles at most this many mentees across ALL subjects combined —
// a global ceiling on top of the per-course Enrollment.capacity, so a mentor
// teaching several subjects is never overloaded overall (SV Syaza).
export const MENTOR_GLOBAL_MENTEE_CAP = 5;

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

// Role-aware navigation. Admin gets the admin console links only; mentor + mentee
// share the same student-facing nav but each page filters its own data by role.
// Courses catalogue is hidden from both mentor and mentee — they only see what
// they are enrolled in or teaching.
const NAV_STUDENT = [
  { href: "/dashboard", label: "Desk" },
  { href: "/discussion", label: "Discussion" },
  { href: "/assignments", label: "Assignments" },
  { href: "/attendance", label: "Attendance" },
  { href: "/feedback", label: "Feedback" },
];

const NAV_MENTOR = [
  { href: "/mentor", label: "Mentor console" },
  { href: "/discussion", label: "Discussion" },
  { href: "/mentor/assignments", label: "Assignments" },
  { href: "/mentor/classes", label: "Classes" },
  { href: "/attendance", label: "Attendance" },
  { href: "/feedback", label: "Feedback" },
];

const NAV_ADMIN = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/discussion", label: "Discussion" },
  { href: "/admin/evaluations", label: "Evaluations" },
  { href: "/reports", label: "Reports" },
];

// Public visitor (no session) — minimal landing nav.
const NAV_PUBLIC: { href: string; label: string }[] = [];

export function navFor(role?: Role | null) {
  if (role === "Admin") return NAV_ADMIN;
  if (role === "Mentor") return NAV_MENTOR;
  if (role === "Mentee") return NAV_STUDENT;
  return NAV_PUBLIC;
}

// Default redirect after sign-in, per role.
export function dashboardFor(role: Role): string {
  if (role === "Admin") return "/admin";
  if (role === "Mentor") return "/mentor";
  return "/dashboard";
}

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
