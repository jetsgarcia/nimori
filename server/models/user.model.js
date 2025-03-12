import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  watchlist: {
    type: [String],
    default: [],
  },
  waifus: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
