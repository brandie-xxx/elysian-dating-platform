import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// --- Users ---
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  gender: text("gender"), // male, female, nonbinary, custom
  birthDate: text("birth_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Profiles ---
export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  bio: text("bio"),
  interests: text("interests"), // JSON or comma-separated
  location: text("location"),
  avatarUrl: text("avatar_url"),
  premium: integer("premium").default(0), // 0=free, 1=premium
});

// --- Matches ---
export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user1Id: integer("user1_id")
    .references(() => users.id)
    .notNull(),
  user2Id: integer("user2_id")
    .references(() => users.id)
    .notNull(),
  matchedAt: text("matched_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Messages ---
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .references(() => matches.id)
    .notNull(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  sentAt: text("sent_at").default(sql`CURRENT_TIMESTAMP`),
});
