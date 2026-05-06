// Hardcoded data for EduMentor. Numbers are illustrative.

export type Role = "Admin" | "Mentor" | "Mentee";

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

export type Course = {
  id: string;
  code: string;
  title: string;
  mentor: string;
  lecturer: string;
  cohort: string;
  semester: Semester;
  enrolled: number;
  capacity: number;
  sessions: number;
  pace: string;
  color: string;
  abstract: string;
  progress: number;
};

export const COURSES: Course[] = [
  {
    id: "cs110",
    code: "MAT CS110",
    title: "Discrete Structures for Computing",
    mentor: "Adam Iskandar Razak",
    lecturer: "Dr. Aishah Mokhtar",
    cohort: "B.Sc. CS, Year 1",
    semester: 1,
    enrolled: 48,
    capacity: 60,
    sessions: 24,
    pace: "Tue & Thu, 14:00",
    color: "oxblood",
    abstract:
      "Foundations of logic, sets, relations, graphs, and combinatorics with directed application toward algorithmic thinking.",
    progress: 64,
  },
  {
    id: "stat101",
    code: "STA 116",
    title: "Statistical Reasoning",
    mentor: "Adam Iskandar Razak",
    lecturer: "Dr. Aishah Mokhtar",
    cohort: "B.Sc. CS, Year 1",
    semester: 1,
    enrolled: 51,
    capacity: 80,
    sessions: 22,
    pace: "Wed, 11:00",
    color: "ink",
    abstract:
      "Sampling, inference, and elementary Bayesian thinking with R-based labs.",
    progress: 73,
  },
  {
    id: "cs220",
    code: "CSC 234",
    title: "Algorithms in Practice",
    mentor: "Nadia Aiman Zulkifli",
    lecturer: "Dr. Faiz Rashid",
    cohort: "B.Sc. CS, Year 2",
    semester: 3,
    enrolled: 32,
    capacity: 40,
    sessions: 20,
    pace: "Mon & Wed, 10:00",
    color: "fern",
    abstract:
      "Design and analysis of algorithms with weekly contest-style problem sets and lab evaluations.",
    progress: 41,
  },
  {
    id: "mat210",
    code: "MAT 210",
    title: "Linear Algebra for ML",
    mentor: "Daniel Hakimi Othman",
    lecturer: "Pn. Liyana Hashim",
    cohort: "B.Sc. CS, Year 2",
    semester: 4,
    enrolled: 27,
    capacity: 40,
    sessions: 18,
    pace: "Fri, 09:00",
    color: "saffron",
    abstract:
      "Matrices, vector spaces, eigenstructure, and PCA, oriented toward machine learning intuition.",
    progress: 28,
  },
];

// Mentees can only join subjects taught in their current semester.
export function coursesForMentee(semester: Semester) {
  return COURSES.filter((c) => c.semester === semester);
}

// Mentors can only mentor subjects from semesters they have already passed.
export function coursesForMentor(semester: Semester) {
  return COURSES.filter((c) => c.semester < semester);
}

export const ROOMS = [
  {
    id: "rm-01",
    title: "Proof by induction, again",
    course: "MAT CS110",
    starter: "Aiman Hakimi",
    role: "Mentee",
    members: 14,
    posts: 38,
    last: "2 minutes ago",
    pinned: true,
    excerpt:
      "I keep losing the inductive step on tree problems. Has anyone written a checklist they trust?",
  },
  {
    id: "rm-02",
    title: "Peer office hours, Thursday",
    course: "MAT CS110",
    starter: "Adam Iskandar Razak",
    role: "Mentor",
    members: 48,
    posts: 12,
    last: "Today, 09:14",
    pinned: true,
    excerpt:
      "Bring questions on relations and partial orders. I will be in the study room from 14:00 to 16:00.",
  },
  {
    id: "rm-03",
    title: "Eulerian paths, weekend reading",
    course: "CSC 234",
    starter: "Faris Adlan",
    role: "Mentee",
    members: 9,
    posts: 21,
    last: "Yesterday, 22:40",
    pinned: false,
    excerpt:
      "Sharing a short note that finally made the parity argument click for me.",
  },
  {
    id: "rm-04",
    title: "Eigenvectors as directions",
    course: "MAT 210",
    starter: "Daniel Hakimi Othman",
    role: "Mentor",
    members: 27,
    posts: 8,
    last: "Sat, 11:02",
    pinned: false,
    excerpt:
      "A quick visual prompt before Friday's lab. Reply with one image that captures the idea.",
  },
];

export const MESSAGES = [
  {
    id: "m1",
    author: "Adam Iskandar Razak",
    role: "Mentor",
    time: "14:02",
    body: "Welcome back. We will be picking up where we paused on strong induction. Skim Rosen 5.2 if you have not.",
  },
  {
    id: "m2",
    author: "Aiman Hakimi",
    role: "Mentee",
    time: "14:04",
    body: "Question. For the proof on binary trees, does the inductive hypothesis assume both subtrees, or just one of them?",
  },
  {
    id: "m3",
    author: "Nur Sofea",
    role: "Mentee",
    time: "14:06",
    body: "I think the trick is to assume for all smaller trees, then split, that gave me a cleaner argument last week.",
  },
  {
    id: "m4",
    author: "Adam Iskandar Razak",
    role: "Mentor",
    time: "14:07",
    body: "Right. Strong induction over the size of the tree is what you want. Let me write the skeleton on the board.",
  },
  {
    id: "m5",
    author: "Faris Adlan",
    role: "Mentee",
    time: "14:09",
    body: "Mind sharing the board photo afterwards? I am revising the same proof on a leaf-counting variant.",
  },
];

export const ASSIGNMENTS = [
  {
    id: "as-01",
    code: "PS-04",
    title: "Relations, equivalence classes, partitions",
    course: "MAT CS110",
    issued: "Apr 22",
    due: "May 06",
    weight: 12,
    status: "Open",
    submissions: 31,
    of: 48,
    type: "Problem Set",
    note: "Six problems, write proofs by hand or in LaTeX. Late submissions lose two points per day.",
  },
  {
    id: "as-02",
    code: "LAB-02",
    title: "Graph traversal: DFS and topological sort",
    course: "CSC 234",
    issued: "Apr 18",
    due: "May 02",
    weight: 10,
    status: "Closing soon",
    submissions: 28,
    of: 32,
    type: "Lab",
    note: "Implement in Python or Rust, attach a short write-up of complexity.",
  },
  {
    id: "as-03",
    code: "ESSAY-01",
    title: "Vectors, intuition, and image compression",
    course: "MAT 210",
    issued: "Apr 12",
    due: "Apr 30",
    weight: 8,
    status: "Closed",
    submissions: 27,
    of: 27,
    type: "Essay",
    note: "Write 1200 to 1500 words, cite at least two papers, bring an example you ran in numpy.",
  },
  {
    id: "as-04",
    code: "PS-05",
    title: "Combinatorial identities and a bijective proof",
    course: "MAT CS110",
    issued: "May 02",
    due: "May 16",
    weight: 14,
    status: "Open",
    submissions: 4,
    of: 48,
    type: "Problem Set",
    note: "Choose one identity and prove it bijectively. Diagrams encouraged.",
  },
];

export const ATTENDANCE_SESSIONS = [
  {
    id: "ses-01",
    date: "2026-05-04",
    time: "14:00",
    course: "MAT CS110",
    room: "BD-3, Block A",
    expected: 48,
    present: 0,
    state: "Live",
  },
  {
    id: "ses-02",
    date: "2026-05-02",
    time: "10:00",
    course: "CSC 234",
    room: "Lab 2",
    expected: 32,
    present: 30,
    state: "Closed",
  },
  {
    id: "ses-03",
    date: "2026-04-29",
    time: "14:00",
    course: "MAT CS110",
    room: "BD-3, Block A",
    expected: 48,
    present: 44,
    state: "Closed",
  },
  {
    id: "ses-04",
    date: "2026-04-25",
    time: "09:00",
    course: "MAT 210",
    room: "BD-1, Block C",
    expected: 27,
    present: 25,
    state: "Closed",
  },
];

export const ROSTER = [
  { id: "stu-01", name: "Aiman Hakimi", matric: "2023607832", checked: true },
  { id: "stu-02", name: "Nur Sofea Rashid", matric: "2023608112", checked: true },
  { id: "stu-03", name: "Faris Adlan", matric: "2023611901", checked: true },
  { id: "stu-04", name: "Liyana Aziz", matric: "2023612200", checked: false },
  { id: "stu-05", name: "Hafiz Ridzwan", matric: "2023612555", checked: true },
  { id: "stu-06", name: "Iman Yusoff", matric: "2023612823", checked: false },
  { id: "stu-07", name: "Khalid Mansor", matric: "2023613001", checked: true },
  { id: "stu-08", name: "Marina Tan", matric: "2023613310", checked: true },
];

export const FEEDBACK_ENTRIES = [
  {
    id: "fb-01",
    course: "MAT CS110",
    mentor: "Adam Iskandar Razak",
    score: 4.7,
    n: 41,
    comment:
      "Patient and clear. The induction worksheets were the most useful resource of the term, even better than the lecture slides.",
    by: "Anonymous mentee",
  },
  {
    id: "fb-02",
    course: "CSC 234",
    mentor: "Nadia Aiman Zulkifli",
    score: 4.4,
    n: 29,
    comment:
      "Lab pacing improved after week three. Slides could be tighter in the algorithms unit.",
    by: "Anonymous mentee",
  },
  {
    id: "fb-03",
    course: "MAT 210",
    mentor: "Daniel Hakimi Othman",
    score: 4.6,
    n: 24,
    comment:
      "Visual intuition for eigenvectors finally clicked. Peer office hours were generous.",
    by: "Anonymous mentee",
  },
];

export const EVENTS = [
  {
    when: "Today, 14:00",
    course: "MAT CS110",
    title: "Lecture: Strong induction on trees",
    place: "BD-3, Block A",
    state: "now",
  },
  {
    when: "Today, 16:30",
    course: "MAT CS110",
    title: "Discussion room: PS-04 walkthrough",
    place: "Online",
    state: "soon",
  },
  {
    when: "Tue, 09:00",
    course: "CSC 234",
    title: "Lab: Topological sort warmup",
    place: "Lab 2",
    state: "later",
  },
  {
    when: "Thu, 14:00",
    course: "MAT CS110",
    title: "Peer office hours with Adam",
    place: "Room 4-08",
    state: "later",
  },
];

export const STATS = [
  { label: "Active courses", value: "04", caption: "this semester" },
  { label: "Mentees enrolled", value: "158", caption: "across cohorts" },
  { label: "Student mentors", value: "12", caption: "across all faculties" },
  { label: "Attendance accuracy", value: "98.4%", caption: "face recognition, last 30 days" },
];

export type AppUser = {
  id: string;
  name: string;
  identity: string;
  role: Role;
  status: string;
  joined: string;
  // Current semester for students (mentees and mentors). Lecturers omit this.
  semester?: Semester;
  // Course IDs the user is paired with this term.
  // Mentees: subjects they joined (must match their semester).
  // Mentors: subjects they mentor (must be from semesters they passed).
  courses?: string[];
};

export const USERS: AppUser[] = [
  // Mentees, all in semester 1.
  { id: "u-001", name: "Aiman Hakimi",     identity: "2023607832", role: "Mentee", status: "Active",    joined: "2024-09-01", semester: 1, courses: ["cs110", "stat101"] },
  { id: "u-002", name: "Nur Sofea Rashid", identity: "2023608112", role: "Mentee", status: "Active",    joined: "2024-09-01", semester: 1, courses: ["cs110"] },
  { id: "u-003", name: "Faris Adlan",      identity: "2023611901", role: "Mentee", status: "Active",    joined: "2024-09-01", semester: 1, courses: ["cs110", "stat101"] },
  { id: "u-004", name: "Liyana Aziz",      identity: "2023612200", role: "Mentee", status: "Probation", joined: "2024-09-01", semester: 1, courses: ["stat101"] },
  { id: "u-005", name: "Hafiz Ridzwan",    identity: "2023612555", role: "Mentee", status: "Active",    joined: "2024-09-01", semester: 1, courses: ["cs110"] },
  // Mentors, matric from earlier intakes (2021/2022).
  // Adam (sem 3) mentors sem 1 subjects, Nadia (sem 5) mentors sem 3, Daniel (sem 6) mentors sem 4.
  { id: "u-006", name: "Adam Iskandar Razak",  identity: "2022613001", role: "Mentor", status: "Active", joined: "2022-09-01", semester: 3, courses: ["cs110", "stat101"] },
  { id: "u-007", name: "Nadia Aiman Zulkifli", identity: "2022613055", role: "Mentor", status: "Active", joined: "2022-09-01", semester: 5, courses: ["cs220"] },
  { id: "u-008", name: "Daniel Hakimi Othman", identity: "2021607123", role: "Mentor", status: "Active", joined: "2021-09-01", semester: 6, courses: ["mat210"] },
  // Lecturers (Admins), FCMS staff numbers.
  { id: "u-009", name: "Dr. Aishah Mokhtar",   identity: "FCMS-184", role: "Admin", status: "Active", joined: "2018-02-12" },
  { id: "u-010", name: "Dr. Faiz Rashid",      identity: "FCMS-209", role: "Admin", status: "Active", joined: "2020-08-04" },
  { id: "u-011", name: "Pn. Liyana Hashim",    identity: "FCMS-232", role: "Admin", status: "Active", joined: "2022-01-10" },
];

export const EVALUATION_RUBRICS = [
  {
    id: "rub-01",
    title: "End-of-term mentor evaluation",
    target: "Mentor",
    items: [
      "Pacing of peer sessions",
      "Clarity of explanation",
      "Quality of feedback on work",
      "Availability outside class",
      "Fairness in grading",
    ],
    scale: 5,
    active: true,
  },
  {
    id: "rub-02",
    title: "Peer review (mentee to mentee)",
    target: "Mentee",
    items: ["Contribution to group", "Communication", "Reliability"],
    scale: 5,
    active: true,
  },
  {
    id: "rub-03",
    title: "Course quality survey",
    target: "Course",
    items: ["Difficulty appropriate", "Workload reasonable", "Materials helpful"],
    scale: 5,
    active: false,
  },
];

export type ClassFormat = "In person" | "Online" | "Hybrid";

export type ClassSession = {
  id: string;
  course: string;
  topic: string;
  date: string;
  time: string;
  room: string;
  state: "Live" | "Scheduled" | "Closed";
  format: ClassFormat;
  meetingLink?: string;
};

export const CLASSES: ClassSession[] = [
  { id: "cls-01", course: "MAT CS110", topic: "Strong induction on trees",   date: "2026-05-04", time: "14:00", room: "BD-3, Block A", state: "Live",      format: "In person" },
  { id: "cls-02", course: "MAT CS110", topic: "Bijective proofs walkthrough", date: "2026-05-06", time: "14:00", room: "Online",        state: "Scheduled", format: "Online", meetingLink: "https://meet.google.com/abc-defg-hij" },
  { id: "cls-03", course: "CSC 234",   topic: "Topological sort lab",         date: "2026-05-07", time: "10:00", room: "Lab 2",          state: "Scheduled", format: "Hybrid", meetingLink: "https://meet.google.com/xyz-pqrs-tuv" },
  { id: "cls-04", course: "MAT CS110", topic: "Peer office hours",            date: "2026-05-08", time: "14:00", room: "Room 4-08",      state: "Scheduled", format: "In person" },
];
