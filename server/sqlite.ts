import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

export function createSqliteDb() {
  const sqlite = new Database("./elysian.sqlite");
  return drizzle({ client: sqlite, schema });
}
