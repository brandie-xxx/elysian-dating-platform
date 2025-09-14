import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, or, gt, ne } from "drizzle-orm";
import ws from "ws";
import * as schema from "../shared/schema";
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
        // cast RHS to any to satisfy both sqlite (number ids) and pg (string ids)
        eq(schema.dailyMatches.userId, userId as any),
        eq(schema.dailyMatches.date, date as any)
      )
    )
    .limit(1);
  return result[0];
}

async function getCuratedMatches(userId: string, limit: number) {
  // Get all profiles except self
  const allProfiles = await db
    .select()
    .from(schema.profiles)
    .where(ne(schema.profiles.userId, userId as any));

  // Shuffle and take limit
  const shuffled = allProfiles.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);

  return selected.map((p) => ({
    id: p.userId,
    name: p.name,
    age: p.age,
    bio: p.bio,
    avatarUrl: p.photos?.[0] || null,
  }));
}

async function getMutualLikesCount(user1Id: string, user2Id: string) {
  const count1 = await db
    .select()
    .from(schema.likes)
    .where(
      and(
        eq(schema.likes.likerId, user1Id as any),
        eq(schema.likes.likedId, user2Id as any)
      )
    );

  const count2 = await db
    .select()
    .from(schema.likes)
    .where(
      and(
        eq(schema.likes.likerId, user2Id as any),
        eq(schema.likes.likedId, user1Id as any)
      )
    );

  return count1.length + count2.length;
}

async function createCrushReveal(user1Id: string, user2Id: string) {
  return await db.insert(schema.crushReveals).values({
    user1Id: user1Id as any,
    user2Id: user2Id as any,
    mutualLikes: 3,
    revealed: true as any,
    revealedAt: new Date(),
  });
}

async function getCrushReveals(userId: string) {
  return await db
    .select()
    .from(schema.crushReveals)
    .where(
      or(
        eq(schema.crushReveals.user1Id, userId as any),
        eq(schema.crushReveals.user2Id, userId as any)
      )
    );
}

async function startIncognitoSession(userId: string) {
  return await db.insert(schema.incognitoSessions).values({
    userId: userId as any,
    isActive: true as any,
    startedAt: new Date(),
  });
}

async function endIncognitoSession(userId: string) {
  return await db
    .update(schema.incognitoSessions)
    .set({ isActive: false as any, endedAt: new Date() })
    .where(
      and(
        eq(schema.incognitoSessions.userId, userId as any),
        eq(schema.incognitoSessions.isActive, true as any)
      )
    );
}

async function getVibeFilters(userId: string) {
  return await db
    .select()
    .from(schema.vibeFilters)
    .where(eq(schema.vibeFilters.userId, userId as any));
}

async function setVibeFilter(userId: string, tag: string, enabled: boolean) {
  const existing = await db
    .select()
    .from(schema.vibeFilters)
    .where(
      and(
        eq(schema.vibeFilters.userId, userId as any),
        eq(schema.vibeFilters.tag, tag as any)
      )
    )
    .limit(1);

  if (existing[0]) {
    return await db
      .update(schema.vibeFilters)
      .set({ enabled: enabled as any })
      .where(eq(schema.vibeFilters.id, existing[0].id));
  } else {
    return await db.insert(schema.vibeFilters).values({
      userId: userId as any,
      tag: tag as any,
      enabled: enabled as any,
    });
  }
}

async function getActiveStories(userId: string) {
  const now = new Date();
  return await db
    .select()
    .from(schema.stories)
    .where(
      and(
        eq(schema.stories.userId, userId as any),
        gt(schema.stories.expiresAt, now as any)
      )
    );
}

async function createStory(
  userId: string,
  data: { content: string; mediaUrl?: string; mediaType?: string }
) {
  return await db.insert(schema.stories).values({
    userId: userId as any,
    content: data.content,
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) as any, // 24 hours expiry
    createdAt: new Date(),
  });
}

async function getActiveDailyQuestions() {
  return await db
    .select()
    .from(schema.dailyQuestions)
    .where(eq(schema.dailyQuestions.isActive, true as any));
}

async function createQuestionResponse(
  userId: string,
  questionId: string,
  response: string
) {
  return await db.insert(schema.questionResponses).values({
    userId: userId as any,
    questionId: questionId as any,
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
    senderId: senderId as any,
    receiverId: receiverId as any,
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
    .where(eq(schema.badges.userId, userId as any));
}

async function createInvite(inviterId: string, inviteeEmail: string) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return await db.insert(schema.invites).values({
    inviterId: inviterId as any,
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
    .where(eq(schema.weeklyWraps.userId, userId as any));
}

async function getMysteryMatches(userId: string) {
  return await db
    .select()
    .from(schema.mysteryMatches)
    .where(eq(schema.mysteryMatches.userId, userId as any));
}

async function revealMysteryMatch(userId: string, matchId: string) {
  return await db
    .update(schema.mysteryMatches)
    .set({ isRevealed: true as any, revealedAt: new Date() })
    .where(
      and(
        eq(schema.mysteryMatches.userId, userId as any),
        eq(schema.mysteryMatches.id, matchId as any)
      )
    );
}

async function getUpcomingMiniEvents() {
  try {
    console.log("Querying miniEvents table...");
    const result = await db
      .select()
      .from(schema.miniEvents)
      .orderBy(schema.miniEvents.scheduledAt as any);
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
