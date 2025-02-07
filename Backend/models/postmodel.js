const mongoose = require("mongoose");
const { validate } = require("./userModel");
const postSchema = mongoose.Schema(
  {
    postContent: {
      type: String,
    },
    uploadedPhoto: {
      type: [String],
      default: [],
    },
    uploadedVideo: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [
      {
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
          },
        ],
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    type: {
      type: String,
      enum: ["post", "poll"],
      default: "post",
    },
    options: {
      type: [String],
      default: [],
      required: false,
    },
    answeredBy: [
      {
        userAnswered: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        optionSelected: {
          type: Number,
          required: false,
        },
      },
    ],
    optionsCount: [
      {
        optionText: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    explanation: {
      type: String,
      required: false,
      default: "",
    },
    explanationImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
