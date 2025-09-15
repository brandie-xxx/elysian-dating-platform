import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and, or, gt, ne, sql, not } from "drizzle-orm";
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

  // Filter out already matched users
  const existingMatches = await db
    .select()
    .from(schema.matches)
    .where(
      or(
        eq(schema.matches.user1Id, userId as any),
        eq(schema.matches.user2Id, userId as any)
      )
    );

  const matchedUserIds = new Set(
    existingMatches
      .flatMap((m: any) => [m.user1Id, m.user2Id])
      .filter((id: any) => id !== userId)
  );

  const filteredProfiles = allProfiles.filter(
    (p: any) => !matchedUserIds.has(p.userId)
  );

  // Shuffle and take limit
  const shuffled = filteredProfiles.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);

  return selected.map((p: any) => ({
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

async function updateLoginStreak(userId: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get current streak record
  const existingStreak = await db
    .select()
    .from(schema.streaks)
    .where(eq(schema.streaks.userId, userId as any))
    .limit(1);

  let currentStreak = 0;
  let longestStreak = 0;
  let lastStreakDate = null;

  if (existingStreak[0]) {
    currentStreak = existingStreak[0].currentStreak || 0;
    longestStreak = existingStreak[0].longestStreak || 0;
    lastStreakDate = existingStreak[0].lastStreakDate;
  }

  // Check if login was yesterday
  const lastLoginWasYesterday =
    lastStreakDate &&
    new Date(lastStreakDate).toDateString() === yesterday.toDateString();

  if (lastLoginWasYesterday) {
    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  } else if (
    !lastStreakDate ||
    new Date(lastStreakDate).toDateString() !== today.toDateString()
  ) {
    // Reset streak if not consecutive or first login
    currentStreak = 1;
  }

  // Update or insert streak record
  const streakData = {
    userId: userId as any,
    currentStreak,
    longestStreak,
    lastStreakDate: today,
    updatedAt: new Date(),
  };

  if (existingStreak[0]) {
    await db
      .update(schema.streaks)
      .set(streakData)
      .where(eq(schema.streaks.userId, userId as any));
  } else {
    await db.insert(schema.streaks).values(streakData);
  }

  // Also update user's loginStreak field for backward compatibility
  await db
    .update(schema.users)
    .set({
      loginStreak: currentStreak,
      lastLogin: new Date(),
    })
    .where(eq(schema.users.id, userId as any));

  return { currentStreak, longestStreak };
}

async function getUserStreak(userId: string) {
  const streak = await db
    .select()
    .from(schema.streaks)
    .where(eq(schema.streaks.userId, userId as any))
    .limit(1);

  if (streak[0]) {
    return {
      currentStreak: streak[0].currentStreak || 0,
      longestStreak: streak[0].longestStreak || 0,
      lastStreakDate: streak[0].lastStreakDate,
    };
  }

  return { currentStreak: 0, longestStreak: 0, lastStreakDate: null };
}

async function checkAndAwardRewards(userId: string, interactionType: string) {
  const rewards = [];

  // Get user's interaction counts
  const [likeCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.likes)
    .where(eq(schema.likes.likerId, userId as any));

  const [messageCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.messages)
    .where(eq(schema.messages.senderId, userId as any));

  const [matchCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.matches)
    .where(
      or(
        eq(schema.matches.user1Id, userId as any),
        eq(schema.matches.user2Id, userId as any)
      )
    );

  const totalLikes = likeCount?.count || 0;
  const totalMessages = messageCount?.count || 0;
  const totalMatches = matchCount?.count || 0;

  // Check for milestone rewards
  const milestones = [
    {
      type: "likes_milestone",
      threshold: 10,
      value: 5,
      desc: "Sent 10 likes!",
    },
    {
      type: "likes_milestone",
      threshold: 50,
      value: 25,
      desc: "Sent 50 likes!",
    },
    {
      type: "likes_milestone",
      threshold: 100,
      value: 50,
      desc: "Sent 100 likes!",
    },
    {
      type: "messages_milestone",
      threshold: 25,
      value: 10,
      desc: "Sent 25 messages!",
    },
    {
      type: "messages_milestone",
      threshold: 100,
      value: 50,
      desc: "Sent 100 messages!",
    },
    {
      type: "matches_milestone",
      threshold: 5,
      value: 15,
      desc: "Got 5 matches!",
    },
    {
      type: "matches_milestone",
      threshold: 20,
      value: 75,
      desc: "Got 20 matches!",
    },
  ];

  for (const milestone of milestones) {
    let currentCount = 0;
    if (milestone.type === "likes_milestone") currentCount = totalLikes;
    else if (milestone.type === "messages_milestone")
      currentCount = totalMessages;
    else if (milestone.type === "matches_milestone")
      currentCount = totalMatches;

    if (currentCount >= milestone.threshold) {
      // Check if reward already claimed
      const existingReward = await db
        .select()
        .from(schema.rewards)
        .where(
          and(
            eq(schema.rewards.userId, userId as any),
            eq(schema.rewards.type, milestone.type),
            eq(schema.rewards.description, milestone.desc)
          )
        )
        .limit(1);

      if (!existingReward[0]) {
        await db.insert(schema.rewards).values({
          userId: userId as any,
          type: milestone.type,
          description: milestone.desc,
          value: milestone.value,
        });
        rewards.push(milestone);
      }
    }
  }

  // Daily interaction rewards
  if (interactionType === "like" || interactionType === "message") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayInteractions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(interactionType === "like" ? schema.likes : schema.messages)
      .where(
        and(
          eq(
            interactionType === "like"
              ? schema.likes.likerId
              : schema.messages.senderId,
            userId as any
          ),
          sql`${
            interactionType === "like"
              ? schema.likes.createdAt
              : schema.messages.createdAt
          } >= ${today}`
        )
      );

    const dailyCount = todayInteractions?.count || 0;

    // Award points for daily activity
    if (dailyCount === 5) {
      await db.insert(schema.rewards).values({
        userId: userId as any,
        type: "daily_activity",
        description: `Active day! ${dailyCount} ${
          interactionType === "like" ? "likes" : "messages"
        } sent today.`,
        value: 2,
      });
      rewards.push({
        type: "daily_activity",
        value: 2,
        desc: `Active day! ${dailyCount} ${
          interactionType === "like" ? "likes" : "messages"
        } sent today.`,
      });
    } else if (dailyCount === 10) {
      await db.insert(schema.rewards).values({
        userId: userId as any,
        type: "daily_activity",
        description: `Super active! ${dailyCount} ${
          interactionType === "like" ? "likes" : "messages"
        } sent today.`,
        value: 5,
      });
      rewards.push({
        type: "daily_activity",
        value: 5,
        desc: `Super active! ${dailyCount} ${
          interactionType === "like" ? "likes" : "messages"
        } sent today.`,
      });
    }
  }

  return rewards;
}

async function getUserRewards(userId: string) {
  const rewards = await db
    .select()
    .from(schema.rewards)
    .where(eq(schema.rewards.userId, userId as any))
    .orderBy(schema.rewards.claimedAt);

  return rewards;
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
  updateLoginStreak,
  getUserStreak,
  checkAndAwardRewards,
  getUserRewards,
};
