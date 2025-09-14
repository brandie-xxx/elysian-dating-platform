import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const isSQLite = process.env.USE_SQLITE === "true";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite
    ? {
        url: process.env.DATABASE_URL,
      }
    : {
        url: process.env.DATABASE_URL,
      },
});
