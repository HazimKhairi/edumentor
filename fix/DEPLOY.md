# Why SV still sees old bugs — and how to ship the fixes

## Diagnosis (verified 2026-06-08)

SV's reported bugs (mentor sees mentee view, delete → 404, mixed/unregistered
courses, mentor can't verify live class) were **all reproduced in a real browser
against current `main` — none of them happen.** They are fixed.

She sees them because **the live site is a stale, pre-database build.** Two causes:

1. `vercel.json` had `"ignoreCommand": "exit 0"` — this **cancels every Vercel
   build**. No push since the first deploy ever shipped (all deployments for the
   last 23h+ show `Canceled`). FIXED in commit `6af7c4e` (removed it; build now
   runs `prisma generate && next build`).

2. The Vercel project has **zero environment variables** — no `DATABASE_URL`,
   `AUTH_SECRET`, or `AUTH_TRUST_HOST`. The current Prisma app cannot build or
   run on production. Build log confirms:
   `PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL`.
   The version that is live is the older hardcoded-data build (no DB), which is
   why everything looks mixed/static and the old bugs are present.

## To ship the fixes (needs Hazim — infra + secrets)

Local XAMPP MySQL (`mysql://root:@localhost:3306/edumentor`) is NOT reachable
from Vercel. Production needs a cloud MySQL.

1. **Provision a cloud MySQL** — e.g. Vercel Marketplace (PlanetScale/Aiven),
   Railway, or any MySQL host. Get its connection string.

2. **Set Vercel env vars** (Production, Preview, Development):
   ```
   vercel env add DATABASE_URL      # paste the cloud MySQL URL
   vercel env add AUTH_SECRET       # any long random string (openssl rand -base64 32)
   vercel env add AUTH_TRUST_HOST   # value: true
   ```

3. **Create schema + seed the cloud DB** (from local, pointing at prod URL):
   ```
   DATABASE_URL="<cloud-url>" npx prisma db push
   DATABASE_URL="<cloud-url>" npm run db:seed
   ```

4. **Deploy**: `vercel --prod` (or just push — builds are re-enabled now).

5. Verify: sign in as `admin` / mentor `2022613001` / mentee `2024611002`
   (password `edu1234`) and walk the assign → pick → gate → grade flow.

Once a cloud DB connection string exists, steps 2-4 take ~5 minutes.
