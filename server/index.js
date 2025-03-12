import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.post("/api/clerk-webhook", async (req, res) => {
  const { id } = req.body.data;
  res.send(id);
});

app.listen(port);
