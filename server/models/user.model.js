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
  watching: {
    type: [Number],
    default: [],
  },
  watched: {
    type: [Number],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
