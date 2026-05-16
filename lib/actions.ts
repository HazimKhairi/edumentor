"use server";

// Server actions for every write path in EduMentor. Each action mutates Prisma
// and revalidates the affected paths so the next render reflects the change.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { AssignmentStatus, ClassFormat, ClassState, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
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
