import { defineConfig, env } from "@prisma/config";
import { config as loadEnv } from "dotenv";

// Same precedence as Next.js: .env first, then .env.local overrides it
// (.env.local holds the Neon DATABASE_URL pulled via `vercel env pull`).
loadEnv();
loadEnv({ path: ".env.local", override: true });

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
