// Loads .env for the CLI. Next.js loads the same file itself at runtime, which
// is why DATABASE_URL lives in .env rather than .env.local — one file, read by
// both. The Prisma CLI does not read .env.local at all.
import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 reads the connection string from here rather than from the schema.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    /*
     * This URL is used by the CLI only — migrations, `db pull`, Studio. The
     * running application never reads it: lib/prisma.ts builds its own pool
     * from DATABASE_URL through the pg driver adapter.
     *
     * That is why the direct connection is preferred here. A migration issues
     * session-level statements that PgBouncer in transaction mode cannot carry,
     * so running them through Neon's pooled endpoint fails. On Neon, DIRECT_URL
     * is the same connection string with "-pooler" removed from the host.
     *
     * Falls back to DATABASE_URL so a plain Postgres, where there is only one
     * endpoint, needs no second variable.
     *
     * Read through process.env rather than Prisma's `env()` helper, which
     * throws when a variable is missing. `postinstall` runs `prisma generate`,
     * and generating the client needs no connection — a fresh clone with no
     * .env yet must still be able to run `npm install`.
     */
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
