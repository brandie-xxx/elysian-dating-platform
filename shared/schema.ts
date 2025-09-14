import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    sessionExpireIndex: index("IDX_session_expire").on(table.expire),
  })
);

// User storage table (updated for Replit Auth and Stripe)
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").unique(), // Keep for backward compatibility, make optional
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isPremium: boolean("is_premium").default(false).notNull(),
  premiumTier: varchar("premium_tier").default("free"), // free, premium, black_card
  language: varchar("language").default("en"), // en, sn, nd
  city: varchar("city"),
  isVerified: boolean("is_verified").default(false).notNull(),
  lastLogin: timestamp("last_login"),
  loginStreak: integer("login_streak").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable(
  "profiles",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    bio: text("bio").notNull(),
    location: text("location").notNull(),
    photos: text("photos").array().default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    profileUserUnique: uniqueIndex("profiles_user_unique").on(table.userId),
  })
);

export const interests = pgTable("interests", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
});

export const userInterests = pgTable(
  "user_interests",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    interestId: varchar("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userInterestUnique: uniqueIndex("user_interests_user_interest_unique").on(
      table.userId,
      table.interestId
    ),
  })
);

export const matches = pgTable(
  "matches",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user1Id: varchar("user1_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    user2Id: varchar("user2_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    matchUnique: uniqueIndex("matches_user1_user2_unique").on(
      table.user1Id,
      table.user2Id
    ),
  })
);

export const likes = pgTable(
  "likes",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    likerId: varchar("liker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    likedId: varchar("liked_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    likeUnique: uniqueIndex("likes_liker_liked_unique").on(
      table.likerId,
      table.likedId
    ),
  })
);

export const messages = pgTable("messages", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  matchId: varchar("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New tables for Elysian features

// Addictive Mechanics
export const dailyMatches = pgTable(
  "daily_matches",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    matchesShown: integer("matches_shown").default(0).notNull(),
    maxMatches: integer("max_matches").default(5).notNull(),
  },
  (table) => ({
    userDateUnique: uniqueIndex("daily_matches_user_date_unique").on(
      table.userId,
      table.date
    ),
  })
);

export const streaks = pgTable(
  "streaks",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastStreakDate: timestamp("last_streak_date"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    streakUserUnique: uniqueIndex("streaks_user_unique").on(table.userId),
  })
);

export const rewards = pgTable("rewards", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // login_streak, referral, etc.
  description: text("description").notNull(),
  value: integer("value").default(0).notNull(),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
});

export const crushReveals = pgTable(
  "crush_reveals",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user1Id: varchar("user1_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    user2Id: varchar("user2_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mutualLikes: integer("mutual_likes").default(0).notNull(),
    revealed: boolean("revealed").default(false).notNull(),
    revealedAt: timestamp("revealed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    crushUnique: uniqueIndex("crush_reveals_user1_user2_unique").on(
      table.user1Id,
      table.user2Id
    ),
  })
);

// Premium Features
export const incognitoSessions = pgTable("incognito_sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const vibeFilters = pgTable(
  "vibe_filters",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tag: varchar("tag").notNull(), // ambitious, chill, romantic, elite
    enabled: boolean("enabled").default(true).notNull(),
  },
  (table) => ({
    userTagUnique: uniqueIndex("vibe_filters_user_tag_unique").on(
      table.userId,
      table.tag
    ),
  })
);

export const profileBoosts = pgTable("profile_boosts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  boostType: varchar("boost_type").notNull(), // weekly, premium
  isActive: boolean("is_active").default(true).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const eliteEvents = pgTable("elite_events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: varchar("location"),
  maxAttendees: integer("max_attendees"),
  isInviteOnly: boolean("is_invite_only").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventAttendees = pgTable(
  "event_attendees",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => eliteEvents.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    rsvpStatus: varchar("rsvp_status").default("pending"), // pending, accepted, declined
  },
  (table) => ({
    eventUserUnique: uniqueIndex("event_attendees_event_user_unique").on(
      table.eventId,
      table.userId
    ),
  })
);

// Local-Cultural Edge
export const payments = pgTable("payments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").default("USD").notNull(),
  method: varchar("method").notNull(), // ecocash, visa, mastercard
  status: varchar("status").notNull(), // pending, completed, failed
  transactionId: varchar("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cities = pgTable("cities", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  country: varchar("country").default("Zimbabwe").notNull(),
  region: varchar("region"), // Harare, Bulawayo, etc.
});

export const verifications = pgTable(
  "verifications",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(), // id_card, passport, selfie
    status: varchar("status").default("pending").notNull(), // pending, approved, rejected
    documentUrl: varchar("document_url"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at"),
    reviewerNotes: text("reviewer_notes"),
  },
  (table) => ({
    userTypeUnique: uniqueIndex("verifications_user_type_unique").on(
      table.userId,
      table.type
    ),
  })
);

// Emotional Hooks
export const stories = pgTable("stories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mediaUrl: varchar("media_url"),
  mediaType: varchar("media_type"), // text, image, video
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceVibes = pgTable("voice_vibes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  audioUrl: varchar("audio_url").notNull(),
  duration: integer("duration").notNull(), // seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyQuestions = pgTable("daily_questions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  category: varchar("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionResponses = pgTable(
  "question_responses",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: varchar("question_id")
      .notNull()
      .references(() => dailyQuestions.id, { onDelete: "cascade" }),
    response: text("response").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userQuestionUnique: uniqueIndex(
      "question_responses_user_question_unique"
    ).on(table.userId, table.questionId),
  })
);

export const gifts = pgTable("gifts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  giftType: varchar("gift_type").notNull(), // rose, heart, coffee, etc.
  message: text("message"),
  cost: integer("cost").default(0).notNull(), // in cents
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

// Status & Exclusivity
export const badges = pgTable(
  "badges",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeType: varchar("badge_type").notNull(), // top_conversationalist, most_liked, explorer
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    userBadgeUnique: uniqueIndex("badges_user_badge_unique").on(
      table.userId,
      table.badgeType
    ),
  })
);

export const invites = pgTable("invites", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  inviterId: varchar("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteeEmail: varchar("invitee_email").notNull(),
  code: varchar("code").notNull().unique(),
  status: varchar("status").default("pending").notNull(), // pending, accepted, expired
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
});

// Retention Loops
export const weeklyWraps = pgTable("weekly_wraps", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weekStart: timestamp("week_start").notNull(),
  stats: jsonb("stats").notNull(), // matches, messages, likes, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mysteryMatches = pgTable("mystery_matches", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  potentialMatchId: varchar("potential_match_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isRevealed: boolean("is_revealed").default(false).notNull(),
  revealedAt: timestamp("revealed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const miniEvents = pgTable("mini_events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // mixer, speed_dating, etc.
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // minutes
  maxParticipants: integer("max_participants"),
  isLive: boolean("is_live").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventParticipants = pgTable(
  "event_participants",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => miniEvents.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
  },
  (table) => ({
    eventUserUnique: uniqueIndex("event_participants_event_user_unique").on(
      table.eventId,
      table.userId
    ),
  })
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  userInterests: many(userInterests),
  sentMessages: many(messages, { relationName: "sender" }),
  likes: many(likes, { relationName: "liker" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const interestsRelations = relations(interests, ({ many }) => ({
  userInterests: many(userInterests),
}));

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(users, { fields: [userInterests.userId], references: [users.id] }),
  interest: one(interests, {
    fields: [userInterests.interestId],
    references: [interests.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  liker: one(users, {
    fields: [likes.likerId],
    references: [users.id],
    relationName: "liker",
  }),
  liked: one(users, {
    fields: [likes.likedId],
    references: [users.id],
    relationName: "liked",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, { fields: [messages.matchId], references: [matches.id] }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  isPremium: true,
  premiumTier: true,
  language: true,
  city: true,
  isVerified: true,
  lastLogin: true,
  loginStreak: true,
  createdAt: true,
  updatedAt: true,
});

// Replit Auth specific schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Match = typeof matches.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
