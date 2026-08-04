// Diagnostic check untuk setup EduMentor. Print PASS/FAIL setiap komponen
// supaya punca masalah nampak terus. Exit code 1 kalau ada FAIL kritikal.
// Run: node scripts/doctor.mjs

import net from "node:net";
import { config as loadEnv } from "dotenv";

loadEnv();
loadEnv({ path: ".env.local", override: true });

let failed = false;

function pass(label, detail = "") {
  console.log(`  [PASS] ${label}${detail ? ", " + detail : ""}`);
}
function fail(label, punca) {
  failed = true;
  console.log(`  [FAIL] ${label}`);
  console.log(`         PUNCA: ${punca}`);
}
function warn(label, detail) {
  console.log(`  [WARN] ${label}, ${detail}`);
}

function tcpCheck(host, port, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port });
    const timer = setTimeout(() => {
      sock.destroy();
      resolve(false);
    }, timeoutMs);
    sock.on("connect", () => {
      clearTimeout(timer);
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

console.log("\n=== EduMentor Doctor ===\n");

// 1. DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
let dbHost = null;
let dbPort = null;
let flavor = null;
if (!dbUrl) {
  fail(
    "DATABASE_URL",
    ".env.local takde atau tak lengkap. Run semula setup, pastikan passphrase betul.",
  );
} else {
  try {
    const u = new URL(dbUrl);
    flavor = u.protocol.startsWith("mysql") ? "MySQL (local XAMPP)" : "Postgres (Neon)";
    dbHost = u.hostname;
    dbPort = Number(u.port) || (u.protocol.startsWith("mysql") ? 3306 : 5432);
    pass("DATABASE_URL", `${flavor} @ ${dbHost}:${dbPort}`);
  } catch {
    fail("DATABASE_URL", "Format connection string tak sah.");
  }
}

// 2. AUTH_SECRET
if (process.env.AUTH_SECRET) {
  pass("AUTH_SECRET");
} else {
  fail(
    "AUTH_SECRET",
    "Login akan gagal (MissingSecret). .env.local versi lama — padam .env.local dan run semula setup.",
  );
}

// 3. Blob token (untuk upload file sahaja)
if (process.env.BLOB_READ_WRITE_TOKEN) {
  pass("BLOB_READ_WRITE_TOKEN");
} else {
  warn("BLOB_READ_WRITE_TOKEN takde", "app jalan, tapi upload file akan gagal");
}

// 4. Database reachable?
if (dbHost) {
  const ok = await tcpCheck(dbHost, dbPort);
  if (ok) {
    pass("Database reachable", `${dbHost}:${dbPort}`);
  } else if (flavor && flavor.startsWith("MySQL")) {
    fail(
      `Database tak reachable (${dbHost}:${dbPort})`,
      "MySQL tak jalan. Buka XAMPP Control Panel, tekan Start pada MySQL, pastu run semula.",
    );
  } else {
    fail(
      `Database tak reachable (${dbHost}:${dbPort})`,
      "Takde internet, atau firewall block port 5432 ke Neon.",
    );
  }
}

console.log("");
if (failed) {
  console.log("Doctor: ADA MASALAH. Baiki punca di atas dulu.\n");
  process.exit(1);
} else {
  console.log("Doctor: semua OK.\n");
}
