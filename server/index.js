import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express";

dotenv.config();

const allowedOrigins = ["http://localhost:5173"];

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api/users/:userId/watchlist", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }, "watchlist watching watched");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      watchlist: user.watchlist,
      watching: user.watching,
      watched: user.watched,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add or move anime to watchlist
app.post("/api/users/:userId/watchlist", requireAuth(), async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.body.data;

  if (!animeId) {
    return res.status(400).json({ error: "Missing 'animeId' in request body" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $pull: { watching: animeId, watched: animeId },
        $addToSet: { watchlist: animeId },
      },
      { new: true, upsert: false }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/users/:userId/watchlist", requireAuth(), async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.body.data;

  if (!animeId) {
    return res.status(400).json({ error: "Missing 'animeId' in request body" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $pull: { watchlist: animeId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move anime to watching
app.post("/api/users/:userId/watching", requireAuth(), async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.body.data;

  if (!animeId) {
    return res.status(400).json({ error: "Missing 'animeId' in request body" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $pull: { watchlist: animeId, watched: animeId },
        $addToSet: { watching: animeId },
      },
      { new: true, upsert: false }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move anime to watched
app.post("/api/users/:userId/watched", requireAuth(), async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.body.data;

  if (!animeId) {
    return res.status(400).json({ error: "Missing 'animeId' in request body" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $pull: { watchlist: animeId, watching: animeId },
        $addToSet: { watched: animeId },
      },
      { new: true, upsert: false }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add userId from clerk to app database
app.post("/api/clerk-webhook", async (req, res) => {
  const { id } = req.body.data;

  if (!id) {
    return res.status(400).json({ error: "Missing 'id' in request body" });
  }

  try {
    const newUser = new User({ userId: id });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  connectDB();
});
