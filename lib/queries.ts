// Prisma-backed read helpers. Pages call these to get denormalized views that
// match the original lib/data.ts shapes, so page templates can stay simple.

import { db } from "@/lib/db";
import type { Course, User } from "@prisma/client";
import { MENTOR_MENTEE_CAP } from "@/lib/data";

// ----------------------------------------------------------------------------
// Courses
// ----------------------------------------------------------------------------

export type CourseView = Course & {
  mentor: string;
  mentorId: string | null;
  lecturer: string;
};

export async function getCoursesView(): Promise<CourseView[]> {
  const courses = await db.course.findMany({
    include: {
      lecturer: { select: { name: true } },
      enrollments: {
        where: { asRole: "Mentor" },
        include: { user: { select: { id: true, name: true } } },
        take: 1,
      },
    },
    orderBy: { semester: "asc" },
  });
  return courses.map((c) => ({
    ...c,
    mentor: c.enrollments[0]?.user.name ?? "—",
    mentorId: c.enrollments[0]?.user.id ?? null,
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
        include: { user: { select: { id: true, name: true } } },
        take: 1,
      },
    },
  });
  if (!c) return null;
  return {
    ...c,
    mentor: c.enrollments[0]?.user.name ?? "—",
    mentorId: c.enrollments[0]?.user.id ?? null,
    lecturer: c.lecturer?.name ?? "—",
  };
}

// Courses the user is enrolled in, but only in the given role. Used for
// scoping feedback / dashboard / assignments to the role-appropriate slice.
export async function coursesForUserAsRole(
  userId: string,
  asRole: "Mentor" | "Mentee",
): Promise<CourseView[]> {
  const all = await getCoursesView();
  const enrollments = await db.enrollment.findMany({
    where: { userId, asRole },
    select: { courseId: true },
  });
  const ids = new Set(enrollments.map((e) => e.courseId));
  return all.filter((c) => ids.has(c.id));
}

// ----------------------------------------------------------------------------
// Mentorship assignment scoping (G5)
// ----------------------------------------------------------------------------

// IDs of mentees a mentor is assigned to, optionally narrowed by course.
export async function menteeIdsForMentor(
  mentorId: string,
  courseId?: string,
): Promise<string[]> {
  const rows = await db.mentorshipAssignment.findMany({
    where: { mentorId, ...(courseId ? { courseId } : {}) },
    select: { menteeId: true },
  });
  return rows.map((r) => r.menteeId);
}

// The mentee's assigned mentor + courseIds. A mentee may have multiple
// (mentor, course) pairs if enrolled in multiple courses.
export async function mentorshipsForMentee(menteeId: string) {
  return db.mentorshipAssignment.findMany({
    where: { menteeId },
    select: { mentorId: true, courseId: true },
  });
}

// Course IDs where the mentee has already CHOSEN a mentor. These are the only
// courses whose classes / assignments / discussion the mentee may access. A
// course the mentee enrolled in but hasn't picked a mentor for is "pending"
// and stays gated until they choose (SV Syaza: pick first, then join).
export async function chosenCourseIdsForMentee(menteeId: string): Promise<string[]> {
  const rows = await db.mentorshipAssignment.findMany({
    where: { menteeId },
    select: { courseId: true },
  });
  return rows.map((r) => r.courseId);
}

// A mentor option a mentee can pick for one course: who they are, their slot
// limit, how many mentees already chose them, and whether a slot remains.
export type MentorOption = {
  mentorId: string;
  name: string;
  cgpa: number | null;
  rating: number | null;
  capacity: number;
  taken: number;
  remaining: number;
  full: boolean;
};

// All mentors the admin has assigned to a course, with live slot accounting.
export async function mentorOptionsForCourse(courseId: string): Promise<MentorOption[]> {
  const offerings = await db.enrollment.findMany({
    where: { courseId, asRole: "Mentor" },
    include: { user: { select: { id: true, name: true, cgpa: true } } },
  });
  if (offerings.length === 0) return [];

  // Live mentee counts per mentor for this course.
  const counts = await db.mentorshipAssignment.groupBy({
    by: ["mentorId"],
    where: { courseId },
    _count: { menteeId: true },
  });
  const countMap = new Map(counts.map((c) => [c.mentorId, c._count.menteeId]));

  // Average feedback rating per mentor for this course.
  const ratings = await db.feedbackEntry.groupBy({
    by: ["mentorId"],
    where: { courseId },
    _avg: { score: true },
  });
  const ratingMap = new Map(ratings.map((r) => [r.mentorId, r._avg.score]));

  return offerings.map((o) => {
    const capacity = o.capacity ?? MENTOR_MENTEE_CAP;
    const taken = countMap.get(o.user.id) ?? 0;
    const remaining = Math.max(0, capacity - taken);
    return {
      mentorId: o.user.id,
      name: o.user.name,
      cgpa: o.user.cgpa,
      rating: ratingMap.get(o.user.id) ?? null,
      capacity,
      taken,
      remaining,
      full: remaining <= 0,
    };
  });
}

// Courses the mentee enrolled in but has NOT yet chosen a mentor for, each with
// its pickable mentor options. Drives the dashboard mentor-picker.
export async function pendingMentorChoices(menteeId: string) {
  const [enrollments, chosen] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: menteeId, asRole: "Mentee" },
      include: { course: { select: { id: true, code: true, title: true, semester: true } } },
    }),
    chosenCourseIdsForMentee(menteeId),
  ]);
  const chosenSet = new Set(chosen);
  const pending = enrollments.filter((e) => !chosenSet.has(e.courseId));

  return Promise.all(
    pending.map(async (e) => ({
      course: e.course,
      mentors: await mentorOptionsForCourse(e.courseId),
    })),
  );
}

// Course IDs the user has access to: as a mentee, the courses they enrolled
// in; as a mentor, the courses they teach; as an admin, all courses.
export async function courseIdsForUser(
  userId: string,
  role: "Admin" | "Mentor" | "Mentee",
): Promise<string[]> {
  if (role === "Admin") {
    const rows = await db.course.findMany({ select: { id: true } });
    return rows.map((r) => r.id);
  }
  // Mentee access is gated by mentor choice: only courses where they have
  // picked a mentor count. Enrolled-but-unpicked courses stay locked.
  if (role === "Mentee") {
    return chosenCourseIdsForMentee(userId);
  }
  const rows = await db.enrollment.findMany({
    where: { userId, asRole: "Mentor" },
    select: { courseId: true },
  });
  return rows.map((r) => r.courseId);
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

// Per-class confirmed/verified roster, used by the class detail page (Me5).
export async function attendanceRecordsForSession(sessionId: string) {
  return db.menteeAttendance.findMany({
    where: { sessionId },
    include: { mentee: { select: { id: true, name: true, identity: true } } },
    orderBy: { mentee: { name: "asc" } },
  });
}

// The classes (ClassSession) visible to a user, scoped to their courses, with
// the mentor name for each. Drives the by-class list on /attendance.
export async function getClassesForUser(courseIds: string[]) {
  if (courseIds.length === 0) return [];
  const classes = await db.classSession.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: {
          code: true,
          enrollments: {
            where: { asRole: "Mentor" },
            include: { user: { select: { name: true } } },
            take: 1,
          },
        },
      },
    },
    orderBy: [{ state: "asc" }, { date: "desc" }],
  });
  return classes.map((c) => ({
    id: c.id,
    courseId: c.courseId,
    course: c.course.code,
    topic: c.topic,
    date: c.date.toISOString().slice(0, 10),
    time: c.time,
    room: c.room,
    format: c.format,
    meetingLink: c.meetingLink,
    state: c.state,
    mentor: c.course.enrollments[0]?.user.name ?? "—",
  }));
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
