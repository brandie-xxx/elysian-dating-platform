import { 
  users, profiles, interests, userInterests, matches, likes, messages,
  type User, type InsertUser, type UpsertUser, type Profile, type InsertProfile,
  type Interest, type InsertInterest, type Match, type Like, type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, not, inArray, sql } from "drizzle-orm";

// Interface for all storage operations needed by the dating app
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Replit Auth operations
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Premium subscription operations
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User>;

  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Interest operations
  getAllInterests(): Promise<Interest[]>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  getUserInterests(userId: string): Promise<Interest[]>;
  addUserInterest(userId: string, interestId: string): Promise<void>;
  removeUserInterest(userId: string, interestId: string): Promise<void>;

  // Matching operations
  likeUser(likerId: string, likedId: string): Promise<Like>;
  getMatches(userId: string): Promise<Match[]>;
  checkMutualLike(user1Id: string, user2Id: string): Promise<boolean>;
  createMatch(user1Id: string, user2Id: string): Promise<Match>;

  // Discovery operations
  getDiscoverableProfiles(userId: string, limit?: number): Promise<Profile[]>;

  // Message operations
  getMatchMessages(matchId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Replit Auth operations
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Premium subscription operations
  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId,
        isPremium: true,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isPremium,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(userId: string, profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values({ ...profile, userId })
      .onConflictDoNothing({ target: [profiles.userId] })
      .returning();
    
    if (!newProfile) {
      // Profile already exists, return existing
      const [existingProfile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId));
      return existingProfile;
    }
    
    return newProfile;
  }

  async updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile || undefined;
  }

  // Interest operations
  async getAllInterests(): Promise<Interest[]> {
    return await db.select().from(interests).orderBy(asc(interests.category), asc(interests.name));
  }

  async createInterest(interest: InsertInterest): Promise<Interest> {
    const [newInterest] = await db
      .insert(interests)
      .values(interest)
      .returning();
    return newInterest;
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const result = await db
      .select({ 
        id: interests.id,
        name: interests.name,
        category: interests.category
      })
      .from(userInterests)
      .innerJoin(interests, eq(userInterests.interestId, interests.id))
      .where(eq(userInterests.userId, userId));
    
    return result;
  }

  async addUserInterest(userId: string, interestId: string): Promise<void> {
    await db
      .insert(userInterests)
      .values({ userId, interestId })
      .onConflictDoNothing({ target: [userInterests.userId, userInterests.interestId] });
  }

  async removeUserInterest(userId: string, interestId: string): Promise<void> {
    await db.delete(userInterests)
      .where(and(
        eq(userInterests.userId, userId),
        eq(userInterests.interestId, interestId)
      ));
  }

  // Matching operations
  async likeUser(likerId: string, likedId: string): Promise<Like> {
    // Prevent self-likes
    if (likerId === likedId) {
      throw new Error("Users cannot like themselves");
    }

    // Insert like (using ON CONFLICT DO NOTHING to handle duplicates)
    const [like] = await db
      .insert(likes)
      .values({ likerId, likedId })
      .onConflictDoNothing({ target: [likes.likerId, likes.likedId] })
      .returning();
    
    if (!like) {
      // Like already exists, return the existing one
      const [existingLike] = await db
        .select()
        .from(likes)
        .where(and(
          eq(likes.likerId, likerId),
          eq(likes.likedId, likedId)
        ));
      return existingLike;
    }

    // Check for mutual like and create match if it exists
    const isMutual = await this.checkMutualLike(likerId, likedId);
    if (isMutual) {
      await this.createMatch(
        likerId < likedId ? likerId : likedId, // Ensure canonical ordering
        likerId < likedId ? likedId : likerId
      );
    }

    return like;
  }

  async getMatches(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(or(
        eq(matches.user1Id, userId),
        eq(matches.user2Id, userId)
      ))
      .orderBy(desc(matches.createdAt));
  }

  async checkMutualLike(user1Id: string, user2Id: string): Promise<boolean> {
    const mutual = await db
      .select()
      .from(likes)
      .where(and(
        eq(likes.likerId, user1Id),
        eq(likes.likedId, user2Id)
      ));

    const reciprocal = await db
      .select()
      .from(likes)
      .where(and(
        eq(likes.likerId, user2Id),
        eq(likes.likedId, user1Id)
      ));

    return mutual.length > 0 && reciprocal.length > 0;
  }

  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    // Ensure canonical ordering (smaller ID first)
    const [smaller, larger] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const [match] = await db
      .insert(matches)
      .values({ user1Id: smaller, user2Id: larger })
      .onConflictDoNothing({ target: [matches.user1Id, matches.user2Id] })
      .returning();
    
    if (!match) {
      // Match already exists, return existing
      const [existingMatch] = await db
        .select()
        .from(matches)
        .where(and(
          eq(matches.user1Id, smaller),
          eq(matches.user2Id, larger)
        ));
      return existingMatch;
    }
    
    return match;
  }

  // Discovery operations
  async getDiscoverableProfiles(userId: string, limit: number = 10): Promise<Profile[]> {
    // Get list of users already liked by current user
    const likedUserIds = await db
      .select({ likedId: likes.likedId })
      .from(likes)
      .where(eq(likes.likerId, userId));

    const likedIds = likedUserIds.map(row => row.likedId);

    // Get profiles excluding:
    // 1. Current user's profile
    // 2. Users already liked
    // 3. Users already matched
    const matchedUserIds = await db
      .select({ 
        userId: sql<string>`CASE 
          WHEN ${matches.user1Id} = ${userId} THEN ${matches.user2Id}
          WHEN ${matches.user2Id} = ${userId} THEN ${matches.user1Id}
          END`.as("userId")
      })
      .from(matches)
      .where(or(
        eq(matches.user1Id, userId),
        eq(matches.user2Id, userId)
      ));

    const matchedIds = matchedUserIds.map(row => row.userId).filter(Boolean);
    const excludeIds = [userId, ...likedIds, ...matchedIds];

    return await db
      .select()
      .from(profiles)
      .where(excludeIds.length > 0 ? not(inArray(profiles.userId, excludeIds)) : undefined)
      .limit(limit);
  }

  // Message operations
  async getMatchMessages(matchId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    // Verify sender is part of the match
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, message.matchId));

    if (!match) {
      throw new Error("Match not found");
    }

    if (match.user1Id !== message.senderId && match.user2Id !== message.senderId) {
      throw new Error("Sender is not a participant in this match");
    }

    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
