// Seed script ports the original hardcoded data from lib/data.ts into MySQL.
// Idempotent: clears existing rows in dependency order before inserting.

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const adapter = new PrismaMariaDb(url);
const db = new PrismaClient({ adapter });

// Code → course id helper, mirrors the demo's "MAT CS110" → "cs110" mapping
const courseCode = {
  "MAT CS110": "cs110",
  "STA 116": "stat101",
  "CSC 234": "cs220",
  "MAT 210": "mat210",
} as const;

async function main() {
  console.log("Clearing existing rows…");
  await db.menteeAttendance.deleteMany();
  await db.attendanceSession.deleteMany();
  await db.assignment.deleteMany();
  await db.discussionMessage.deleteMany();
  await db.discussionRoom.deleteMany();
  await db.feedbackEntry.deleteMany();
  await db.classSession.deleteMany();
  await db.enrollment.deleteMany();
  await db.passedSubject.deleteMany();
  await db.evaluationRubric.deleteMany();
  await db.course.deleteMany();
  await db.user.deleteMany();

  console.log("Seeding users…");
  await db.user.createMany({
    data: [
      // Lecturers (admins)
      { id: "u-009", name: "Dr. Aishah Mokhtar", identity: "FCMS-184", role: "Admin", status: "Active", joined: new Date("2018-02-12") },
      { id: "u-010", name: "Dr. Faiz Rashid",    identity: "FCMS-209", role: "Admin", status: "Active", joined: new Date("2020-08-04") },
      { id: "u-011", name: "Pn. Liyana Hashim",  identity: "FCMS-232", role: "Admin", status: "Active", joined: new Date("2022-01-10") },
      // Mentors
      { id: "u-006", name: "Adam Iskandar Razak",  identity: "2022613001", role: "Mentor", status: "Active", joined: new Date("2022-09-01"), semester: 3, cgpa: 3.68 },
      { id: "u-007", name: "Nadia Aiman Zulkifli", identity: "2022613055", role: "Mentor", status: "Active", joined: new Date("2022-09-01"), semester: 5, cgpa: 3.81 },
      { id: "u-008", name: "Daniel Hakimi Othman", identity: "2021607123", role: "Mentor", status: "Active", joined: new Date("2021-09-01"), semester: 6, cgpa: 3.92 },
      // Mentees
      { id: "u-001", name: "Aiman Hakimi",     identity: "2023607832", role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.74 },
      { id: "u-002", name: "Nur Sofea Rashid", identity: "2023608112", role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.55 },
      { id: "u-003", name: "Faris Adlan",      identity: "2023611901", role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.31 },
      { id: "u-004", name: "Liyana Aziz",      identity: "2023612200", role: "Mentee", status: "Probation", joined: new Date("2024-09-01"), semester: 1, cgpa: 2.41 },
      { id: "u-005", name: "Hafiz Ridzwan",    identity: "2023612555", role: "Mentee", status: "Active",    joined: new Date("2024-09-01"), semester: 1, cgpa: 3.62 },
    ],
  });

  console.log("Seeding courses…");
  await db.course.createMany({
    data: [
      {
        id: "cs110", code: "MAT CS110", title: "Discrete Structures for Computing",
        cohort: "B.Sc. CS, Year 1", semester: 1, capacity: 60, enrolled: 48, pace: "Tue & Thu, 14:00",
        color: "oxblood", progress: 64, sessions: 24, lecturerId: "u-009",
        abstract: "Foundations of logic, sets, relations, graphs, and combinatorics with directed application toward algorithmic thinking.",
      },
      {
        id: "stat101", code: "STA 116", title: "Statistical Reasoning",
        cohort: "B.Sc. CS, Year 1", semester: 1, capacity: 80, enrolled: 51, pace: "Wed, 11:00",
        color: "ink", progress: 73, sessions: 22, lecturerId: "u-009",
        abstract: "Sampling, inference, and elementary Bayesian thinking with R-based labs.",
      },
      {
        id: "cs220", code: "CSC 234", title: "Algorithms in Practice",
        cohort: "B.Sc. CS, Year 2", semester: 3, capacity: 40, enrolled: 32, pace: "Mon & Wed, 10:00",
        color: "fern", progress: 41, sessions: 20, lecturerId: "u-010",
        abstract: "Design and analysis of algorithms with weekly contest-style problem sets and lab evaluations.",
      },
      {
        id: "mat210", code: "MAT 210", title: "Linear Algebra for ML",
        cohort: "B.Sc. CS, Year 2", semester: 4, capacity: 40, enrolled: 27, pace: "Fri, 09:00",
        color: "saffron", progress: 28, sessions: 18, lecturerId: "u-011",
        abstract: "Matrices, vector spaces, eigenstructure, and PCA, oriented toward machine learning intuition.",
      },
    ],
  });

  console.log("Seeding enrollments…");
  const enrollments: { userId: string; courseId: string; asRole: "Mentor" | "Mentee" }[] = [
    // Mentees
    { userId: "u-001", courseId: "cs110",   asRole: "Mentee" },
    { userId: "u-001", courseId: "stat101", asRole: "Mentee" },
    { userId: "u-002", courseId: "cs110",   asRole: "Mentee" },
    { userId: "u-003", courseId: "cs110",   asRole: "Mentee" },
    { userId: "u-003", courseId: "stat101", asRole: "Mentee" },
    { userId: "u-004", courseId: "stat101", asRole: "Mentee" },
    { userId: "u-005", courseId: "cs110",   asRole: "Mentee" },
    // Mentors
    { userId: "u-006", courseId: "cs110",   asRole: "Mentor" },
    { userId: "u-006", courseId: "stat101", asRole: "Mentor" },
    { userId: "u-007", courseId: "cs220",   asRole: "Mentor" },
    { userId: "u-008", courseId: "mat210",  asRole: "Mentor" },
  ];
  await db.enrollment.createMany({ data: enrollments });

  console.log("Seeding passed subjects…");
  const passed: { userId: string; courseId: string }[] = [
    // Adam passed sem 1 subjects
    { userId: "u-006", courseId: "cs110" },
    { userId: "u-006", courseId: "stat101" },
    // Nadia passed sem 1 + sem 3
    { userId: "u-007", courseId: "cs110" },
    { userId: "u-007", courseId: "stat101" },
    { userId: "u-007", courseId: "cs220" },
    // Daniel passed sem 1, 3, 4
    { userId: "u-008", courseId: "cs110" },
    { userId: "u-008", courseId: "stat101" },
    { userId: "u-008", courseId: "cs220" },
    { userId: "u-008", courseId: "mat210" },
  ];
  await db.passedSubject.createMany({ data: passed });

  console.log("Seeding class sessions…");
  await db.classSession.createMany({
    data: [
      { id: "cls-01", courseId: "cs110",  topic: "Strong induction on trees",   date: new Date("2026-05-04"), time: "14:00", room: "BD-3, Block A", state: "Live",      format: "InPerson" },
      { id: "cls-02", courseId: "cs110",  topic: "Bijective proofs walkthrough", date: new Date("2026-05-06"), time: "14:00", room: "Online",        state: "Scheduled", format: "Online", meetingLink: "https://meet.google.com/abc-defg-hij" },
      { id: "cls-03", courseId: "cs220",  topic: "Topological sort lab",         date: new Date("2026-05-07"), time: "10:00", room: "Lab 2",          state: "Scheduled", format: "Hybrid", meetingLink: "https://meet.google.com/xyz-pqrs-tuv" },
      { id: "cls-04", courseId: "cs110",  topic: "Peer office hours",            date: new Date("2026-05-08"), time: "14:00", room: "Room 4-08",      state: "Scheduled", format: "InPerson" },
    ],
  });

  console.log("Seeding attendance sessions…");
  await db.attendanceSession.createMany({
    data: [
      { id: "ses-01", courseId: "cs110",  date: new Date("2026-05-04"), time: "14:00", room: "BD-3, Block A", expected: 48, present: 0,  state: "Live" },
      { id: "ses-02", courseId: "cs220",  date: new Date("2026-05-02"), time: "10:00", room: "Lab 2",          expected: 32, present: 30, state: "Closed" },
      { id: "ses-03", courseId: "cs110",  date: new Date("2026-04-29"), time: "14:00", room: "BD-3, Block A", expected: 48, present: 44, state: "Closed" },
      { id: "ses-04", courseId: "mat210", date: new Date("2026-04-25"), time: "09:00", room: "BD-1, Block C", expected: 27, present: 25, state: "Closed" },
    ],
  });

  console.log("Seeding mentee attendance records…");
  await db.menteeAttendance.createMany({
    data: [
      { sessionId: "ses-03", menteeId: "u-001", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-29T14:02"), verifiedAt: new Date("2026-04-29T14:04") },
      { sessionId: "ses-03", menteeId: "u-002", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-29T14:01"), verifiedAt: new Date("2026-04-29T14:04") },
      { sessionId: "ses-03", menteeId: "u-003", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-29T14:03"), verifiedAt: new Date("2026-04-29T14:05") },
      { sessionId: "ses-03", menteeId: "u-005", menteeConfirmed: true, mentorVerified: false, recognisedAt: new Date("2026-04-29T14:08") },
      { sessionId: "ses-02", menteeId: "u-001", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-05-02T10:00"), verifiedAt: new Date("2026-05-02T10:02") },
      { sessionId: "ses-02", menteeId: "u-003", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-05-02T10:01"), verifiedAt: new Date("2026-05-02T10:02") },
      { sessionId: "ses-04", menteeId: "u-001", menteeConfirmed: true, mentorVerified: true,  recognisedAt: new Date("2026-04-25T09:00"), verifiedAt: new Date("2026-04-25T09:03") },
    ],
  });

  console.log("Seeding assignments…");
  await db.assignment.createMany({
    data: [
      { id: "as-01", code: "PS-04",    title: "Relations, equivalence classes, partitions",   courseId: "cs110", issued: new Date("2026-04-22"), due: new Date("2026-05-06"), weight: 12, status: "Open",        submissions: 31, ofCount: 48, type: "Problem Set", note: "Six problems, write proofs by hand or in LaTeX. Late submissions lose two points per day." },
      { id: "as-02", code: "LAB-02",   title: "Graph traversal: DFS and topological sort",   courseId: "cs220", issued: new Date("2026-04-18"), due: new Date("2026-05-02"), weight: 10, status: "ClosingSoon", submissions: 28, ofCount: 32, type: "Lab",         note: "Implement in Python or Rust, attach a short write-up of complexity." },
      { id: "as-03", code: "ESSAY-01", title: "Vectors, intuition, and image compression",   courseId: "mat210", issued: new Date("2026-04-12"), due: new Date("2026-04-30"), weight:  8, status: "Closed",      submissions: 27, ofCount: 27, type: "Essay",       note: "Write 1200 to 1500 words, cite at least two papers, bring an example you ran in numpy." },
      { id: "as-04", code: "PS-05",    title: "Combinatorial identities and a bijective proof", courseId: "cs110", issued: new Date("2026-05-02"), due: new Date("2026-05-16"), weight: 14, status: "Open",        submissions:  4, ofCount: 48, type: "Problem Set", note: "Choose one identity and prove it bijectively. Diagrams encouraged." },
    ],
  });

  console.log("Seeding discussion rooms + messages…");
  await db.discussionRoom.createMany({
    data: [
      { id: "rm-01", title: "Proof by induction, again",        courseId: "cs110", starterId: "u-001", members: 14, posts: 38, pinned: true,  excerpt: "I keep losing the inductive step on tree problems. Has anyone written a checklist they trust?", lastAt: new Date() },
      { id: "rm-02", title: "Peer office hours, Thursday",      courseId: "cs110", starterId: "u-006", members: 48, posts: 12, pinned: true,  excerpt: "Bring questions on relations and partial orders. I will be in the study room from 14:00 to 16:00.", lastAt: new Date() },
      { id: "rm-03", title: "Eulerian paths, weekend reading",  courseId: "cs220", starterId: "u-003", members:  9, posts: 21, pinned: false, excerpt: "Sharing a short note that finally made the parity argument click for me.", lastAt: new Date() },
      { id: "rm-04", title: "Eigenvectors as directions",       courseId: "mat210", starterId: "u-008", members: 27, posts:  8, pinned: false, excerpt: "A quick visual prompt before Friday's lab. Reply with one image that captures the idea.", lastAt: new Date() },
    ],
  });

  await db.discussionMessage.createMany({
    data: [
      { authorId: "u-006", time: "14:02", body: "Welcome back. We will be picking up where we paused on strong induction. Skim Rosen 5.2 if you have not." },
      { authorId: "u-001", time: "14:04", body: "Question. For the proof on binary trees, does the inductive hypothesis assume both subtrees, or just one of them?" },
      { authorId: "u-002", time: "14:06", body: "I think the trick is to assume for all smaller trees, then split, that gave me a cleaner argument last week." },
      { authorId: "u-006", time: "14:07", body: "Right. Strong induction over the size of the tree is what you want. Let me write the skeleton on the board." },
      { authorId: "u-003", time: "14:09", body: "Mind sharing the board photo afterwards? I am revising the same proof on a leaf-counting variant." },
    ],
  });

  console.log("Seeding feedback…");
  await db.feedbackEntry.createMany({
    data: [
      { courseId: "cs110",  mentorId: "u-006", score: 4.7, n: 41, comment: "Patient and clear. The induction worksheets were the most useful resource of the term, even better than the lecture slides." },
      { courseId: "cs220",  mentorId: "u-007", score: 4.4, n: 29, comment: "Lab pacing improved after week three. Slides could be tighter in the algorithms unit." },
      { courseId: "mat210", mentorId: "u-008", score: 4.6, n: 24, comment: "Visual intuition for eigenvectors finally clicked. Peer office hours were generous." },
    ],
  });

  console.log("Seeding evaluation rubrics…");
  await db.evaluationRubric.createMany({
    data: [
      { id: "rub-01", title: "End-of-term mentor evaluation", target: "Mentor", scale: 5, active: true,
        items: ["Pacing of peer sessions", "Clarity of explanation", "Quality of feedback on work", "Availability outside class", "Fairness in grading"] },
      { id: "rub-02", title: "Peer review (mentee to mentee)", target: "Mentee", scale: 5, active: true,
        items: ["Contribution to group", "Communication", "Reliability"] },
      { id: "rub-03", title: "Course quality survey", target: "Course", scale: 5, active: false,
        items: ["Difficulty appropriate", "Workload reasonable", "Materials helpful"] },
    ],
  });

  console.log("Done.");
  console.log(`  ${courseCode["MAT CS110"]} = MAT CS110 (sanity check)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
