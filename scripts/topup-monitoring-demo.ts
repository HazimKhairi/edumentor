// Additive demo top-up for the monitoring module.
//
// Unlike prisma/seed.ts this NEVER deletes anything — the live database holds
// real accounts created during demos, and a full reseed would wipe them. This
// only fills in the assignments and marks the monitoring tables need, and is
// safe to run repeatedly.
//
//   npx tsx scripts/topup-monitoring-demo.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config as loadEnv } from "dotenv";
import { makeAdapter } from "../lib/db-adapter";
import { letterFromMark } from "../lib/performance";

loadEnv();
loadEnv({ path: ".env.local", override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const db = new PrismaClient({ adapter: makeAdapter(connectionString) });

const ASSIGNMENTS = [
  {
    id: "as-05",
    code: "QUIZ-01",
    title: "Continuity and one-sided limits",
    courseId: "mat183",
    mentorId: "u-006",
    issued: new Date("2026-04-26"),
    due: new Date("2026-05-09"),
    weight: 8,
    status: "Closed" as const,
    submissions: 2,
    ofCount: 2,
    type: "Quiz",
    note: "Twenty short questions. Closed book, 45 minutes.",
  },
  {
    id: "as-06",
    code: "PS-02",
    title: "Spanning trees and shortest paths",
    courseId: "mat210",
    mentorId: "u-007",
    issued: new Date("2026-04-28"),
    due: new Date("2026-05-12"),
    weight: 12,
    status: "Open" as const,
    submissions: 2,
    ofCount: 2,
    type: "Problem Set",
    note: "Apply Kruskal and Dijkstra to the given weighted graphs. Show each step.",
  },
];

// mark === null means submitted but deliberately left unmarked, so the
// "awaiting marks" figure on the monitoring page is not zero.
const SUBMISSIONS: {
  assignmentId: string;
  menteeId: string;
  body: string;
  mark: number | null;
}[] = [
  { assignmentId: "as-01", menteeId: "u-001", body: "My six function-composition problems with working shown.", mark: 82 },
  { assignmentId: "as-01", menteeId: "u-002", body: "Attached my working for all six problems.", mark: 71 },
  { assignmentId: "as-04", menteeId: "u-001", body: "Ten identities proved, diagrams included for four.", mark: 88 },
  { assignmentId: "as-04", menteeId: "u-002", body: "Eight of ten proved. Stuck on the last two.", mark: 64 },
  { assignmentId: "as-02", menteeId: "u-003", body: "Eight limit problems, squeeze theorem used on three.", mark: 76 },
  { assignmentId: "as-02", menteeId: "u-004", body: "Limit calculations attached. Unsure about problem 6.", mark: 48 },
  { assignmentId: "as-05", menteeId: "u-003", body: "Quiz script submitted in class.", mark: 69 },
  { assignmentId: "as-05", menteeId: "u-004", body: "Quiz script submitted in class.", mark: 41 },
  { assignmentId: "as-03", menteeId: "u-005", body: "1300-word essay analysing the KL rail network as a graph.", mark: 72 },
  { assignmentId: "as-03", menteeId: "u-006", body: "1450-word essay on the Klang Valley bus network.", mark: 90 },
  { assignmentId: "as-06", menteeId: "u-005", body: "Kruskal and Dijkstra worked through for both graphs.", mark: null },
  { assignmentId: "as-06", menteeId: "u-006", body: "Both algorithms applied, each step shown.", mark: 86 },
];

// The MAT210 mentor (Nadia) was removed from the live database at some point,
// which orphaned as-03 (mentorId went null) and cascaded away both MAT210
// mentorships. Restore that cohort so the course is not a dead branch in the
// monitoring tables, and so there is a second mentor to demonstrate scoping.
async function restoreMat210Cohort(skipped: string[]) {
  const course = await db.course.findUnique({
    where: { id: "mat210" },
    select: { id: true },
  });
  if (!course) {
    skipped.push("MAT210 cohort (course missing)");
    return;
  }

  await db.user.upsert({
    where: { id: "u-007" },
    create: {
      id: "u-007",
      name: "Nadia Aiman Zulkifli",
      identity: "2022613055",
      passwordHash: bcrypt.hashSync("edu1234", 10),
      role: "Mentor",
      status: "Active",
      joined: new Date("2022-09-01"),
      semester: 5,
      cgpa: 3.81,
    },
    update: {},
  });

  await db.enrollment.upsert({
    where: {
      userId_courseId_asRole: { userId: "u-007", courseId: "mat210", asRole: "Mentor" },
    },
    create: { userId: "u-007", courseId: "mat210", asRole: "Mentor", capacity: 5 },
    update: {},
  });

  // as-03 lost its owner when the mentor row went; hand it back.
  await db.assignment.updateMany({
    where: { id: "as-03", mentorId: null },
    data: { mentorId: "u-007" },
  });

  for (const menteeId of ["u-005", "u-006"]) {
    const mentee = await db.user.findUnique({
      where: { id: menteeId },
      select: { id: true },
    });
    if (!mentee) {
      skipped.push(`MAT210 mentorship for ${menteeId} (user missing)`);
      continue;
    }
    await db.enrollment.upsert({
      where: {
        userId_courseId_asRole: { userId: menteeId, courseId: "mat210", asRole: "Mentee" },
      },
      create: { userId: menteeId, courseId: "mat210", asRole: "Mentee" },
      update: {},
    });
    await db.mentorshipAssignment.upsert({
      where: { menteeId_courseId: { menteeId, courseId: "mat210" } },
      create: { menteeId, mentorId: "u-007", courseId: "mat210" },
      update: { mentorId: "u-007" },
    });
  }
}

async function main() {
  const skipped: string[] = [];
  await restoreMat210Cohort(skipped);

  for (const a of ASSIGNMENTS) {
    const [course, mentor] = await Promise.all([
      db.course.findUnique({ where: { id: a.courseId }, select: { id: true } }),
      db.user.findUnique({ where: { id: a.mentorId }, select: { id: true } }),
    ]);
    if (!course || !mentor) {
      skipped.push(`assignment ${a.id} (missing course or mentor)`);
      continue;
    }
    await db.assignment.upsert({
      where: { id: a.id },
      create: a,
      update: { submissions: a.submissions, ofCount: a.ofCount },
    });
  }

  let written = 0;
  for (const s of SUBMISSIONS) {
    const [assignment, mentee] = await Promise.all([
      db.assignment.findUnique({ where: { id: s.assignmentId }, select: { id: true } }),
      db.user.findUnique({ where: { id: s.menteeId }, select: { id: true } }),
    ]);
    if (!assignment || !mentee) {
      skipped.push(`submission ${s.assignmentId}/${s.menteeId} (missing assignment or mentee)`);
      continue;
    }
    const grade = s.mark === null ? null : letterFromMark(s.mark);
    await db.assignmentSubmission.upsert({
      where: {
        assignmentId_menteeId: { assignmentId: s.assignmentId, menteeId: s.menteeId },
      },
      create: {
        assignmentId: s.assignmentId,
        menteeId: s.menteeId,
        body: s.body,
        mark: s.mark,
        grade,
      },
      update: { mark: s.mark, grade },
    });
    written += 1;
  }

  console.log(`submissions written: ${written}`);
  if (skipped.length) {
    console.log(`skipped: ${skipped.length}`);
    for (const s of skipped) console.log(`  - ${s}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
