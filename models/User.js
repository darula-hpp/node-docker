import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "User must have a password"],
  },
});

export default mongoose.model("User", userSchema);
