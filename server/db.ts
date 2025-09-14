import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, or, gt } from "drizzle-orm";
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

async function getDailyMatches(userId: string, date: Date) {
  const result = await db
    .select()
    .from(schema.dailyMatches)
    .where(
      and(
        eq(schema.dailyMatches.userId, userId),
        eq(schema.dailyMatches.date, date)
      )
    )
    .limit(1);
  return result[0];
}

async function getCuratedMatches(userId: string, limit: number) {
  // Placeholder: fetch curated matches logic
  return await db.select().from(schema.profiles).limit(limit);
}

async function getMutualLikesCount(user1Id: string, user2Id: string) {
  const count1 = await db
    .select()
    .from(schema.likes)
    .where(
      and(eq(schema.likes.likerId, user1Id), eq(schema.likes.likedId, user2Id))
    );

  const count2 = await db
    .select()
    .from(schema.likes)
    .where(
      and(eq(schema.likes.likerId, user2Id), eq(schema.likes.likedId, user1Id))
    );

  return count1.length + count2.length;
}

async function createCrushReveal(user1Id: string, user2Id: string) {
  return await db.insert(schema.crushReveals).values({
    user1Id,
    user2Id,
    mutualLikes: 3,
    revealed: true,
    revealedAt: new Date(),
  });
}

async function getCrushReveals(userId: string) {
  return await db
    .select()
    .from(schema.crushReveals)
    .where(
      or(
        eq(schema.crushReveals.user1Id, userId),
        eq(schema.crushReveals.user2Id, userId)
      )
    );
}

async function startIncognitoSession(userId: string) {
  return await db.insert(schema.incognitoSessions).values({
    userId,
    isActive: true,
    startedAt: new Date(),
  });
}

async function endIncognitoSession(userId: string) {
  return await db
    .update(schema.incognitoSessions)
    .set({ isActive: false, endedAt: new Date() })
    .where(
      and(
        eq(schema.incognitoSessions.userId, userId),
        eq(schema.incognitoSessions.isActive, true)
      )
    );
}

async function getVibeFilters(userId: string) {
  return await db
    .select()
    .from(schema.vibeFilters)
    .where(eq(schema.vibeFilters.userId, userId));
}

async function setVibeFilter(userId: string, tag: string, enabled: boolean) {
  const existing = await db
    .select()
    .from(schema.vibeFilters)
    .where(
      and(
        eq(schema.vibeFilters.userId, userId),
        eq(schema.vibeFilters.tag, tag)
      )
    )
    .limit(1);

  if (existing[0]) {
    return await db
      .update(schema.vibeFilters)
      .set({ enabled })
      .where(eq(schema.vibeFilters.id, existing[0].id));
  } else {
    return await db.insert(schema.vibeFilters).values({ userId, tag, enabled });
  }
}

async function getActiveStories(userId: string) {
  const now = new Date();
  return await db
    .select()
    .from(schema.stories)
    .where(
      and(eq(schema.stories.userId, userId), gt(schema.stories.expiresAt, now))
    );
}

async function createStory(
  userId: string,
  data: { content: string; mediaUrl?: string; mediaType?: string }
) {
  return await db.insert(schema.stories).values({
    userId,
    content: data.content,
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    createdAt: new Date(),
  });
}

async function getActiveDailyQuestions() {
  return await db
    .select()
    .from(schema.dailyQuestions)
    .where(eq(schema.dailyQuestions.isActive, true));
}

async function createQuestionResponse(
  userId: string,
  questionId: string,
  response: string
) {
  return await db.insert(schema.questionResponses).values({
    userId,
    questionId,
    response,
    createdAt: new Date(),
  });
}

async function sendGift(
  senderId: string,
  receiverId: string,
  giftType: string,
  message: string
) {
  return await db.insert(schema.gifts).values({
    senderId,
    receiverId,
    giftType,
    message,
    cost: 0,
    sentAt: new Date(),
  });
}

async function getUserBadges(userId: string) {
  return await db
    .select()
    .from(schema.badges)
    .where(eq(schema.badges.userId, userId));
}

async function createInvite(inviterId: string, inviteeEmail: string) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return await db.insert(schema.invites).values({
    inviterId,
    inviteeEmail,
    code,
    status: "pending",
    createdAt: new Date(),
  });
}

async function getWeeklyWrap(userId: string) {
  return await db
    .select()
    .from(schema.weeklyWraps)
    .where(eq(schema.weeklyWraps.userId, userId));
}

async function getMysteryMatches(userId: string) {
  return await db
    .select()
    .from(schema.mysteryMatches)
    .where(eq(schema.mysteryMatches.userId, userId));
}

async function revealMysteryMatch(userId: string, matchId: string) {
  return await db
    .update(schema.mysteryMatches)
    .set({ isRevealed: true, revealedAt: new Date() })
    .where(
      and(
        eq(schema.mysteryMatches.userId, userId),
        eq(schema.mysteryMatches.id, matchId)
      )
    );
}

async function getUpcomingMiniEvents() {
  try {
    console.log("Querying miniEvents table...");
    const result = await db
      .select()
      .from(schema.miniEvents)
      .orderBy(schema.miniEvents.scheduledAt);
    console.log(`Found ${result.length} mini events`);
    return result;
  } catch (error) {
    console.error("Database error in getUpcomingMiniEvents:", error);
    throw error;
  }
}

async function joinMiniEvent(userId: string, eventId: string) {
  return await db.insert(schema.eventParticipants).values({
    userId,
    eventId,
    joinedAt: new Date(),
  });
}

export {
  db,
  getDailyMatches,
  getCuratedMatches,
  getMutualLikesCount,
  createCrushReveal,
  getCrushReveals,
  startIncognitoSession,
  endIncognitoSession,
  getVibeFilters,
  setVibeFilter,
  getActiveStories,
  createStory,
  getActiveDailyQuestions,
  createQuestionResponse,
  sendGift,
  getUserBadges,
  createInvite,
  getWeeklyWrap,
  getMysteryMatches,
  revealMysteryMatch,
  getUpcomingMiniEvents,
  joinMiniEvent,
};
