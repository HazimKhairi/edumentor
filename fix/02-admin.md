# ADMIN fixes (PDF page 3-5)

## A1 — Admin username = "admin", not staff ID `[ ]`

**SV cakap:** "Admin username guna je normal mcm – admin. Takperlu no staff since system support sorg je admin"

**Files:** `app/login/page.tsx`, `lib/data.ts` (seed admin), `prisma/seed.ts`

**Change:**
- Admin login by username `admin` + password. Tukar label dari "Identity number" → conditional, atau accept both (admin uses username, others use matric/staff).
- Update seed admin user accordingly.

---

## A2 — Admin dashboard ≠ mentor console (no nav bleed) `[ ]`

**SV cakap:** "Kenapa dashboard admin boleh tukar kepada mentor console? Pastu kenapa admin navigation pun ada courses discussion assignments apa semua tu? Sebab bila di tekan each navigation bar tu, dia auto admin ni mcm page mentor/mentee hahaha. Bila tekan admin console baru dia keluar mcm admin mcm bawah ni"

**Files:** `components/site-nav.tsx`, `app/admin/page.tsx`, `app/admin/layout.tsx` (create if missing)

**Change:**
- `site-nav.tsx`: when `session.role === 'ADMIN'`, render admin-only nav: **Dashboard | Users | Courses | Evaluations | Reports**. Hide Desk / Courses (catalogue) / Discussion / Assignments / Attendance / Feedback.
- Buang "Switch console → Mentor console" option dari admin user menu.
- Admin dashboard `/admin` shall load directly, no passthrough via `/dashboard` or `/mentor`.

---

## A3 — Editor's note: buang kalau tak guna `[ ]`

**SV cakap:** "Editor note ni untuk apa, kalau tak penting takperlu pun tak apa."

**Files:** `app/admin/page.tsx` (or wherever the "Editor's note / Filed by Registrar" card is rendered)

**Change:** Remove the Editor's note card block.

---

## A4 — Reports by-course breakdown `[ ]`

**SV cakap:** "Untuk report display ni, boleh ke kalau buat display by course? So contoh admin boleh monitor progress program mcm attendances ke review ke or lain2 by each course la bukan overall."

**Files:** `app/reports/page.tsx`, `lib/queries.ts`

**Change:**
- Keep overall summary cards on top, but add **per-course table**: Course | Active mentors | Mentees enrolled | Attendance % | Avg feedback rating.
- Click a row → drill-down (can be future, mark TODO).

---

## A5 — Edit course: strip down to basic fields, no progress edit `[ ]`

**SV cakap:** "Edit course ni letak basic je cam course code, title, abstract, semester tu. Yang lain tu mcm unnecessary je. Kenapa admin boleh edit progress pula? Bukan ke tu sepatutnya display auto sebab progress kan mana boleh update2 so dia based on progress course tula kan?"

**Files:** `app/admin/courses/page.tsx`, `app/admin/courses/new/page.tsx` (likely edit reuses same form)

**Change:**
- Edit form fields: **Course code, Course title, Abstract, Semester**. Optional: Lecturer assignment, Cohort label.
- **Remove from form:** Sessions count, Capacity, Pace, Progress %, Enrolled count, Colour. Progress % must be derived (computed from sessions completed).

---

## A6 — Buang "Invite user", buang upgrade-role `[ ]`

**SV cakap:** "Invite user ni takleh guna, buang jela. Pastu cth admin upgrade mentee as mentor, so bila mentee tu login acc dia akan auto display dashboard mentor ke? Kalau nak selamat, takut makin complicated, buang je function ni takut bila run nanti dia jadi lain pula hahaha. Kiranya admin boleh view, search dan delete user jela"

**Files:** `app/admin/users/page.tsx`, `app/admin/users/users-table.tsx`, `app/admin/users/[id]/page.tsx`

**Change:**
- Remove "Invite user" button.
- Remove the role-change / upgrade-mentee-to-mentor action (the eye icon in screenshot looks like view; trash = delete; if there's an upgrade action, kill it).
- Admin user table actions allowed: **View, Delete**. Search by name/matric/role stays.

---

## A7 — Evaluation rubrics: consistent or remove `[ ]`

**SV cakap:** "Ni haa evaluation dekat admin, tapi kat mana functions ni sedia digunakan? Sebab mentor mentee ada feedback je takde pun rate2 ni. Buat consistent. Pastu boleh view, update je eh delete takleh eh?"

**Files:** `app/admin/evaluations/page.tsx`, `app/admin/evaluations/new/page.tsx`, `app/feedback/page.tsx`

**Change (depends on G6 decision):**
- If keeping rubric → wire it into mentee/mentor feedback flow (replace plain 5-star with rubric items).
- Allow Admin: **view + edit (update)**. Disable delete (replace trash icon with edit-only).

---

## A8 — Room discussion = group chat feel `[ ]`

**SV cakap:** "Room discussion tak mcm room discussion pun, buatla mcm kita sembang2 dekat group whatsapp tu ke"

**Files:** `app/discussion/page.tsx`, `app/discussion/[id]/page.tsx`, `app/discussion/new/page.tsx`

**Change:**
- Redesign `[id]` view ke chat-bubble layout (sender on right, others on left, timestamps under bubble, sticky bottom composer).
- Threading takpayah kompleks — flat list message. Avatar on left bubble.
- This pair with Mentee-3: scope discussion to mentor's group (mentor + assigned mentees only).
