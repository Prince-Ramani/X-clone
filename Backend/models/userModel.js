const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profilePic: {
      type: String,
      required: false,
      default: process.env.defaultProfilePic,
    },
    banner: {
      type: String,
      required: false,
      default: process.env.defaultBanner,
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    links: [
      {
        type: String,
        required: false,
        default: "",
      },
    ],
    location: {
      type: String,
      required: false,
    },
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
