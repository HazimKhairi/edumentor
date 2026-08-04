import { neonConfig } from "@neondatabase/serverless";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Production (Vercel) guna Neon Postgres; local setup boleh guna MySQL XAMPP.
// Pilihan adapter ikut protokol DATABASE_URL, satu tempat je untuk logic ni —
// lib/db.ts dan prisma/seed.ts dua-dua guna helper ni.
export function makeAdapter(connectionString: string) {
  if (connectionString.startsWith("mysql://")) {
    return new PrismaMariaDb(connectionString);
  }
  return new PrismaNeon({ connectionString });
}
