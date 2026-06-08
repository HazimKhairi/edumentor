// Seed script ports demo data into MySQL using the real UiTM B.Sc. CS
// course structure (sem 1, MAT133, sem 2, MAT183, sem 3, MAT210, sem 4, STA116).
// Idempotent: clears existing rows in dependency order before inserting.

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const adapter = new PrismaMariaDb(url);
const db = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "edu1234";
const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

async function main() {
  console.log("Clearing existing rows…");
  await db.assignmentSubmission.deleteMany();
  await db.menteeAttendance.deleteMany();
  await db.attendanceSession.deleteMany();
  await db.assignment.deleteMany();
  await db.discussionMessage.deleteMany();
  await db.discussionRoom.deleteMany();
  await db.feedbackEntry.deleteMany();
  await db.classSession.deleteMany();
  await db.mentorshipAssignment.deleteMany();
  await db.enrollment.deleteMany();
  await db.passedSubject.deleteMany();
  await db.evaluationRubric.deleteMany();
  await db.course.deleteMany();
  await db.user.deleteMany();

  console.log("Seeding users…");
  await db.user.createMany({
    data: [
      // Single registrar/admin account — username = "admin".
      { id: "u-admin", name: "Admin", identity: "admin", passwordHash, role: "Admin", status: "Active", joined: new Date("2018-02-12") },
      // Lecturers (still Admin role for course ownership; not used to sign in).
      { id: "u-009", name: "Dr. Aishah Mokhtar", identity: "FCMS-184", passwordHash, role: "Admin", status: "Active", joined: new Date("2018-02-12") },
      { id: "u-010", name: "Dr. Faiz Rashid",    identity: "FCMS-209", passwordHash, role: "Admin", status: "Active", joined: new Date("2020-08-04") },
      { id: "u-011", name: "Pn. Liyana Hashim",  identity: "FCMS-232", passwordHash, role: "Admin", status: "Active", joined: new Date("2022-01-10") },
      // Mentors: senior students who have passed earlier semesters
      { id: "u-006", name: "Adam Iskandar Razak",  identity: "2022613001", passwordHash, role: "Mentor", status: "Active", joined: new Date("2022-09-01"), semester: 3, cgpa: 3.68 },
      { id: "u-007", name: "Nadia Aiman Zulkifli", identity: "2022613055", passwordHash, role: "Mentor", status: "Active", joined: new Date("2022-09-01"), semester: 5, cgpa: 3.81 },
      { id: "u-008", name: "Daniel Hakimi Othman", identity: "2021607123", passwordHash, role: "Mentor", status: "Active", joined: new Date("2021-09-01"), semester: 6, cgpa: 3.92 },
      // Mentees spread across semesters 1 to 3 so each course has activity
      { id: "u-001", name: "Aiman Hakimi",     identity: "2023607832", passwordHash, role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.74 },
      { id: "u-002", name: "Nur Sofea Rashid", identity: "2023608112", passwordHash, role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.55 },
      { id: "u-003", name: "Faris Adlan",      identity: "2023611901", passwordHash, role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 2, cgpa: 3.31 },
      { id: "u-004", name: "Liyana Aziz",      identity: "2023612200", passwordHash, role: "Mentee", status: "Probation", joined: new Date("2024-09-01"), semester: 2, cgpa: 2.41 },
      { id: "u-005", name: "Hafiz Ridzwan",    identity: "2023612555", passwordHash, role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 3, cgpa: 3.62 },
      // Sem-2 mentee with NO mentor chosen yet — demonstrates the pick-a-mentor
      // flow and the gate (locked out of MAT183 content until they choose).
      { id: "u-012", name: "Iman Danish Sofian", identity: "2024611002", passwordHash, role: "Mentee", status: "Active", joined: new Date("2025-09-01"), semester: 2, cgpa: 3.45 },
    ],
  });
  console.log(`  → all users password = "${DEFAULT_PASSWORD}"`);

  console.log("Seeding courses (real UiTM B.Sc. CS structure)…");
  await db.course.createMany({
    data: [
      {
        id: "mat133",
        code: "MAT133",
        title: "Pre Calculus",
        cohort: "B.Sc. CS, Year 1, Sem 1",
        semester: 1,
        capacity: 60,
        enrolled: 0,
        pace: "Tue & Thu, 14:00",
        color: "oxblood",
        progress: 64,
        sessions: 24,
        lecturerId: "u-009",
        abstract:
          "Functions, polynomials, exponentials, logarithms, and trigonometry, the foundation course for Calculus I.",
      },
      {
        id: "mat183",
        code: "MAT183",
        title: "Calculus I",
        cohort: "B.Sc. CS, Year 1, Sem 2",
        semester: 2,
        capacity: 60,
        enrolled: 0,
        pace: "Mon & Wed, 10:00",
        color: "ink",
        progress: 41,
        sessions: 22,
        lecturerId: "u-009",
        abstract:
          "Limits, derivatives, integrals, and applications of single-variable calculus.",
      },
      {
        id: "mat210",
        code: "MAT210",
        title: "Discrete Mathematics",
        cohort: "B.Sc. CS, Year 2, Sem 3",
        semester: 3,
        capacity: 50,
        enrolled: 0,
        pace: "Wed, 11:00",
        color: "fern",
        progress: 28,
        sessions: 20,
        lecturerId: "u-010",
        abstract:
          "Logic, sets, relations, graphs, trees, and combinatorics with directed application toward algorithmic thinking.",
      },
      {
        id: "sta116",
        code: "STA116",
        title: "Introduction to Probability and Statistics",
        cohort: "B.Sc. CS, Year 2, Sem 4",
        semester: 4,
        capacity: 50,
        enrolled: 0,
        pace: "Fri, 09:00",
        color: "saffron",
        progress: 12,
        sessions: 18,
        lecturerId: "u-011",
        abstract:
          "Probability, sampling, inference, and elementary Bayesian thinking with R-based labs.",
      },
    ],
  });

  console.log("Seeding enrollments…");
  // Mentee column matches each mentee's own semester (canonical rule).
  // Mentor column: each course gets a mentor whose semester is strictly later.
  const enrollments: {
    userId: string;
    courseId: string;
    asRole: "Mentor" | "Mentee";
    capacity?: number;
  }[] = [
    // Mentees (joined exactly the course for their semester)
    { userId: "u-001", courseId: "mat133", asRole: "Mentee" },
    { userId: "u-002", courseId: "mat133", asRole: "Mentee" },
    { userId: "u-003", courseId: "mat183", asRole: "Mentee" },
    { userId: "u-004", courseId: "mat183", asRole: "Mentee" },
    { userId: "u-005", courseId: "mat210", asRole: "Mentee" },
    { userId: "u-012", courseId: "mat183", asRole: "Mentee" }, // pending pick
    // G4 dual-role: Adam (sem 3) mentors MAT133/MAT183 AND studies MAT210 (his
    // own semester) as a mentee under Nadia. Proves a user can hold both.
    { userId: "u-006", courseId: "mat210", asRole: "Mentee" },

    // Mentors — capacity = mentee slots the admin granted for this offering.
    // MAT183 has TWO mentors so a sem-2 mentee gets a real choice.
    { userId: "u-006", courseId: "mat133", asRole: "Mentor", capacity: 4 }, // Adam, sem 3
    { userId: "u-006", courseId: "mat183", asRole: "Mentor", capacity: 4 }, // Adam, sem 3
    { userId: "u-008", courseId: "mat183", asRole: "Mentor", capacity: 3 }, // Daniel, sem 6
    { userId: "u-007", courseId: "mat210", asRole: "Mentor", capacity: 4 }, // Nadia, sem 5
    { userId: "u-008", courseId: "sta116", asRole: "Mentor", capacity: 3 }, // Daniel, sem 6
  ];
  await db.enrollment.createMany({ data: enrollments });

  // Sync the per-course enrolled counter so the UI shows the right number.
  for (const courseId of new Set(
    enrollments.filter((e) => e.asRole === "Mentee").map((e) => e.courseId),
  )) {
    const count = enrollments.filter(
      (e) => e.courseId === courseId && e.asRole === "Mentee",
    ).length;
    await db.course.update({ where: { id: courseId }, data: { enrolled: count } });
  }

  console.log("Seeding mentorship assignments (one mentor per mentee per course)…");
  await db.mentorshipAssignment.createMany({
    data: [
      // MAT133 mentees → Adam (sem 3)
      { menteeId: "u-001", mentorId: "u-006", courseId: "mat133" },
      { menteeId: "u-002", mentorId: "u-006", courseId: "mat133" },
      // MAT183 mentees → Adam (sem 3)
      { menteeId: "u-003", mentorId: "u-006", courseId: "mat183" },
      { menteeId: "u-004", mentorId: "u-006", courseId: "mat183" },
      // MAT210 mentees → Nadia (sem 5)
      { menteeId: "u-005", mentorId: "u-007", courseId: "mat210" },
      // Adam (mentor elsewhere) studies MAT210 under Nadia — dual-role demo.
      { menteeId: "u-006", mentorId: "u-007", courseId: "mat210" },
    ],
  });

  console.log("Seeding passed subjects (mentor eligibility evidence)…");
  await db.passedSubject.createMany({
    data: [
      // Adam (sem 3) passed sem 1 + sem 2
      { userId: "u-006", courseId: "mat133" },
      { userId: "u-006", courseId: "mat183" },
      // Nadia (sem 5) passed sem 1 to 4
      { userId: "u-007", courseId: "mat133" },
      { userId: "u-007", courseId: "mat183" },
      { userId: "u-007", courseId: "mat210" },
      { userId: "u-007", courseId: "sta116" },
      // Daniel (sem 6) passed sem 1 to 4
      { userId: "u-008", courseId: "mat133" },
      { userId: "u-008", courseId: "mat183" },
      { userId: "u-008", courseId: "mat210" },
      { userId: "u-008", courseId: "sta116" },
    ],
  });

  console.log("Seeding class sessions…");
  await db.classSession.createMany({
    data: [
      { id: "cls-01", courseId: "mat133", topic: "Functions and graphs",       date: new Date("2026-05-04"), time: "14:00", room: "BD-3, Block A", state: "Live",      format: "InPerson" },
      { id: "cls-02", courseId: "mat133", topic: "Trigonometric identities",   date: new Date("2026-05-06"), time: "14:00", room: "Online",        state: "Scheduled", format: "Online", meetingLink: "https://meet.google.com/abc-defg-hij" },
      { id: "cls-03", courseId: "mat183", topic: "Derivatives intuition",      date: new Date("2026-05-07"), time: "10:00", room: "Lab 2",          state: "Scheduled", format: "Hybrid", meetingLink: "https://meet.google.com/xyz-pqrs-tuv" },
      { id: "cls-04", courseId: "mat210", topic: "Graph theory primer",        date: new Date("2026-05-08"), time: "11:00", room: "Room 4-08",     state: "Scheduled", format: "InPerson" },
    ],
  });

  console.log("Seeding attendance sessions…");
  await db.attendanceSession.createMany({
    data: [
      { id: "ses-01", courseId: "mat133", classId: "cls-01", date: new Date("2026-05-04"), time: "14:00", room: "BD-3, Block A", expected: 2,  present: 0, state: "Live" },
      { id: "ses-02", courseId: "mat183", classId: "cls-03", date: new Date("2026-05-02"), time: "10:00", room: "Lab 2",          expected: 2,  present: 2, state: "Closed" },
      { id: "ses-03", courseId: "mat133", date: new Date("2026-04-29"), time: "14:00", room: "BD-3, Block A", expected: 2,  present: 2, state: "Closed" },
      { id: "ses-04", courseId: "mat210", date: new Date("2026-04-25"), time: "09:00", room: "BD-1, Block C", expected: 1,  present: 1, state: "Closed" },
    ],
  });

  console.log("Seeding mentee attendance records…");
  await db.menteeAttendance.createMany({
    data: [
      // ses-03, MAT133, both sem-1 mentees verified
      { sessionId: "ses-03", menteeId: "u-001", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-29T14:02"), verifiedAt: new Date("2026-04-29T14:04") },
      { sessionId: "ses-03", menteeId: "u-002", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-29T14:01"), verifiedAt: new Date("2026-04-29T14:04") },
      // ses-02, MAT183, both sem-2 mentees verified
      { sessionId: "ses-02", menteeId: "u-003", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-05-02T10:00"), verifiedAt: new Date("2026-05-02T10:02") },
      { sessionId: "ses-02", menteeId: "u-004", menteeConfirmed: true, mentorVerified: false, recognisedAt: new Date("2026-05-02T10:03") }, // pending mentor verify
      // ses-04, MAT210, single sem-3 mentee verified
      { sessionId: "ses-04", menteeId: "u-005", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-25T09:00"), verifiedAt: new Date("2026-04-25T09:03") },
    ],
  });

  console.log("Seeding assignments…");
  await db.assignment.createMany({
    data: [
      { id: "as-01", code: "PS-04",    title: "Functions, transformations, and inverses",   courseId: "mat133", issued: new Date("2026-04-22"), due: new Date("2026-05-06"), weight: 12, status: "Open",        submissions: 1, ofCount: 2,  type: "Problem Set", note: "Six problems on function composition, inverses, and transformations. Show working." },
      { id: "as-02", code: "LAB-02",   title: "Limit calculations and the squeeze theorem", courseId: "mat183", issued: new Date("2026-04-18"), due: new Date("2026-05-02"), weight: 10, status: "ClosingSoon", submissions: 2, ofCount: 2,  type: "Lab",         note: "Work through eight limit problems. Use the squeeze theorem on at least three." },
      { id: "as-03", code: "ESSAY-01", title: "Graphs in everyday networks",                 courseId: "mat210", issued: new Date("2026-04-12"), due: new Date("2026-04-30"), weight:  8, status: "Closed",      submissions: 1, ofCount: 1,  type: "Essay",       note: "Write 1200 to 1500 words. Pick a real-world network and analyse it as a graph." },
      { id: "as-04", code: "PS-05",    title: "Trigonometric identities, full proofs",       courseId: "mat133", issued: new Date("2026-05-02"), due: new Date("2026-05-16"), weight: 14, status: "Open",        submissions: 0, ofCount: 2,  type: "Problem Set", note: "Prove ten standard identities. Diagrams encouraged." },
    ],
  });

  console.log("Seeding assignment submissions (so grading has real work)…");
  await db.assignmentSubmission.createMany({
    data: [
      // as-01 PS-04 (MAT133, mentor Adam) — Aiman submitted, already graded.
      { assignmentId: "as-01", menteeId: "u-001", body: "My six function-composition problems with working shown.", linkUrl: "https://example.com/aiman-ps04", grade: "A-" },
      // as-02 LAB-02 (MAT183, mentor Adam) — two submissions, ungraded (to grade in demo).
      { assignmentId: "as-02", menteeId: "u-003", body: "Eight limit problems, squeeze theorem used on three.", linkUrl: "https://example.com/faris-lab02" },
      { assignmentId: "as-02", menteeId: "u-004", body: "Limit calculations attached. Unsure about problem 6." },
      // as-03 ESSAY-01 (MAT210, mentor Nadia) — Hafiz submitted, graded, closed.
      { assignmentId: "as-03", menteeId: "u-005", body: "1300-word essay analysing the KL rail network as a graph.", grade: "B+" },
    ],
  });

  console.log("Seeding discussion rooms + messages…");
  await db.discussionRoom.createMany({
    data: [
      { id: "rm-01", title: "Pre-calc study group, Thursdays",     courseId: "mat133", starterId: "u-001", members: 2, posts: 4, pinned: true,  excerpt: "Anyone want to work through the function-composition worksheet together?", lastAt: new Date() },
      { id: "rm-02", title: "Office hours, Adam, Thursday 14:00",  courseId: "mat133", starterId: "u-006", members: 2, posts: 1, pinned: true,  excerpt: "Bring questions on transformations and inverses. Room 4-08.", lastAt: new Date() },
      { id: "rm-03", title: "Limits intuition, the cleanest take", courseId: "mat183", starterId: "u-003", members: 2, posts: 2, pinned: false, excerpt: "I keep slipping on epsilon-delta proofs. What's the trick that finally clicked for you?", lastAt: new Date() },
      { id: "rm-04", title: "Graph theory primer for MAT210",      courseId: "mat210", starterId: "u-007", members: 1, posts: 1, pinned: false, excerpt: "A short note on terminology before Wednesday's class. Reply if anything is unclear.", lastAt: new Date() },
    ],
  });

  await db.discussionMessage.createMany({
    data: [
      // rm-01, MAT133 study group
      { roomId: "rm-01", authorId: "u-001", time: "10:02", body: "Anyone want to work through the function-composition worksheet together? Library, Thursday 4pm." },
      { roomId: "rm-01", authorId: "u-002", time: "10:14", body: "I'm in. I keep getting stuck on inverse functions, the algebra trips me up." },
      { roomId: "rm-01", authorId: "u-006", time: "11:00", body: "Good. Bring questions, I will sit in for the first 30 minutes." },
      { roomId: "rm-01", authorId: "u-001", time: "11:05", body: "Thanks Adam, see you there." },

      // rm-02, Adam's office hours
      { roomId: "rm-02", authorId: "u-006", time: "08:30", body: "Office hours this Thursday 14:00, Room 4-08. Bring questions on transformations and inverses." },

      // rm-03, MAT183 limits
      { roomId: "rm-03", authorId: "u-003", time: "20:14", body: "I keep slipping on epsilon-delta proofs. What's the trick that finally clicked for you?" },
      { roomId: "rm-03", authorId: "u-006", time: "20:31", body: "Think of epsilon as the tolerance you want, then back-solve for delta. Don't try to be clever, just be neat." },

      // rm-04, MAT210 graphs
      { roomId: "rm-04", authorId: "u-007", time: "09:00", body: "Quick primer before Wednesday: vertices, edges, degree, paths, cycles. Reply if any of these terms feel fuzzy." },
    ],
  });

  console.log("Seeding feedback…");
  await db.feedbackEntry.createMany({
    data: [
      { courseId: "mat133", mentorId: "u-006", score: 4.7, n: 12, comment: "Patient and clear. Made trigonometry click for me." },
      { courseId: "mat183", mentorId: "u-006", score: 4.4, n: 8,  comment: "Limits walkthrough was the most useful resource of the term." },
      { courseId: "mat210", mentorId: "u-007", score: 4.6, n: 5,  comment: "Loved the graph theory primer. Peer office hours were generous." },
    ],
  });

  console.log("Seeding evaluation rubrics…");
  await db.evaluationRubric.createMany({
    data: [
      { id: "rub-01", title: "End-of-term mentor evaluation", target: "Mentor", scale: 5, active: true,
        items: ["Pacing of peer sessions", "Clarity of explanation", "Quality of feedback on work", "Availability outside class", "Fairness in grading"] },
      { id: "rub-02", title: "Peer review, mentee to mentee", target: "Mentee", scale: 5, active: true,
        items: ["Contribution to group", "Communication", "Reliability"] },
      { id: "rub-03", title: "Course quality survey", target: "Course", scale: 5, active: false,
        items: ["Difficulty appropriate", "Workload reasonable", "Materials helpful"] },
    ],
  });

  console.log("Done.");
  console.log("  Sem 1, MAT133 Pre Calculus");
  console.log("  Sem 2, MAT183 Calculus I");
  console.log("  Sem 3, MAT210 Discrete Mathematics");
  console.log("  Sem 4, STA116 Introduction to Probability and Statistics");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
