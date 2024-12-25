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
      default:
        "https://res.cloudinary.com/dwxzguawt/image/upload/v1727403075/defaultXprofile_siuopn.jpg",
    },
    banner: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/dwxzguawt/image/upload/v1732515390/jeremy-thomas-4dpAqfTbvKA-unsplash_xwdeqn.jpg",
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
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
