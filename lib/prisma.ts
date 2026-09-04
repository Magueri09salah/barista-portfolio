/**
 * PRISMA CLIENT — server only.
 *
 * One client per process. Next's dev server re-evaluates modules on every edit,
 * so without the global cache each save would open a new pool and the database
 * would run out of connections after a few minutes of work.
 *
 * Prisma 7 talks to Postgres through a driver adapter rather than its own
 * engine, so the pool here is `pg`'s. Point DATABASE_URL at Neon's *pooled*
 * connection string (the host containing "-pooler"); DIRECT_URL is only used by
 * the CLI for migrations.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and paste your Neon pooled connection string.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    // Queries are quiet in production; warnings and errors always surface.
    log: process.env.NODE_ENV === "production" ? ["warn", "error"] : ["warn", "error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
