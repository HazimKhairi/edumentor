// Hardcoded data for EduMentor. Numbers are illustrative.

export type Role = "Admin" | "Mentor" | "Mentee";

export const SUBJECT = {
  code: "MAT CS110",
  title: "Discrete Structures for Computing",
  faculty: "Faculty of Computer & Mathematical Sciences",
  semester: "Semester 02 / 2026",
};

export const ROLES: {
  key: Role;
  abbr: string;
  oneLiner: string;
  duties: string[];
}[] = [
  {
    key: "Admin",
    abbr: "ADM",
    oneLiner: "Steward of the academic record.",
    duties: [
      "Manage course catalogue",
      "Govern user accounts",
      "Add evaluation rubrics",
      "Issue performance reports",
    ],
  },
  {
    key: "Mentor",
    abbr: "MNT",
    oneLiner: "Conductor of the mentee cohort.",
    duties: [
      "Create classes and rooms",
      "Issue and review assignments",
      "Tick attendance with face recognition",
      "Publish reading and feedback",
    ],
  },
  {
    key: "Mentee",
    abbr: "MNE",
    oneLiner: "Author of the personal study log.",
    duties: [
      "Enroll in courses",
      "Submit assignments and reflections",
      "Join discussions and live class",
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

export const COURSES = [
  {
    id: "cs110",
    code: "MAT CS110",
    title: "Discrete Structures for Computing",
    mentor: "Dr. Aishah Mokhtar",
    cohort: "B.Sc. CS, Year 1",
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
    id: "cs220",
    code: "CSC 234",
    title: "Algorithms in Practice",
    mentor: "Encik Faiz Rashid",
    cohort: "B.Sc. CS, Year 2",
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
    mentor: "Pn. Liyana Hashim",
    cohort: "B.Sc. CS, Year 2",
    enrolled: 27,
    capacity: 40,
    sessions: 18,
    pace: "Fri, 09:00",
    color: "saffron",
    abstract:
      "Matrices, vector spaces, eigenstructure, and PCA, oriented toward machine learning intuition.",
    progress: 28,
  },
  {
    id: "stat101",
    code: "STA 116",
    title: "Statistical Reasoning",
    mentor: "Dr. Aishah Mokhtar",
    cohort: "Foundation",
    enrolled: 51,
    capacity: 80,
    sessions: 22,
    pace: "Wed, 11:00",
    color: "ink",
    abstract:
      "Sampling, inference, and elementary Bayesian thinking with R-based labs.",
    progress: 73,
  },
];

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
    title: "Office hours, Thursday",
    course: "MAT CS110",
    starter: "Dr. Aishah Mokhtar",
    role: "Mentor",
    members: 48,
    posts: 12,
    last: "Today, 09:14",
    pinned: true,
    excerpt:
      "Bring questions on relations and partial orders. I will leave the door open from 14:00 to 16:00.",
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
    starter: "Pn. Liyana Hashim",
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
    author: "Dr. Aishah Mokhtar",
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
    author: "Dr. Aishah Mokhtar",
    role: "Mentor",
    time: "14:07",
    body: "Right. Strong induction over the size of the tree is what you want. I will write the skeleton on the board.",
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
    mentor: "Dr. Aishah Mokhtar",
    score: 4.7,
    n: 41,
    comment:
      "Patient and rigorous. The induction worksheets were the most useful resource of the term.",
    by: "Anonymous mentee",
  },
  {
    id: "fb-02",
    course: "CSC 234",
    mentor: "Encik Faiz Rashid",
    score: 4.4,
    n: 29,
    comment:
      "Lab pacing improved after week three. Slides could be tighter in the algorithms unit.",
    by: "Anonymous mentee",
  },
  {
    id: "fb-03",
    course: "MAT 210",
    mentor: "Pn. Liyana Hashim",
    score: 4.6,
    n: 24,
    comment:
      "Visual intuition for eigenvectors finally clicked. Office hours were generous.",
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
    title: "Office hours with Dr. Aishah",
    place: "Room 4-08",
    state: "later",
  },
];

export const STATS = [
  { label: "Active courses", value: "04", caption: "this semester" },
  { label: "Mentees enrolled", value: "158", caption: "across cohorts" },
  { label: "Mentors on roster", value: "12", caption: "permanent and visiting" },
  { label: "Attendance accuracy", value: "98.4%", caption: "face recognition, last 30 days" },
];

export const USERS = [
  { id: "u-001", name: "Aiman Hakimi", identity: "2023607832", role: "Mentee" as Role, status: "Active", joined: "2024-09-01" },
  { id: "u-002", name: "Nur Sofea Rashid", identity: "2023608112", role: "Mentee" as Role, status: "Active", joined: "2024-09-01" },
  { id: "u-003", name: "Faris Adlan", identity: "2023611901", role: "Mentee" as Role, status: "Active", joined: "2024-09-01" },
  { id: "u-004", name: "Liyana Aziz", identity: "2023612200", role: "Mentee" as Role, status: "Probation", joined: "2024-09-01" },
  { id: "u-005", name: "Hafiz Ridzwan", identity: "2023612555", role: "Mentee" as Role, status: "Active", joined: "2024-09-01" },
  { id: "u-006", name: "Dr. Aishah Mokhtar", identity: "FCMS-184", role: "Mentor" as Role, status: "Active", joined: "2018-02-12" },
  { id: "u-007", name: "Encik Faiz Rashid", identity: "FCMS-209", role: "Mentor" as Role, status: "Active", joined: "2020-08-04" },
  { id: "u-008", name: "Pn. Liyana Hashim", identity: "FCMS-232", role: "Mentor" as Role, status: "Active", joined: "2022-01-10" },
  { id: "u-009", name: "Registrar Office", identity: "ADM-001", role: "Admin" as Role, status: "Active", joined: "2017-06-01" },
];

export const EVALUATION_RUBRICS = [
  {
    id: "rub-01",
    title: "End-of-term mentor evaluation",
    target: "Mentor",
    items: [
      "Pacing of lectures",
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

export const CLASSES = [
  { id: "cls-01", course: "MAT CS110", topic: "Strong induction on trees", date: "2026-05-04", time: "14:00", room: "BD-3, Block A", state: "Live" },
  { id: "cls-02", course: "MAT CS110", topic: "Bijective proofs walkthrough", date: "2026-05-06", time: "14:00", room: "BD-3, Block A", state: "Scheduled" },
  { id: "cls-03", course: "CSC 234", topic: "Topological sort lab", date: "2026-05-07", time: "10:00", room: "Lab 2", state: "Scheduled" },
  { id: "cls-04", course: "MAT CS110", topic: "Office hours", date: "2026-05-08", time: "14:00", room: "Room 4-08", state: "Scheduled" },
];
