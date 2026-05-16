"use server";

// Server actions for every write path in EduMentor. Each action mutates Prisma
// and revalidates the affected paths so the next render reflects the change.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { AssignmentStatus, ClassFormat, ClassState, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole, requireUser } from "@/lib/session";
import { MENTOR_MIN_CGPA, MENTOR_SUBJECT_CAP } from "@/lib/data";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function getString(fd: FormData, name: string, fallback = ""): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : fallback;
}

function getOptionalString(fd: FormData, name: string): string | undefined {
  const v = fd.get(name);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function getInt(fd: FormData, name: string, fallback = 0): number {
  const v = fd.get(name);
  if (typeof v !== "string") return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function getFloat(fd: FormData, name: string, fallback = 0): number {
  const v = fd.get(name);
  if (typeof v !== "string") return fallback;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

// Face descriptor arrives as a JSON-stringified 128-number array. Convert to
// Bytes the LongBlob column can store, fail soft if invalid/absent.
function parseFaceDescriptor(fd: FormData): Uint8Array<ArrayBuffer> | undefined {
  const raw = fd.get("faceDescriptor");
  if (typeof raw !== "string" || raw.length === 0) return undefined;
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    const buf = new ArrayBuffer(arr.length * 4);
    const view = new Float32Array(buf);
    for (let i = 0; i < arr.length; i++) view[i] = Number(arr[i]);
    return new Uint8Array(buf);
  } catch {
    return undefined;
  }
}

// ----------------------------------------------------------------------------
// Register
// ----------------------------------------------------------------------------

export async function registerAccount(formData: FormData) {
  const name = getString(formData, "name");
  const email = getOptionalString(formData, "email");
  const matric = getString(formData, "matric");
  const password = getString(formData, "password");
  const role = getString(formData, "role") as Role;
  const semester = getInt(formData, "semester", 1);
  const cgpa = getFloat(formData, "cgpa", 0) || undefined;
  const courseIdsRaw = formData.getAll("courseIds");
  const courseIds = courseIdsRaw.filter((x): x is string => typeof x === "string");
  const faceDescriptor = parseFaceDescriptor(formData);

  if (!name || !matric || !password) {
    redirect("/register?error=missing");
  }
  if (password.length < 6) {
    redirect("/register?error=weak");
  }
  if (role !== "Mentor" && role !== "Mentee") {
    redirect("/register?error=role");
  }

  const exists = await db.user.findUnique({ where: { identity: matric } });
  if (exists) {
    redirect("/register?error=duplicate");
  }

  // Mentor candidates must pass the eligibility gate.
  if (role === "Mentor") {
    if (!cgpa || cgpa < MENTOR_MIN_CGPA) {
      redirect("/register?error=cgpa");
    }
    if (courseIds.length > MENTOR_SUBJECT_CAP) {
      redirect("/register?error=cap");
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      identity: matric,
      email,
      passwordHash,
      role,
      semester,
      cgpa,
      faceDescriptor,
      enrollments: {
        create: courseIds.map((courseId) => ({
          courseId,
          asRole: role,
        })),
      },
    },
  });

  redirect("/login?registered=1");
}

// ----------------------------------------------------------------------------
// User mutations (admin)
// ----------------------------------------------------------------------------

export async function promoteToMentor(formData: FormData) {
  await requireRole("Admin");
  const userId = getString(formData, "userId");
  const courseIdsRaw = formData.getAll("courseIds");
  const courseIds = courseIdsRaw.filter((x): x is string => typeof x === "string");

  const u = await db.user.findUnique({ where: { id: userId } });
  if (!u || u.role !== "Mentee") redirect("/admin/users?error=not-mentee");

  if ((u.cgpa ?? 0) < MENTOR_MIN_CGPA) {
    redirect(`/admin/users/${userId}/promote?error=cgpa`);
  }
  if (courseIds.length > MENTOR_SUBJECT_CAP) {
    redirect(`/admin/users/${userId}/promote?error=cap`);
  }

  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { role: "Mentor" } }),
    db.enrollment.deleteMany({ where: { userId } }),
    db.enrollment.createMany({
      data: courseIds.map((courseId) => ({
        userId,
        courseId,
        asRole: "Mentor" as const,
      })),
    }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await requireRole("Admin");
  const userId = getString(formData, "userId");
  if (!userId) redirect("/admin/users");
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

// ----------------------------------------------------------------------------
// Course mutations
// ----------------------------------------------------------------------------

function courseDataFromForm(formData: FormData) {
  return {
    code: getString(formData, "code"),
    title: getString(formData, "title"),
    cohort: getString(formData, "cohort"),
    semester: getInt(formData, "semester", 1),
    capacity: getInt(formData, "capacity", 40),
    enrolled: getInt(formData, "enrolled", 0),
    pace: getString(formData, "pace"),
    color: getString(formData, "color", "oxblood"),
    abstract: getString(formData, "abstract"),
    progress: getInt(formData, "progress", 0),
    sessions: getInt(formData, "sessions", 0),
    lecturerId: getOptionalString(formData, "lecturerId"),
  };
}

export async function createCourse(formData: FormData) {
  await requireRole("Admin");
  const id = getString(formData, "id");
  const data = courseDataFromForm(formData);
  if (!id || !data.code || !data.title) {
    redirect("/admin/courses/new?error=missing");
  }
  await db.course.create({ data: { id, ...data } });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function updateCourse(formData: FormData) {
  await requireRole("Admin");
  const id = getString(formData, "id");
  if (!id) redirect("/admin/courses");
  const data = courseDataFromForm(formData);
  await db.course.update({ where: { id }, data });
  revalidatePath("/admin/courses");
  revalidatePath(`/courses/${id}`);
  redirect("/admin/courses");
}

export async function deleteCourse(formData: FormData) {
  await requireRole("Admin");
  const id = getString(formData, "id");
  if (!id) redirect("/admin/courses");
  await db.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

// ----------------------------------------------------------------------------
// Assignment mutations (mentor)
// ----------------------------------------------------------------------------

function parseDate(value: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.valueOf())) return new Date();
  return d;
}

function assignmentDataFromForm(formData: FormData) {
  const statusRaw = getString(formData, "status", "Open");
  const status: AssignmentStatus =
    statusRaw === "Closed"
      ? "Closed"
      : statusRaw === "Closing soon" || statusRaw === "ClosingSoon"
        ? "ClosingSoon"
        : "Open";
  return {
    code: getString(formData, "code"),
    title: getString(formData, "title"),
    courseId: getString(formData, "courseId"),
    issued: parseDate(getString(formData, "issued")),
    due: parseDate(getString(formData, "due")),
    weight: getInt(formData, "weight", 10),
    status,
    submissions: getInt(formData, "submissions", 0),
    ofCount: getInt(formData, "ofCount", 0),
    type: getString(formData, "type", "Problem Set"),
    note: getString(formData, "note"),
  };
}

export async function createAssignment(formData: FormData) {
  await requireRole(["Mentor", "Admin"]);
  const data = assignmentDataFromForm(formData);
  if (!data.code || !data.title || !data.courseId) {
    redirect("/mentor/assignments/new?error=missing");
  }
  await db.assignment.create({ data });
  revalidatePath("/mentor/assignments");
  revalidatePath("/assignments");
  redirect("/mentor/assignments");
}

export async function updateAssignment(formData: FormData) {
  await requireRole(["Mentor", "Admin"]);
  const id = getString(formData, "id");
  if (!id) redirect("/mentor/assignments");
  const data = assignmentDataFromForm(formData);
  await db.assignment.update({ where: { id }, data });
  revalidatePath("/mentor/assignments");
  revalidatePath(`/assignments/${id}`);
  redirect("/mentor/assignments");
}

export async function deleteAssignment(formData: FormData) {
  await requireRole(["Mentor", "Admin"]);
  const id = getString(formData, "id");
  if (!id) redirect("/mentor/assignments");
  await db.assignment.delete({ where: { id } });
  revalidatePath("/mentor/assignments");
  redirect("/mentor/assignments");
}

// ----------------------------------------------------------------------------
// Class session mutations (mentor)
// ----------------------------------------------------------------------------

export async function createClassSession(formData: FormData) {
  await requireRole(["Mentor", "Admin"]);
  const courseId = getString(formData, "courseId");
  const topic = getString(formData, "topic");
  const date = getString(formData, "date");
  const time = getString(formData, "time");
  const room = getString(formData, "room");
  const formatRaw = getString(formData, "format", "InPerson");
  const format: ClassFormat =
    formatRaw === "Online" || formatRaw === "Hybrid" ? formatRaw : "InPerson";
  const meetingLink = getOptionalString(formData, "meetingLink");
  const stateRaw = getString(formData, "state", "Scheduled");
  const state: ClassState =
    stateRaw === "Live" || stateRaw === "Closed" ? stateRaw : "Scheduled";

  if (!courseId || !topic || !date || !time || !room) {
    redirect("/mentor/classes/new?error=missing");
  }

  await db.classSession.create({
    data: {
      courseId,
      topic,
      date: parseDate(date),
      time,
      room,
      format,
      meetingLink,
      state,
    },
  });
  revalidatePath("/mentor/classes");
  redirect("/mentor/classes");
}

// ----------------------------------------------------------------------------
// Evaluation rubric mutations (admin)
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Attendance two-step verification
// ----------------------------------------------------------------------------

// Step 1 — mentee taps Confirm after face match. Idempotent.
export async function confirmAttendance(sessionId: string) {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not signed in");
  const userId = session.user.id;

  const live = await db.attendanceSession.findUnique({
    where: { id: sessionId },
    select: { state: true },
  });
  if (!live || live.state !== "Live") {
    throw new Error("Session not live");
  }

  await db.menteeAttendance.upsert({
    where: { sessionId_menteeId: { sessionId, menteeId: userId } },
    create: {
      sessionId,
      menteeId: userId,
      menteeConfirmed: true,
      recognisedAt: new Date(),
    },
    update: {
      menteeConfirmed: true,
      recognisedAt: new Date(),
    },
  });
  revalidatePath("/attendance");
  return { ok: true as const };
}

// Step 2 — mentor taps Verify on a single mentee row.
export async function verifyAttendance(sessionId: string, menteeId: string) {
  await requireRole(["Mentor", "Admin"]);
  await db.menteeAttendance.upsert({
    where: { sessionId_menteeId: { sessionId, menteeId } },
    create: {
      sessionId,
      menteeId,
      menteeConfirmed: false,
      mentorVerified: true,
      verifiedAt: new Date(),
    },
    update: {
      mentorVerified: true,
      verifiedAt: new Date(),
    },
  });
  revalidatePath("/attendance");
  return { ok: true as const };
}

// Aggregate state of a live session, used by polling clients to know when the
// mentor has verified or new mentees have confirmed.
export async function getSessionStatus(sessionId: string) {
  const records = await db.menteeAttendance.findMany({
    where: { sessionId },
    select: {
      menteeId: true,
      menteeConfirmed: true,
      mentorVerified: true,
    },
  });
  return records;
}

// ----------------------------------------------------------------------------
// Assignment submissions (mentee work)
// ----------------------------------------------------------------------------

export async function submitAssignmentWork(formData: FormData) {
  const me = await requireUser();
  const assignmentId = getString(formData, "assignmentId");
  const body = getString(formData, "body");
  const linkUrl = getOptionalString(formData, "linkUrl");

  if (!assignmentId || !body) {
    redirect(`/assignments/${assignmentId || ""}?error=missing`);
  }

  const a = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!a) redirect("/assignments");
  if (a.status === "Closed") {
    redirect(`/assignments/${assignmentId}?error=closed`);
  }

  const existing = await db.assignmentSubmission.findUnique({
    where: { assignmentId_menteeId: { assignmentId, menteeId: me.id } },
  });

  if (existing) {
    await db.assignmentSubmission.update({
      where: { assignmentId_menteeId: { assignmentId, menteeId: me.id } },
      data: { body, linkUrl, submittedAt: new Date() },
    });
  } else {
    await db.$transaction([
      db.assignmentSubmission.create({
        data: { assignmentId, menteeId: me.id, body, linkUrl },
      }),
      db.assignment.update({
        where: { id: assignmentId },
        data: { submissions: { increment: 1 } },
      }),
    ]);
  }

  revalidatePath("/assignments");
  revalidatePath(`/assignments/${assignmentId}`);
  redirect(`/assignments/${assignmentId}?submitted=1`);
}

export async function withdrawSubmission(formData: FormData) {
  const me = await requireUser();
  const assignmentId = getString(formData, "assignmentId");
  if (!assignmentId) return;

  const existing = await db.assignmentSubmission.findUnique({
    where: { assignmentId_menteeId: { assignmentId, menteeId: me.id } },
  });
  if (!existing) return;

  await db.$transaction([
    db.assignmentSubmission.delete({
      where: { assignmentId_menteeId: { assignmentId, menteeId: me.id } },
    }),
    db.assignment.update({
      where: { id: assignmentId },
      data: { submissions: { decrement: 1 } },
    }),
  ]);

  revalidatePath("/assignments");
  revalidatePath(`/assignments/${assignmentId}`);
  redirect(`/assignments/${assignmentId}`);
}

// ----------------------------------------------------------------------------
// Feedback submission
// ----------------------------------------------------------------------------

export async function submitFeedback(formData: FormData) {
  const me = await requireUser();
  const courseId = getString(formData, "courseId");
  const score = Math.max(1, Math.min(5, getInt(formData, "score", 0)));
  const comment = getString(formData, "comment");
  const anonymous = formData.get("anonymous") === "on";

  if (!courseId || score < 1 || !comment) {
    redirect("/feedback?error=missing");
  }

  // Find the mentor enrolled in this course (asRole=Mentor)
  const mentor = await db.enrollment.findFirst({
    where: { courseId, asRole: "Mentor" },
    select: { userId: true },
  });
  if (!mentor) redirect("/feedback?error=no-mentor");

  await db.feedbackEntry.create({
    data: {
      courseId,
      mentorId: mentor.userId,
      authorId: anonymous ? null : me.id,
      score,
      n: 1,
      comment,
    },
  });
  revalidatePath("/feedback");
  revalidatePath("/reports");
  redirect("/feedback?submitted=1");
}

// ----------------------------------------------------------------------------
// Enrolment (mentee joins / drops a course)
// ----------------------------------------------------------------------------

export async function enrolInCourse(formData: FormData) {
  const me = await requireUser();
  const courseId = getString(formData, "courseId");
  if (!courseId) redirect("/courses");

  if (me.role !== "Mentee") {
    redirect(`/courses/${courseId}?error=not-mentee`);
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) redirect("/courses");

  if (me.semester && course.semester !== me.semester) {
    redirect(`/courses/${courseId}?error=wrong-semester`);
  }
  if (course.enrolled >= course.capacity) {
    redirect(`/courses/${courseId}?error=full`);
  }

  const already = await db.enrollment.findUnique({
    where: {
      userId_courseId_asRole: {
        userId: me.id,
        courseId,
        asRole: "Mentee",
      },
    },
  });

  if (!already) {
    await db.$transaction([
      db.enrollment.create({
        data: { userId: me.id, courseId, asRole: "Mentee" },
      }),
      db.course.update({
        where: { id: courseId },
        data: { enrolled: { increment: 1 } },
      }),
    ]);
  }

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  redirect("/dashboard?enrolled=1");
}

export async function dropEnrolment(formData: FormData) {
  const me = await requireUser();
  const courseId = getString(formData, "courseId");
  if (!courseId) redirect("/courses");

  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId_asRole: {
        userId: me.id,
        courseId,
        asRole: "Mentee",
      },
    },
  });
  if (existing) {
    await db.$transaction([
      db.enrollment.delete({
        where: {
          userId_courseId_asRole: {
            userId: me.id,
            courseId,
            asRole: "Mentee",
          },
        },
      }),
      db.course.update({
        where: { id: courseId },
        data: { enrolled: { decrement: 1 } },
      }),
    ]);
  }
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);
  redirect("/dashboard");
}

// ----------------------------------------------------------------------------
// Discussion rooms + replies
// ----------------------------------------------------------------------------

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function createDiscussionRoom(formData: FormData) {
  const me = await requireUser();
  const courseId = getString(formData, "courseId");
  const title = getString(formData, "title");
  const body = getString(formData, "body");
  if (!courseId || !title || !body) {
    redirect("/discussion/new?error=missing");
  }
  const room = await db.discussionRoom.create({
    data: {
      title,
      courseId,
      starterId: me.id,
      excerpt: body.slice(0, 280),
      posts: 1,
      members: 1,
      pinned: false,
      messages: {
        create: { authorId: me.id, body, time: nowHHMM() },
      },
    },
  });
  revalidatePath("/discussion");
  redirect(`/discussion/${room.id}`);
}

export async function postReply(formData: FormData) {
  const me = await requireUser();
  const roomId = getString(formData, "roomId");
  const body = getString(formData, "body");
  if (!roomId || !body) {
    redirect(`/discussion/${roomId || ""}`);
  }
  await db.$transaction([
    db.discussionMessage.create({
      data: { roomId, authorId: me.id, body, time: nowHHMM() },
    }),
    db.discussionRoom.update({
      where: { id: roomId },
      data: {
        posts: { increment: 1 },
        excerpt: body.slice(0, 280),
        lastAt: new Date(),
      },
    }),
  ]);
  revalidatePath("/discussion");
  revalidatePath(`/discussion/${roomId}`);
  redirect(`/discussion/${roomId}`);
}

export async function toggleRoomPin(formData: FormData) {
  await requireRole(["Mentor", "Admin"]);
  const roomId = getString(formData, "roomId");
  if (!roomId) return;
  const r = await db.discussionRoom.findUnique({
    where: { id: roomId },
    select: { pinned: true },
  });
  if (!r) return;
  await db.discussionRoom.update({
    where: { id: roomId },
    data: { pinned: !r.pinned },
  });
  revalidatePath("/discussion");
  revalidatePath(`/discussion/${roomId}`);
}

// ----------------------------------------------------------------------------
// Evaluation rubrics
// ----------------------------------------------------------------------------

export async function createRubric(formData: FormData) {
  await requireRole("Admin");
  const title = getString(formData, "title");
  const target = getString(formData, "target", "Mentor");
  const scale = getInt(formData, "scale", 5);
  const itemsRaw = formData.getAll("items");
  const items = itemsRaw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  if (!title || items.length === 0) redirect("/admin/evaluations/new?error=missing");
  await db.evaluationRubric.create({
    data: { title, target, scale, items, active: true },
  });
  revalidatePath("/admin/evaluations");
  redirect("/admin/evaluations");
}
