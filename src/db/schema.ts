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

// --- Likes ---
export const likes = sqliteTable("likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  likerId: integer("liker_id")
    .references(() => users.id)
    .notNull(),
  likedId: integer("liked_id")
    .references(() => users.id)
    .notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Daily Matches ---
export const dailyMatches = sqliteTable("daily_matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  date: text("date").notNull(),
  matchesShown: integer("matches_shown").default(0),
  maxMatches: integer("max_matches").default(5),
});

// --- Streaks & Rewards ---
export const streaks = sqliteTable("streaks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastStreakDate: text("last_streak_date"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const rewards = sqliteTable("rewards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  value: integer("value").default(0),
  claimedAt: text("claimed_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Crush Reveals ---
export const crushReveals = sqliteTable("crush_reveals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user1Id: integer("user1_id")
    .references(() => users.id)
    .notNull(),
  user2Id: integer("user2_id")
    .references(() => users.id)
    .notNull(),
  mutualLikes: integer("mutual_likes").default(0),
  revealed: integer("revealed").default(0),
  revealedAt: text("revealed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Incognito Sessions ---
export const incognitoSessions = sqliteTable("incognito_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  isActive: integer("is_active").default(1),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  endedAt: text("ended_at"),
});

// --- Vibe Filters ---
export const vibeFilters = sqliteTable("vibe_filters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  tag: text("tag").notNull(),
  enabled: integer("enabled").default(1),
});

// --- Stories ---
export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Voice Vibes ---
export const voiceVibes = sqliteTable("voice_vibes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Daily Questions & Responses ---
export const dailyQuestions = sqliteTable("daily_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  category: text("category").notNull(),
  isActive: integer("is_active").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const questionResponses = sqliteTable("question_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  questionId: integer("question_id")
    .references(() => dailyQuestions.id)
    .notNull(),
  response: text("response").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Gifts ---
export const gifts = sqliteTable("gifts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id)
    .notNull(),
  giftType: text("gift_type").notNull(),
  message: text("message"),
  cost: integer("cost").default(0),
  sentAt: text("sent_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Badges & Invites ---
export const badges = sqliteTable("badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  badgeType: text("badge_type").notNull(),
  earnedAt: text("earned_at").default(sql`CURRENT_TIMESTAMP`),
});

export const invites = sqliteTable("invites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  inviterId: integer("inviter_id")
    .references(() => users.id)
    .notNull(),
  inviteeEmail: text("invitee_email").notNull(),
  code: text("code").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  acceptedAt: text("accepted_at"),
});

// --- Weekly Wraps & Mystery Matches ---
export const weeklyWraps = sqliteTable("weekly_wraps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  weekStart: text("week_start").notNull(),
  stats: text("stats").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const mysteryMatches = sqliteTable("mystery_matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  potentialMatchId: integer("potential_match_id")
    .references(() => users.id)
    .notNull(),
  isRevealed: integer("is_revealed").default(0),
  revealedAt: text("revealed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Mini Events & Participants ---
export const miniEvents = sqliteTable("mini_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  duration: integer("duration").notNull(),
  maxParticipants: integer("max_participants"),
  isLive: integer("is_live").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const eventParticipants = sqliteTable("event_participants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .references(() => miniEvents.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  joinedAt: text("joined_at").default(sql`CURRENT_TIMESTAMP`),
  leftAt: text("left_at"),
});

// --- Payments & Cities & Verifications ---
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("USD"),
  method: text("method").notNull(),
  status: text("status").notNull(),
  transactionId: text("transaction_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  country: text("country").default("Zimbabwe"),
  region: text("region"),
});

export const verifications = sqliteTable("verifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type").notNull(),
  status: text("status").default("pending"),
  documentUrl: text("document_url"),
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  reviewedAt: text("reviewed_at"),
  reviewerNotes: text("reviewer_notes"),
});

// --- Profile Boosts / Elite Events / Attendees ---
export const profileBoosts = sqliteTable("profile_boosts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  boostType: text("boost_type").notNull(),
  isActive: integer("is_active").default(1),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});

export const eliteEvents = sqliteTable("elite_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  maxAttendees: integer("max_attendees"),
  isInviteOnly: integer("is_invite_only").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const eventAttendees = sqliteTable("event_attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .references(() => eliteEvents.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  invitedAt: text("invited_at").default(sql`CURRENT_TIMESTAMP`),
  rsvpStatus: text("rsvp_status").default("pending"),
});
