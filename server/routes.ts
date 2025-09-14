import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
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
} from "./db";

// Initialize Stripe (will be configured when user provides keys)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes (protected)
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.createProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Discovery routes (protected)
  app.get("/api/discovery", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const profiles = await storage.getDiscoverableProfiles(userId, limit);
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
      const like = await storage.likeUser(likerId, likedId);
      res.json(like);
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

  // ===== ELYSIAN NEW FEATURES ROUTES =====

  // Addictive Mechanics Routes
  app.get("/api/daily-matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyMatch = await getDailyMatches(userId, today);
      const matches = await getCuratedMatches(userId, 5);

      res.json({
        matchesShown: dailyMatch?.matchesShown || 0,
        maxMatches: dailyMatch?.maxMatches || 5,
        matches: matches,
      });
    } catch (error) {
      console.error("Error fetching daily matches:", error);
      res.status(500).json({ message: "Failed to fetch daily matches" });
    }
  });

  app.post("/api/likes", isAuthenticated, async (req: any, res) => {
    try {
      const likerId = req.user.id;
      const { likedId } = req.body;

      // Check for crush reveal (3x mutual likes)
      const mutualLikes = await getMutualLikesCount(likerId, likedId);
      if (mutualLikes >= 2) {
        // This will be the 3rd like
        await createCrushReveal(likerId, likedId);
      }

      const like = await storage.likeUser(likerId, likedId);
      res.json(like);
    } catch (error) {
      console.error("Error creating like:", error);
      res.status(500).json({ message: "Failed to create like" });
    }
  });

  app.get("/api/crush-reveals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const reveals = await getCrushReveals(userId);
      res.json(reveals);
    } catch (error) {
      console.error("Error fetching crush reveals:", error);
      res.status(500).json({ message: "Failed to fetch crush reveals" });
    }
  });

  // Premium Features Routes
  app.post("/api/incognito/toggle", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { active } = req.body;

      if (active) {
        await startIncognitoSession(userId);
      } else {
        await endIncognitoSession(userId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error toggling incognito:", error);
      res.status(500).json({ message: "Failed to toggle incognito" });
    }
  });

  app.get("/api/vibe-filters", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const filters = await getVibeFilters(userId);
      res.json(filters);
    } catch (error) {
      console.error("Error fetching vibe filters:", error);
      res.status(500).json({ message: "Failed to fetch vibe filters" });
    }
  });

  app.post("/api/vibe-filters", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { tag, enabled } = req.body;
      const filter = await setVibeFilter(userId, tag, enabled);
      res.json(filter);
    } catch (error) {
      console.error("Error setting vibe filter:", error);
      res.status(500).json({ message: "Failed to set vibe filter" });
    }
  });

  // Emotional Hooks Routes
  app.get("/api/stories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stories = await getActiveStories(userId);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.post("/api/stories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const story = await createStory(userId, req.body);
      res.json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.get("/api/daily-questions", async (req: any, res) => {
    try {
      const questions = await getActiveDailyQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching daily questions:", error);
      res.status(500).json({ message: "Failed to fetch daily questions" });
    }
  });

  app.post(
    "/api/question-responses",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const { questionId, response } = req.body;
        const questionResponse = await createQuestionResponse(
          userId,
          questionId,
          response
        );
        res.json(questionResponse);
      } catch (error) {
        console.error("Error creating question response:", error);
        res.status(500).json({ message: "Failed to create question response" });
      }
    }
  );

  app.post("/api/gifts", isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.id;
      const { receiverId, giftType, message } = req.body;
      const gift = await sendGift(senderId, receiverId, giftType, message);
      res.json(gift);
    } catch (error) {
      console.error("Error sending gift:", error);
      res.status(500).json({ message: "Failed to send gift" });
    }
  });

  // Status & Exclusivity Routes
  app.get("/api/badges", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const badges = await getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.post("/api/invites", isAuthenticated, async (req: any, res) => {
    try {
      const inviterId = req.user.id;
      const { inviteeEmail } = req.body;
      const invite = await createInvite(inviterId, inviteeEmail);
      res.json(invite);
    } catch (error) {
      console.error("Error creating invite:", error);
      res.status(500).json({ message: "Failed to create invite" });
    }
  });

  // Retention Loops Routes
  app.get("/api/weekly-wrap", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const wrap = await getWeeklyWrap(userId);
      res.json(wrap);
    } catch (error) {
      console.error("Error fetching weekly wrap:", error);
      res.status(500).json({ message: "Failed to fetch weekly wrap" });
    }
  });

  app.get("/api/mystery-matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const mysteryMatches = await getMysteryMatches(userId);
      res.json(mysteryMatches);
    } catch (error) {
      console.error("Error fetching mystery matches:", error);
      res.status(500).json({ message: "Failed to fetch mystery matches" });
    }
  });

  app.post(
    "/api/mystery-matches/:id/reveal",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const matchId = req.params.id;
        const revealed = await revealMysteryMatch(userId, matchId);
        res.json(revealed);
      } catch (error) {
        console.error("Error revealing mystery match:", error);
        res.status(500).json({ message: "Failed to reveal mystery match" });
      }
    }
  );

  app.get("/api/mini-events", async (req: any, res) => {
    try {
      const events = await getUpcomingMiniEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching mini events:", error);
      res.status(500).json({ message: "Failed to fetch mini events" });
    }
  });

  app.post(
    "/api/mini-events/:id/join",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.id;
        const eventId = req.params.id;
        const participant = await joinMiniEvent(userId, eventId);
        res.json(participant);
      } catch (error) {
        console.error("Error joining mini event:", error);
        res.status(500).json({ message: "Failed to join mini event" });
      }
    }
  );

  const httpServer = createServer(app);

  return httpServer;
}
