import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
  description: { type: String, required: true },
  favourites: { type: Number, required: true },
  id: { type: Number, required: true, unique: true },
  image: {
    large: { type: String, required: true },
  },
  name: {
    alternative: { type: [String], default: [] },
    full: { type: String, required: true },
  },
});

export default CharacterSchema;
