# GENERAL fixes (PDF page 1-2)

## G1 — Minimize homepage `[ ]`

**SV cakap:** "Minimize kan lagi main dashboard, takperlu ada categories ni since semuanya subject math, pastu dekat bawah sekali tu takpayah ada pun okay yang open her course semua tu. Cukup sekadar ada list subjek yang available, feedbacks and how it works tu pun memadai."

**Files:** `app/page.tsx`, `components/site-nav.tsx`

**Change:**
- Buang dropdown `Categories ▼` dari header (semua subject math, takde kategori).
- Buang section bawah "open her course / Pre Calculus card" (likely featured-course hero).
- Keep: search bar, list subject available, feedbacks (testimonials), how it works.

---

## G2 — Sign-in cleanup `[ ]`

**SV cakap:** "Kat sign in, jangan display kan acc yang sedia ada. Pastu time sign in ni, tak boleh ke dia nak view password? Mcm selalu kita login mana mana website kan kadang dekat password tu ada logo mata kecik tu hahaha"

**Files:** `app/login/page.tsx`

**Change:**
- Buang any demo/saved account chip atau "Demo seed: Adm1234" hint yang display existing acc.
- Add show-password toggle (Lucide `Eye` / `EyeOff` icon — ikut rule no emoji icon) dalam password input.

---

## G3 — Mentor create-account: file upload + success popup `[ ]`

**SV cakap:** "Mentor create acc, takleh upload file. Pastu bila success create acc pun takde apa apa popup message ke nak notify user dia dah success create acc."

**Files:** `app/register/page.tsx`, `components/register-form.tsx`, `components/face-self-enrol.tsx`, `lib/upload.ts`

**Change:**
- Debug file/face upload dalam register flow untuk role=Mentor (currently fail).
- After successful submit, show success toast/modal: "Account created. You can sign in now." then redirect to login.

---

## G4 — Same-person mentor + mentee at same time **NEED-DECISION**

**SV tanya:** "Kalau contoh dia semester 4, and dia jadi mentor untuk semester 2 dan 3, tapi dalam masa yang sama, dia nak jadi mentee untuk semester 4, camne dan boleh ke?"

**Decision needed from Hazim:**
- (a) Allow dual role — one user can hold Mentor role for lower-sem courses + Mentee role for own sem. Need schema: `UserCourseRole(userId, courseId, role)` instead of single `role` on User.
- (b) Disallow — force pick one role per academic period.
- (c) Defer — out of scope for current fix round.

**Files (if (a)):** `prisma/schema.prisma`, `lib/session.ts`, `app/dashboard/page.tsx`, `app/mentor/page.tsx`

---

## G5 — Mentee assigned to specific mentor **NEED-DECISION**

**SV tanya:** "Boleh ke kalau buat mentee ni di assign mentor? Bukan buat general mentor la. Sebab taknak bercampur aduk. Cuma syaza takde idea cane nak buat dia assign to specific mentor."

**Decision needed from Hazim:**
- (a) Add explicit assignment: mentee enrolled in course → admin picks one mentor for that mentee. Tightens privacy across the board (discussion, assignment view, attendance, feedback).
- (b) Implicit by course: if course has 1 mentor, mentee auto-assigned; if multiple mentors, split by cohort/group.

**Recommendation (HakasAI):** (a) is what unlocks G7 + Mentee-3 (per-mentor discussion group). Schema add: `MentorshipAssignment(menteeId, mentorId, courseId)`.

**Files (if approved):** `prisma/schema.prisma`, `lib/queries.ts`, all scoped pages.

---

## G6 — Evaluation rubric: where does mentor/mentee fill it? `[ ]`

**SV cakap:** "Lepastu, yang kat evaluation rubric dekat admin tu untuk admin monitor keberkesanan program tu, syaza tak jumpa pun dekat mana mentor/mentee ni evaluate ahhaha sebab ada feedback je"

**Files:** `app/admin/evaluations/page.tsx`, `app/feedback/page.tsx`, possibly new `app/feedback/rubric/page.tsx`

**Change (pick one path with Admin-7):**
- Option A: Wire rubric → render at mentor/mentee feedback page (mentee fills "End-of-term mentor evaluation", mentor fills "Peer review"). Admin sees aggregate.
- Option B: Drop rubric admin page entirely if not actually used; keep simple feedback rating + comment.

**Recommendation:** Option A (matches SV intent of "admin monitor keberkesanan").

---

## G7 — Overall privacy: hide cross-cohort data `[ ]`

**SV cakap:** "Overall SV Syaza cakap, system ni mcm bercampur aduk. Macam takde privacy, ibarat semua mentor ke mentee ke boleh tengok semua sesi kelas, course lain. Dia kata okay dah cuma serabut bercampur aduk, students akan keliru dan tak logik"

**Files:** `lib/queries.ts`, every list page (`assignments`, `attendance`, `discussion`, `feedback`, `mentor/classes`, `mentor/assignments`)

**Change (umbrella for the per-page fixes in Mentor + Mentee sections):**
- Add scoping helpers: `getCoursesForUser(userId)`, `getMentorshipScope(userId)`.
- Filter every list query by current user's enrolled/taught courses.
- This depends on G5 decision — if (a) approved, scope by `MentorshipAssignment` too.
