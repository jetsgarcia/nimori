import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/users/:userId/watchlist", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }, "watchlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/users/:userId/watchlist", async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.body.data;

  if (!animeId) {
    return res.status(400).json({ error: "Missing 'animeId' in request body" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $addToSet: { watchlist: animeId } },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/clerk-webhook", async (req, res) => {
  const { id } = req.body.data;

  if (!id) {
    return res.status(400).json({ error: "Missing 'id' in request body" });
  }

  const newUser = new User({ userId: id });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  connectDB();
});
