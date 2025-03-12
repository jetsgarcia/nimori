import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  watchlist: {
    type: [Number],
    default: [],
  },
  favorites: {
    type: [Number],
    default: [],
  },
  waifus: {
    type: [Number],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
