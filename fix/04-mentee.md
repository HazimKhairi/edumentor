# MENTEE fixes (PDF page 9-11)
Contoh akaun: **Nazrul — MAT183 (mentor Ain)**

## Me1 — Upcoming courses + due assignments bercampur dgn mentor lain `[ ]`

**SV cakap:** "Mentor dia tulis Ain tadi, tapi dekat upcoming courses, due assignment tu dia bercampur dgn mentor lain."

**Files:** `app/dashboard/page.tsx`, `lib/queries.ts`

**Change:**
- "Continue learning", "Upcoming for my courses", "Due this week" — filter by mentee's enrolled courses (Nazrul → MAT183 only).
- If G5(a) approved: also filter by assigned mentor (only Ain's classes shown).

---

## Me2 — Courses catalogue tak perlu untuk mentee `[ ]`

**SV cakap:** "Kat courses ni takperlu pun tkpe. Kalau nak juga, buat dekat dashboard tapi tak necessary. (ni dekat mentor pun sama)"

**Files:** `components/site-nav.tsx`, `app/courses/page.tsx`

**Change:**
- Hide "Courses" nav link for both mentor and mentee. (Already enrolled — no need to browse catalogue.)
- Keep route accessible by URL, but no nav entry. Or buang terus kalau Hazim setuju.

---

## Me3 — Discussion: per-mentor group only `[ ]`

**SV cakap:** "Discussion ni, kenapa dia boleh tengok dan join discussion course lain? Tak boleh ke buat untuk discussion group dia je? Itupun dengan mentor sendiri takpayah join discussion mentor lain. Contoh kalau mentor Ain handle 4 orang - amir, Nazrul, icam, icum, dalam conv tu ada orang berlima je. Kiranya mcm discussion group masing2 la. (ni dekat mentor pun sama, dia display semua discussion session ke course ke, tak logik)"

**Files:** `app/discussion/page.tsx`, `app/discussion/[id]/page.tsx`, `lib/queries.ts`, possibly `prisma/schema.prisma` (add `DiscussionGroup` if needed)

**Change:**
- One discussion room per `(mentorId, courseId)`. Members = mentor + assigned mentees for that course.
- Mentee landing on /discussion sees only their group(s) (one per enrolled course).
- Mentor sees one room per course they teach.
- Depends on **G5 (mentor assignment)** decision.

---

## Me4 — Assignments bercampur (same as M4 mentor) `[ ]`

**SV cakap:** "Kenapa assignment pun bercampur? (mentor pon sama)"

**Files:** `app/assignments/page.tsx`, `lib/queries.ts`

**Change:** Filter by `enrolledCourses(userId)`. Nazrul (MAT183) should not see MAT133 / MAT210 / MAT123 assignments.

---

## Me5 — Attendance by-class breakdown + click-through `[ ]`

**SV cakap:** "Attendances ni boleh buat by class ke session ke? And list. Contoh mentor Ain ni tadi create class untuk topik 1, so attendances by class la should be kan? Bila mentee tekan class tu, display la basic information and link attendances ni? (mentor pun sama)"

**Files:** `app/attendance/page.tsx`, possibly new `app/attendance/[classId]/page.tsx`

**Change:**
- Default view: list of mentee's classes (Class title, course, date, attendance status). Not the raw face-cam page.
- Click a class → detail page with class info (topic, date, mentor, room) + face-recognition attendance widget below.
- Same UX for mentor (sees their classes list, clicks to mark/view roster).

---

## Me6 — Feedback display only enrolled subjects `[ ]`

**SV cakap:** "Feedback display ikut subjek mentee tu enroll je sebab ni untuk mentee punya console bukan admin. Cth mcm Nazrul n ikan enroll course MAT183, so feedback display untuk course dia je"

**Files:** `app/feedback/page.tsx`

**Change:**
- Course picker in "Write a review" filtered to mentee's enrolled courses only (Nazrul → MAT183).
- "Recent reviews" sidebar also scoped to those courses (or to the mentor that teaches them).
- Pairs with M3 — mentor side excludes self.

---

## Use-case diagram review (page 12)

SV attached current use-case diagram (Admin / Mentor / Mentee actors). Quick notes (no code change, doc-only):

- Diagram shows **Manage Course (admin: add/view/update/delete)** but per A5/A6 we now want admin to be view+edit-basic+delete only (no progress edit). Update diagram caption.
- Diagram shows **Manage Evaluation (admin: add/view/update/delete)** — per A7, delete should not be allowed. Update.
- Diagram shows mentee + mentor both → Join Discussion. After Me3, scope is per-group, but the use case stays valid.
- Diagram missing **Self-evaluation guard** — note that Mentor cannot review themselves (M3).
- No action on code here — Hazim boleh forward feedback to Syaza on the diagram.
