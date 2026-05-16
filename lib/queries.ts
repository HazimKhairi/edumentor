// Prisma-backed read helpers. Pages call these to get denormalized views that
// match the original lib/data.ts shapes, so page templates can stay simple.

import { db } from "@/lib/db";
import type { Course, User } from "@prisma/client";

// ----------------------------------------------------------------------------
// Courses
// ----------------------------------------------------------------------------

export type CourseView = Course & {
  mentor: string;
  lecturer: string;
};

export async function getCoursesView(): Promise<CourseView[]> {
  const courses = await db.course.findMany({
    include: {
      lecturer: { select: { name: true } },
      enrollments: {
        where: { asRole: "Mentor" },
        include: { user: { select: { name: true } } },
        take: 1,
      },
    },
    orderBy: { semester: "asc" },
  });
  return courses.map((c) => ({
    ...c,
    mentor: c.enrollments[0]?.user.name ?? "—",
    lecturer: c.lecturer?.name ?? "—",
  }));
}

export async function getCourseView(id: string): Promise<CourseView | null> {
  const c = await db.course.findUnique({
    where: { id },
    include: {
      lecturer: { select: { name: true } },
      enrollments: {
        where: { asRole: "Mentor" },
        include: { user: { select: { name: true } } },
        take: 1,
      },
    },
  });
  if (!c) return null;
  return {
    ...c,
    mentor: c.enrollments[0]?.user.name ?? "—",
    lecturer: c.lecturer?.name ?? "—",
  };
}

export async function coursesForUser(user: User): Promise<CourseView[]> {
  const all = await getCoursesView();
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });
  const ids = new Set(enrollments.map((e) => e.courseId));
  return all.filter((c) => ids.has(c.id));
}

// ----------------------------------------------------------------------------
// Attendance
// ----------------------------------------------------------------------------

export async function attendanceRate(userId: string): Promise<number> {
  const closed = await db.attendanceSession.count({ where: { state: "Closed" } });
  if (closed === 0) return 0;

  const verified = await db.menteeAttendance.count({
    where: {
      menteeId: userId,
      menteeConfirmed: true,
      mentorVerified: true,
      session: { state: "Closed" },
    },
  });
  return Math.round((verified / closed) * 100);
}

export async function attendanceForUser(userId: string) {
  return db.menteeAttendance.findMany({
    where: { menteeId: userId },
    include: { session: true },
    orderBy: { session: { date: "desc" } },
  });
}

// ----------------------------------------------------------------------------
// Sessions, assignments, events
// ----------------------------------------------------------------------------

export type AttendanceSessionView = Awaited<
  ReturnType<typeof getAttendanceSessionsView>
>[number];

export async function getAttendanceSessionsView() {
  const rows = await db.attendanceSession.findMany({
    include: { course: { select: { code: true } } },
    orderBy: { date: "desc" },
  });
  return rows.map((s) => ({
    ...s,
    course: s.course.code,
    date: s.date.toISOString().slice(0, 10),
  }));
}

export async function getAssignmentsView(forCourseCodes?: string[]) {
  const rows = await db.assignment.findMany({
    include: { course: { select: { code: true } } },
    orderBy: { due: "asc" },
    where: forCourseCodes ? { course: { code: { in: forCourseCodes } } } : undefined,
  });
  return rows.map((a) => ({
    ...a,
    course: a.course.code,
    issued: a.issued.toISOString().slice(5, 10).replace("-", " "), // "Apr 22" style not feasible without date-fns; fall back to ISO
    due: a.due.toISOString().slice(5, 10).replace("-", " "),
    of: a.ofCount,
    status: a.status === "ClosingSoon" ? "Closing soon" : a.status,
  }));
}

// Today's schedule, derived from ClassSession.
export async function getUpcomingEvents(forCourseCodes?: string[]) {
  const rows = await db.classSession.findMany({
    where: forCourseCodes ? { course: { code: { in: forCourseCodes } } } : undefined,
    include: { course: { select: { code: true } } },
    orderBy: { date: "asc" },
    take: 6,
  });
  return rows.map((c) => ({
    when: `${c.date.toISOString().slice(5, 10)}, ${c.time}`,
    course: c.course.code,
    title: c.topic,
    place: c.room,
    state: c.state === "Live" ? "now" : "later",
  }));
}

// ----------------------------------------------------------------------------
// Discussion + feedback
// ----------------------------------------------------------------------------

export async function getRoomsView() {
  const rows = await db.discussionRoom.findMany({
    include: {
      course: { select: { code: true } },
      starter: { select: { name: true, role: true } },
    },
    orderBy: [{ pinned: "desc" }, { lastAt: "desc" }],
  });
  return rows.map((r) => ({
    ...r,
    course: r.course.code,
    starter: r.starter.name,
    role: r.starter.role,
    last: r.lastAt.toISOString().slice(0, 10),
  }));
}

export async function getMessagesView(limit = 5) {
  const rows = await db.discussionMessage.findMany({
    include: { author: { select: { name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((m) => ({
    id: m.id,
    author: m.author.name,
    role: m.author.role,
    time: m.time,
    body: m.body,
  }));
}

export async function getFeedbackView() {
  const rows = await db.feedbackEntry.findMany({
    include: {
      course: { select: { code: true } },
      mentor: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((f) => ({
    ...f,
    course: f.course.code,
    mentor: f.mentor.name,
    by: "Anonymous mentee",
  }));
}

// ----------------------------------------------------------------------------
// Roster (live session enrolled mentees)
// ----------------------------------------------------------------------------

export async function getRosterForSession(sessionId: string) {
  const session = await db.attendanceSession.findUnique({
    where: { id: sessionId },
    select: { courseId: true },
  });
  if (!session) return [];
  const enrollments = await db.enrollment.findMany({
    where: { courseId: session.courseId, asRole: "Mentee" },
    include: {
      user: {
        select: { id: true, name: true, identity: true, faceDescriptor: true },
      },
    },
  });
  return enrollments.map((e) => ({
    id: e.user.id,
    name: e.user.name,
    matric: e.user.identity,
    // Bytes column holds a Float32Array (4 bytes per number). Decode to plain
    // number[] so we can ship over the wire to the mentor's browser.
    descriptor: e.user.faceDescriptor
      ? Array.from(
          new Float32Array(
            e.user.faceDescriptor.buffer,
            e.user.faceDescriptor.byteOffset,
            e.user.faceDescriptor.byteLength / 4,
          ),
        )
      : null,
  }));
}

// ----------------------------------------------------------------------------
// Stats (live counts)
// ----------------------------------------------------------------------------

export async function getStats() {
  const [courses, mentees, mentors, closedAttendance] = await Promise.all([
    db.course.count(),
    db.user.count({ where: { role: "Mentee" } }),
    db.user.count({ where: { role: "Mentor" } }),
    db.menteeAttendance.findMany({
      where: { session: { state: "Closed" } },
      select: { menteeConfirmed: true, mentorVerified: true },
    }),
  ]);
  const total = closedAttendance.length;
  const counted = closedAttendance.filter(
    (r) => r.menteeConfirmed && r.mentorVerified,
  ).length;
  const accuracy =
    total > 0
      ? `${(Math.round((counted / total) * 1000) / 10).toFixed(1)}%`
      : "—";

  return [
    { label: "Active courses",       value: String(courses).padStart(2, "0"), caption: "this semester" },
    { label: "Mentees enrolled",     value: String(mentees),                   caption: "across cohorts" },
    { label: "Student mentors",      value: String(mentors).padStart(2, "0"),  caption: "across all faculties" },
    { label: "Attendance accuracy",  value: accuracy,                          caption: total > 0 ? `${counted} of ${total} sessions verified` : "no sessions closed yet" },
  ];
}
