# EduMentor

UiTM FCMS mentorship platform — Admin / Mentor / Mentee roles with shared face-recognition attendance.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4 with `@theme` tokens, Inter font, Lucide icons
- Prisma 7 + Postgres (Neon, via Vercel Marketplace) using `@prisma/adapter-neon`
- Auth.js v5 (NextAuth) with JWT credentials
- `@vladmandic/face-api` for in-browser face recognition

## Getting started

1. Pull env vars from the linked Vercel project: `vercel env pull .env.local` (provides `DATABASE_URL` for the Neon database).
2. Copy env: ensure `.env` has `AUTH_SECRET`, `AUTH_TRUST_HOST`.
3. Install + migrate + seed:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset DB |
