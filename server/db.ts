import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import { createSqliteDb } from "./sqlite";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

let db: any;

if (
  process.env.DATABASE_URL.startsWith("file:") ||
  process.env.USE_SQLITE === "true"
) {
  // Use SQLite for development
  db = await createSqliteDb();
} else {
  // Use PostgreSQL (Neon) for production
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };
