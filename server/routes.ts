import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import axios from "axios";
import { storage } from "./storage";
import authRouter, { isAuthenticated } from "./auth";
import { db } from "./db";
import { users, dailyMatches, streaks } from "@shared/schema";
import { and, eq } from "drizzle-orm";

import * as dbSqlite from "./db_sqlite";
import { isPremium as requirePremium } from "./middleware/isPremium";
import {
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
} from "./db";
import { readStat, incrementStat } from "./stats";
import bcrypt from "bcrypt";

// Initialize Stripe (will be configured when user provides keys)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Use new auth router for authentication routes
  app.use("/api", authRouter);

  // Signup route
  app.post("/api/signup", async (req: any, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const bcrypt = require("bcrypt");
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert new user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          // Use email as username or remove username if not in schema
          passwordHash,
          createdAt: new Date(),
        })
        .returning();

      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to signup" });
    }
  });

  // Improved login error messages
  app.post("/api/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid credentials: user not found" });
      }

      const bcrypt = require("bcrypt");
      const valid = await bcrypt.compare(password, user.passwordHash || "");
      if (!valid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials: incorrect password" });
      }

      // TODO: Generate and return auth token or session
      res.json({ success: true, userId: user.id });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Profile routes (protected)
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await dbSqlite.getProfileByUserId(userId);
      const streak = await getUserStreak(userId);
      const rewards = await getUserRewards(userId);
      res.json({ ...profile, streak, rewards });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await dbSqlite.createProfile({ userId, ...req.body });
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await dbSqlite.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change password (protected)
  app.post("/api/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both current and new passwords are required" });
      }

      // Fetch user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (!user) return res.status(404).json({ message: "User not found" });

      const valid = await bcrypt.compare(
        currentPassword,
        user.passwordHash || ""
      );
      if (!valid)
        return res
          .status(403)
          .json({ message: "Current password is incorrect" });

      const newHash = await bcrypt.hash(newPassword, 10);
      await db
        .update(users)
        .set({ passwordHash: newHash, updatedAt: new Date() })
        .where(eq(users.id, userId));

      res.json({ success: true });
    } catch (err) {
      console.error("Error changing password:", err);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // User role route (protected)
  app.put("/api/user/role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { role } = req.body;

      // For now, we'll store the role in the profile as a bio field or just acknowledge
      // Since role field doesn't exist, we'll just return success
      res.json({ success: true, role });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Discovery routes (protected)
  app.get("/api/discovery", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const filters = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : {};
      const profiles = await dbSqlite.findPotentialMatches(userId, {
        ...filters,
        limit,
      });
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching discoverable profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Likes and matches routes (protected)
  app.post("/api/likes", isAuthenticated, async (req: any, res) => {
    try {
      const likerId = req.user.id;
      const { likedId } = req.body;

      // Check for crush reveal (3x mutual likes)
      const mutualLikes = await getMutualLikesCount(likerId, likedId);
      let crushRevealed = false;
      if (mutualLikes >= 2) {
        // This will be the 3rd like
        await createCrushReveal(likerId, likedId);
        crushRevealed = true;
      }

      const like = await storage.likeUser(likerId, likedId);

      // Check for rewards after successful like
      const rewards = await checkAndAwardRewards(likerId, "like");

      res.json({ like, rewards, crushRevealed });
    } catch (error) {
      console.error("Error creating like:", error);
      res.status(500).json({ message: "Failed to create like" });
    }
  });

  app.get("/api/matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Premium subscription routes
  app.post(
    "/api/create-subscription",
    isAuthenticated,
    async (req: any, res) => {
      if (!stripe) {
        return res
          .status(500)
          .json({ message: "Payment system not configured" });
      }

      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);

        if (!user || !user.email) {
          return res.status(400).json({ message: "User email required" });
        }

        // Check if user already has a subscription
        if (user.stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            user.stripeSubscriptionId
          );
          if (subscription.status === "active") {
            return res.json({
              message: "Already subscribed",
              clientSecret: null,
            });
          }
        }

        // Create or retrieve Stripe customer
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email,
          });
          customerId = customer.id;
        }

        // Create a product and price first
        const product = await stripe.products.create({
          name: "Elysian Premium - Zimbabwe Dating",
          description:
            "Premium features including unlimited messaging, exact location matching, and exclusive access",
        });

        const price = await stripe.prices.create({
          unit_amount: 250, // $2.50 in cents
          currency: "usd",
          recurring: {
            interval: "month",
          },
          product: product.id,
        });

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: price.id }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });

        // Update user with Stripe info
        await storage.updateUserStripeInfo(userId, customerId, subscription.id);

        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = (invoice as any).payment_intent;

        res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error: any) {
        console.error("Subscription creation error:", error);
        res
          .status(500)
          .json({ message: "Failed to create subscription: " + error.message });
      }
    }
  );

  // Check subscription status
  app.get(
    "/api/subscription-status",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({
          isPremium: user.isPremium || false,
          hasSubscription: !!user.stripeSubscriptionId,
        });
      } catch (error) {
        console.error("Error checking subscription status:", error);
        res
          .status(500)
          .json({ message: "Failed to check subscription status" });
      }
    }
  );

  // PayNow Payment Routes
  app.post("/api/pay/initiate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required" });
      }

      const { phone, amount, method } = req.body;

      const PAYNOW_URL =
        "https://www.paynow.co.zw/interface/initiatetransaction";
      const INTEGRATION_ID =
        process.env.PAYNOW_INTEGRATION_ID || "your_integration_id";
      const INTEGRATION_KEY =
        process.env.PAYNOW_INTEGRATION_KEY || "your_integration_key";

      const reference = `ELYSIAN_${userId}_${Date.now()}`;
      const payload = new URLSearchParams();
      payload.append("id", INTEGRATION_ID);
      payload.append("key", INTEGRATION_KEY);
      payload.append("reference", reference);
      payload.append("amount", String(amount || 2.5)); // Default premium price
      payload.append("additionalinfo", "Elysian Premium Subscription");
      payload.append(
        "returnurl",
        `${process.env.BASE_URL || "http://localhost:3000"}/payment/return`
      );
      payload.append(
        "resulturl",
        `${process.env.BASE_URL || "http://localhost:3000"}/api/pay/callback`
      );
      payload.append("authemail", user.email);
      if (phone) payload.append("phone", phone);
      payload.append("method", (method || "ecocash").toLowerCase());

      const response = await axios.post(PAYNOW_URL, payload.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      });

      // PayNow returns a text/html or JSON payload with browserurl/pollurl; try to parse
      const data = response.data;
      res.json({
        redirectUrl: data?.browserurl || data?.redirect || null,
        pollUrl: data?.pollurl || data?.poll || null,
        reference,
      });
    } catch (error: any) {
      console.error("PayNow initiation error:", error);
      res
        .status(500)
        .json({ message: "Failed to initiate payment: " + error.message });
    }
  });

  app.post("/api/pay/callback", async (req: any, res) => {
    try {
      // PayNow may POST form-encoded or JSON; normalize
      const data = req.body || {};
      console.log("PayNow callback raw body:", data);

      // support querystring fallback
      const payload = Object.keys(data).length ? data : req.query || {};

      // Extract userId from reference (format: ELYSIAN_{userId}_{timestamp})
      const reference = payload.reference || payload.ref || payload.RRR || "";
      if (!reference || !String(reference).startsWith("ELYSIAN_")) {
        console.warn(
          "Invalid or missing reference on PayNow callback",
          reference
        );
        return res.status(400).json({ message: "Invalid reference" });
      }

      const parts = String(reference).split("_");
      const userId = parts[1];

      const status = String(
        payload.status || payload.Status || payload.stat || ""
      );
      const amountRaw = payload.amount || payload.AMT || payload.value || 0;
      const amount = Number(amountRaw) || 0;
      const method = payload.method || payload.payment_method || "ecocash";
      const transactionId =
        payload.paynowreference || payload.txn_id || payload.transactionId;

      if (
        status === "Paid" ||
        status === "Awaiting Delivery" ||
        status === "OK"
      ) {
        // Update user to premium (storage expects string id)
        await storage.updateUserPremiumStatus(String(userId), true);

        // Record payment (amount may be in currency unit, storage will convert)
        await storage.createPayment({
          userId: String(userId),
          amount: Number(amount),
          currency: String(payload.currency || "USD"),
          method: String(method),
          status: "completed",
          transactionId: String(transactionId || ""),
        });
      } else {
        // record pending/failed
        await storage.createPayment({
          userId: String(userId),
          amount: Number(amount),
          currency: String(payload.currency || "USD"),
          method: String(method),
          status: "pending",
          transactionId: String(transactionId || ""),
        });
      }

      res.json({ status: "ok" });
    } catch (err) {
      console.error("PayNow callback error:", err);
      res.status(500).json({ message: "Callback processing failed" });
    }
  });

  // ===== ELYSIAN NEW FEATURES ROUTES =====

  // Addictive Mechanics Routes
  app.get("/api/daily-matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let dailyMatch = await getDailyMatches(userId, today);
      if (!dailyMatch) {
        // Create daily match record with random 3-5 matches
        const maxMatches = Math.floor(Math.random() * 3) + 3;
        await db.insert(dailyMatches).values({
          userId,
          date: today,
          matchesShown: 0,
          maxMatches,
        });
        dailyMatch = { matchesShown: 0, maxMatches };
      }

      const remaining = dailyMatch.maxMatches - dailyMatch.matchesShown;
      if (remaining <= 0) {
        return res.json({
          matchesShown: dailyMatch.matchesShown,
          maxMatches: dailyMatch.maxMatches,
          matches: [],
          message: "Daily limit reached",
        });
      }

      const matches = await getCuratedMatches(userId, remaining);

      // Update matches shown
      await db
        .update(dailyMatches)
        .set({ matchesShown: dailyMatch.matchesShown + matches.length })
        .where(
          and(eq(dailyMatches.userId, userId), eq(dailyMatches.date, today))
        );

      res.json({
        matchesShown: dailyMatch.matchesShown + matches.length,
        maxMatches: dailyMatch.maxMatches,
        matches: matches,
      });
    } catch (error) {
      console.error("Error fetching daily matches:", error);
      res.status(500).json({ message: "Failed to fetch daily matches" });
    }
  });

  // Incognito mode: premium-only
  app.post(
    "/api/incognito/start",
    isAuthenticated,
    requirePremium,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const session = await startIncognitoSession(userId);
        res.json(session);
      } catch (err) {
        console.error("Error starting incognito:", err);
        res.status(500).json({ message: "Failed to start incognito" });
      }
    }
  );

  app.post(
    "/api/incognito/end",
    isAuthenticated,
    requirePremium,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const result = await endIncognitoSession(userId);
        res.json(result);
      } catch (err) {
        console.error("Error ending incognito:", err);
        res.status(500).json({ message: "Failed to end incognito" });
      }
    }
  );

  // Sample premium-only route for testing
  app.get(
    "/api/premium/me",
    isAuthenticated,
    requirePremium,
    async (req: any, res) => {
      try {
        const user = await storage.getUser(req.user.id);
        res.json({ user, premium: true });
      } catch (err) {
        console.error("Error in /api/premium/me:", err);
        res.status(500).json({ message: "Failed to fetch premium info" });
      }
    }
  );

  // Create HTTP server
  // Simple global stats endpoints (server-driven counters)
  app.get("/api/stats/:id", async (req, res) => {
    try {
      const id = String(req.params.id || "");
      const value = await readStat(id);
      res.json({ id, value });
    } catch (err) {
      console.error("Error reading stat", err);
      res.status(500).json({ message: "Failed to read stat" });
    }
  });

  app.post("/api/stats/:id/increment", async (req, res) => {
    try {
      const id = String(req.params.id || "");
      const by = req.body?.by ? Number(req.body.by) : 1;
      const value = await incrementStat(id, by);
      res.json({ id, value });
    } catch (err) {
      console.error("Error incrementing stat", err);
      res.status(500).json({ message: "Failed to increment stat" });
    }
  });
  const server = createServer(app);
  return server;
}
