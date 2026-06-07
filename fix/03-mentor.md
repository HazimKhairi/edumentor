# MENTOR fixes (PDF page 6-8)
Contoh akaun: **Ain — Mentor untuk MAT183 & MAT133**

## M1 — Mentor login keluar mentee dashboard dulu `[ ]`

**SV cakap:** "Kenapa bila login akaun mentor, first dashboard dia keluar ibarat dia mentee? Kena tekan mentor console dulu baru dia keluar dashboard mentor. Lepastu, dia keluar course yang mentor dia tak enroll pun padahal. Contoh kalau dia memang ada daftar as mentee semester dia sendiri, logikla kalau ada. Pastu baru boleh tekan mentor console tu untuk dia masuk ke mentor yang dia in-charge. Tapi contoh kat bawah ni, syaza create acc Ain ni as mentor untuk subjek MAT183 & MAT133 and syaza takde create class lagi ke apa, kenapa dia keluar live tu mcm dah ada pending kelas eh? Lepastu kat continue learning tu pun, kan syaza takde progress apa apa lagi tapi kenapa progress dia dh ada eh?"

**Files:** `app/login/page.tsx` (post-login redirect), `auth.ts`, `app/dashboard/page.tsx`, `app/mentor/page.tsx`, `lib/data.ts`

**Change:**
- After login, if `role === 'MENTOR'` → redirect to `/mentor` directly, not `/dashboard`.
- `/mentor` page must read ONLY courses where this mentor is assigned (Ain → MAT183, MAT133).
- Buang fake "Live now: MAT133, BD-3, Block A" placeholder. Only show live session if real Class row exists with start time = now.
- Buang fake "Continue learning" progress cards. Only render if mentor is enrolled as mentee somewhere; otherwise hide section.

---

## M2 — Mentor console mixes other mentors' data `[ ]`

**SV cakap:** "Pergi dekat mentor console untuk Ain ni, tapi dia mcm bercampur aduk dengan mentor2 lain punya progress and so on. Tak boleh ke kalau each user tu ada their own work ke dashboard ke so takdela bercampur aduk. Macam cth Ain ni mentor untuk mat183 tapi bila dia ke console dia, subjek tu include progress dari mentor lain jugak cth Aiman. So mcm takde privacy and tak logik."

**Files:** `app/mentor/page.tsx`, `lib/queries.ts`

**Change:**
- All mentor-page queries filter `where: { mentorId: session.userId }`.
- Stats cards (Courses I mentor, Open assignments, Upcoming sessions, Mentor rating) all scoped to Ain only.
- "My courses" list: only Ain's courses.

---

## M3 — Mentor cannot self-evaluate `[ ]`

**SV cakap:** "Kenapa mentor ni dia evaluate diri sendiri ahahah"

**Screenshot:** Ain dropdown shows "MAT133, Pre Calculus, mentor Ain Batrisya" in the Course picker of "Write a review".

**Files:** `app/feedback/page.tsx`

**Change:**
- In feedback form, course/mentor picker must exclude entries where `mentorId === session.userId`.
- If mentor has no other course/mentor to review, hide the form and show empty-state.

---

## M4 — Assignments, classes, discussions, attendance all bercampur `[ ]`

**SV cakap:** "Macam assignments, class, room discussion, attendances semua bercampur. Not recommended."

**Files:**
- `app/mentor/assignments/page.tsx`
- `app/mentor/classes/page.tsx`
- `app/discussion/page.tsx` (mentor view)
- `app/attendance/page.tsx` (mentor view)

**Change (per page):**
- **Assignments:** screenshot shows ESSAY-01 (MAT210), LAB-02 (MAT183), PS-04 (MAT133), PS-05 (MAT133) — but mentor=Ain only handles MAT183 + MAT133, so ESSAY-01 (MAT210) tak patut keluar. Filter by mentor's assigned courses.
- **Classes:** same scoping. Only Ain's MAT183/MAT133 classes.
- **Discussions:** scope to mentor's mentee group (pair with G5 + A8).
- **Attendance:** scope to mentor's classes only; show by-class breakdown (see Mentee-5 for same UX).
