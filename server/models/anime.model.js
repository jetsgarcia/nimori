import mongoose from "mongoose";
import CharacterSchema from "./character.model.js";

const AnimeSchema = new mongoose.Schema({
  bannerImage: { type: String, required: true },
  characters: {
    nodes: { type: [CharacterSchema], default: [] },
  },
  coverImage: {
    extraLarge: { type: String, required: true },
  },
  description: { type: String, required: true },
  episodes: { type: Number, required: true },
  format: { type: String, required: true },
  genres: { type: [String], required: true },
  id: { type: Number, required: true, unique: true },
  startDate: {
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  status: { type: String, required: true },
  title: {
    english: { type: String },
    romaji: { type: String, required: true },
  },
});

const Anime = mongoose.model("Anime", AnimeSchema);

export default Anime;
