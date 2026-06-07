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

### Defaults locked in
- G4: **deferred** (single role per user kept for now)
- G5: **assigned-mentor model approved** — schema work in next batch
