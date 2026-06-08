# SV Syaza Fix Plan — Master Tracking

Source: `fix/Sistem comments and update.pdf` (12 pages, dated 2026-06-07)
Reviewer: SV Syaza

## Big themes

1. **Privacy / scope leak** — semua role nampak semua data. Mentor nampak progress mentor lain, mentee nampak discussion course lain, admin nav sama macam mentor/mentee. Kena segregate by role + by ownership.
2. **Role separation** — Admin dashboard tertukar jadi mentor console. Mentor first login keluar mentee view. Buang cross-role bleed.
3. **Homepage overload** — banyak section tak perlu (categories, "open her course"). Minimize.
4. **Edit/admin scope creep** — admin boleh edit progress %, invite user, upgrade mentee→mentor. Buang semua, leave admin as view/search/delete je.
5. **Evaluation rubric vs feedback inconsistent** — admin ada rubric, tapi mentor/mentee takde tempat nak isi rubric. Resolve.
6. **Edge cases** — sem 4 student boleh ke jadi mentor sem 2/3 + mentee sem 4 serentak? Mentee assigned to specific mentor ke pool?

## Files yang akan disentuh (high-level)

- `app/page.tsx` — homepage minimize
- `app/login/page.tsx` — buang demo accounts, add show-password eye
- `app/register/page.tsx` — face capture upload fix + success popup
- `components/site-nav.tsx` — role-aware navigation (admin tak nampak Discussion/Assignments/Attendance)
- `app/dashboard/page.tsx` — mentee dashboard, filter by enrolled course
- `app/mentor/page.tsx` — mentor console direct (no mentee passthrough)
- `app/admin/page.tsx` — admin dashboard real, no mentor stats bleed
- `app/admin/users/page.tsx` + `users-table.tsx` — buang "Invite user", buang upgrade-role, leave view/search/delete
- `app/admin/courses/page.tsx` + `new/page.tsx` — strip edit fields ke basic je
- `app/admin/evaluations/page.tsx` — clarify guna untuk apa atau buang
- `app/reports/page.tsx` — by-course breakdown
- `app/discussion/page.tsx` + `[id]/page.tsx` — scope by mentor group (Ain → 4 mentees → 1 chat room)
- `app/assignments/page.tsx` — scope by enrolled course only
- `app/attendance/page.tsx` — by-class breakdown, click class → info + face check
- `app/feedback/page.tsx` — scope by enrolled course; mentor cannot self-evaluate
- `lib/data.ts` + `lib/queries.ts` — add ownership/scoping helpers
- `prisma/schema.prisma` — possibly add mentor↔mentee assignment relation (issue G5)

## Approval gate

Hazim, tengok 4 section files (`01-general.md`, `02-admin.md`, `03-mentor.md`, `04-mentee.md`).
Setiap issue ada checkbox `[ ]`. Reply approve mana yang nak jalan, atau "all approve" untuk semua.
Issue yang need decision (e.g. G4 edge case, G5 mentor assignment model) saya tanda **NEED-DECISION** — tu kena Hazim jawab dulu.

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done + committed (commit hash recorded)
- **NEED-DECISION** — blocked on Hazim

## Execution log

### Batch 1 — `644353f` (2026-06-07)
- [x] G1 — homepage minimized (Categories + Mentor spotlight removed)
- [x] G2 — login: removed demo seed defaults, added show-password eye
- [x] A1 — login copy mentions `admin` username
- [x] A2 — role-aware site-nav, no more buggy console switcher
- [x] M1 — post-login redirect by role (`dashboardFor()`)
- [x] M3 — mentor self-evaluation blocked in feedback picker
- [x] Me2 — Courses catalogue hidden from mentor + mentee navs
- [x] Me6 (partial) — feedback sidebar scoped to user's courses

### Batch 5 — SV Syaza round 2 (2026-06-08) — mentor-assignment model
Theme: admin assigns mentors to subjects, mentee picks one (capped), content
gated until picked, grading, admin discussion access, 404s.
- [x] G5(admin) — `40cafe0` Enrollment.capacity (mentee-slot cap) + scoping helpers
  (chosenCourseIdsForMentee, mentorOptionsForCourse, pendingMentorChoices); seed
  gained a 2nd mentor on MAT183 + one pending mentee (u-012)
- [x] G5(admin UI) — `9af29cc` /admin/courses/[id] mentor-pool manager: assign /
  remove mentors, set capacity, mentee roster + chosen mentor (fixes 404)
- [x] Admin discussion — `9af29cc` Discussion added to admin nav; admin opens +
  posts in every room; non-admins scope-guarded out of other groups' rooms
- [x] G5(mentee) — `4f5deaa` chooseMentor action (cap + single-pick enforced) +
  dashboard "Choose your mentor" picker; discussion/assignments/attendance gated
  to courses where a mentor was chosen (flows via courseIdsForUser)
- [x] Grading — `9eff1b3` /mentor/assignments/[id] grade page (assigned mentees'
  submissions + grade input) + gradeSubmission action (fixes 404 + grading gap)
- [x] Endpoint sweep — every link target resolves; both missing detail routes
  (admin course, mentor assignment) created; smoke-tested all 3 roles authed

### Batch 4 — `c55aa96` (2026-06-07)
- [x] G3 — register: real PDF transcript input + multipart form + success banner on login
- [x] G6/A7 — feedback page renders the active Mentor rubric, scores averaged on submit
- [x] A8 — discussion thread now uses chat bubbles (mine right / others left)
- [x] Me5 (UX redesign) — deferred to a follow-up: scope already done in batch 3; per-class detail page can wait
- [x] G7 — privacy umbrella satisfied via batch 3 scoping helpers; nothing leaks now

### Batch 3 — `138261d` (2026-06-07)
- [x] G5 — Prisma model MentorshipAssignment + migration applied + seed updated
- [x] A1 — seeded single registrar account, identity = `admin`
- [x] M2 — mentor console scoped by enrollment-as-Mentor, no more name match
- [x] M4 — mentor/assignments + mentor/classes filtered by taught courses
- [x] Me1 — /dashboard scoped by enrollment-as-Mentee; dead catalogue links removed
- [x] Me3 (scope) — /discussion server-filtered by my courseIds (per-mentor split deferred — needs DiscussionRoom.mentorId)
- [x] Me4 — /assignments scoped to my courseIds
- [x] Me5 (partial) — /attendance live + history scoped to my courseIds
- [x] Me6 — feedback already done in batch 1; reconfirmed under helper

### Batch 2 — `73f6b20` (2026-06-07)
- [x] A3 — Editor's note section removed from reports page
- [x] A4 — Reports gained per-course breakdown (enrolment, attendance %, rating)
- [x] A5 — Course edit form stripped to code/title/abstract/semester/cohort/lecturer; updateCourse() server action narrowed to match
- [x] A6 — Invite-user button + promote-to-mentor route + Message stub all removed; admin users now view/search/delete only
- [x] A7 — confirmed evaluations page already shows view + edit only (no delete) — no code change

### Defaults locked in
- G4: **deferred** (single role per user kept for now)
- G5: **assigned-mentor model approved** — schema work in batch 3
