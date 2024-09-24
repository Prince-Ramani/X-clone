const User = require("./userModel");
const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  postContent: {
    type: String,
  },
  uploadedPhoto: {
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
      createdAt:{
        type : Date,
        default : Date.now
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
  }
},{
  timestamps :true
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
