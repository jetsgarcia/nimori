import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.post("/api/clerk-webhook", async (req, res) => {
  const { id } = req.body.data;
  res.json(id);
});

app.listen(port);
