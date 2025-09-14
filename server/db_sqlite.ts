import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, or, sql, inArray, not } from "drizzle-orm";
import * as schema from "../src/db/schema";

const sqlite = new Database("./elysian.sqlite");
const db = drizzle(sqlite, { schema });

// User functions
async function createUser(
  email: string,
  passwordHash: string,
  displayName: string,
  gender?: string,
  birthDate?: string
) {
  return await db
    .insert(schema.users)
    .values({
      email,
      passwordHash,
      displayName,
      gender,
      birthDate,
    })
    .returning();
}

async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return result[0];
}

async function getUserById(id: number) {
  const result = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return result[0];
}

async function updateUser(
  id: number,
  updates: Partial<typeof schema.users.$inferInsert>
) {
  return await db
    .update(schema.users)
    .set(updates)
    .where(eq(schema.users.id, id))
    .returning();
}

// Profile functions
async function createProfile(
  userId: number,
  bio?: string,
  interests?: string,
  location?: string,
  avatarUrl?: string
) {
  return await db
    .insert(schema.profiles)
    .values({
      userId,
      bio,
      interests,
      location,
      avatarUrl,
    })
    .returning();
}

async function updateProfile(
  userId: number,
  updates: Partial<typeof schema.profiles.$inferInsert>
) {
  return await db
    .update(schema.profiles)
    .set(updates)
    .where(eq(schema.profiles.userId, userId))
    .returning();
}

async function getProfileByUserId(userId: number) {
  const result = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, userId))
    .limit(1);
  return result[0];
}

// Matching functions
async function createMatch(user1Id: number, user2Id: number) {
  return await db
    .insert(schema.matches)
    .values({
      user1Id,
      user2Id,
    })
    .returning();
}

async function getMatchesForUser(userId: number) {
  return await db
    .select()
    .from(schema.matches)
    .where(
      or(eq(schema.matches.user1Id, userId), eq(schema.matches.user2Id, userId))
    );
}

async function findPotentialMatches(userId: number, limit: number = 10) {
  // Simple matching: exclude already matched users and self
  const matchedUserIds = await db
    .select({
      user1Id: schema.matches.user1Id,
      user2Id: schema.matches.user2Id,
    })
    .from(schema.matches)
    .where(
      or(eq(schema.matches.user1Id, userId), eq(schema.matches.user2Id, userId))
    );

  const excludeIds = new Set([userId]);
  matchedUserIds.forEach((match) => {
    excludeIds.add(match.user1Id);
    excludeIds.add(match.user2Id);
  });

  return await db
    .select({
      id: schema.users.id,
      displayName: schema.users.displayName,
      gender: schema.users.gender,
      birthDate: schema.users.birthDate,
      bio: schema.profiles.bio,
      interests: schema.profiles.interests,
      location: schema.profiles.location,
      avatarUrl: schema.profiles.avatarUrl,
      premium: schema.profiles.premium,
    })
    .from(schema.users)
    .leftJoin(schema.profiles, eq(schema.users.id, schema.profiles.userId))
    .where(not(inArray(schema.users.id, Array.from(excludeIds))))
    .limit(limit);
}

// Messaging functions
async function createMessage(
  matchId: number,
  senderId: number,
  content: string
) {
  return await db
    .insert(schema.messages)
    .values({
      matchId,
      senderId,
      content,
    })
    .returning();
}

async function getMessagesForMatch(matchId: number) {
  return await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.matchId, matchId))
    .orderBy(schema.messages.sentAt);
}

// Premium functions
async function upgradeToPremium(userId: number) {
  return await db
    .update(schema.profiles)
    .set({ premium: 1 })
    .where(eq(schema.profiles.userId, userId))
    .returning();
}

async function isPremiumUser(userId: number) {
  const profile = await getProfileByUserId(userId);
  return profile?.premium === 1;
}

export {
  db,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  createProfile,
  updateProfile,
  getProfileByUserId,
  createMatch,
  getMatchesForUser,
  findPotentialMatches,
  createMessage,
  getMessagesForMatch,
  upgradeToPremium,
  isPremiumUser,
};
