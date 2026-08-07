// One-off backfill: convert legacy free-text grades into numeric marks so the
// monitoring module has something to calculate from. Idempotent — rows that
// already carry a mark are skipped.
//
//   npx tsx scripts/backfill-marks.ts
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import { makeAdapter } from "../lib/db-adapter";
import { markFromGradeText, letterFromMark } from "../lib/performance";

loadEnv();
loadEnv({ path: ".env.local", override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");

const db = new PrismaClient({ adapter: makeAdapter(connectionString) });

async function main() {
  const rows = await db.assignmentSubmission.findMany({
    where: { mark: null, grade: { not: null } },
    select: { id: true, grade: true },
  });

  let converted = 0;
  const unreadable: string[] = [];

  for (const r of rows) {
    const mark = markFromGradeText(r.grade);
    if (mark === null) {
      unreadable.push(`${r.id} (${r.grade})`);
      continue;
    }
    await db.assignmentSubmission.update({
      where: { id: r.id },
      data: { mark, grade: letterFromMark(mark) },
    });
    converted += 1;
  }

  console.log(`candidates: ${rows.length}`);
  console.log(`converted:  ${converted}`);
  if (unreadable.length) {
    console.log(`unreadable: ${unreadable.length}`);
    for (const u of unreadable) console.log(`  - ${u}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
