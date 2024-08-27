const Post = require("../models/postmodel");
const User = require("../models/userModel");
const Notification = require("../models/notification");
const createPost = async (req, res) => {
  try {
    const { body, title } = req.body;
    let { postImg } = req.body;
    const uploadedBy = req.user;

    if (!body || !title) {
      return res
        .status(400)
        .json({ error: "A post must have title and body !" });
    }

    if (postImg) {
      const uploadRes = await cloudinary.uploader.upload(postImg);
      postImg = uploadRes.secure_url;
      const post = new Post({
        title,
        body,
        postImg,
        uploadedBy,
      });
      await post.save();
      return res.status(201).json({ message: "Post created successfully" });
    }
    const post = new Post({
      title,
      body,
      uploadedBy,
    });
    await post.save();
    return res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    return res.status(500).json("Internal server error");
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const commenter = req.user;
    const { text } = req.body;

    const newComment = await Post.findByIdAndUpdate(
      postID,
      { $push: { comments: { text, commenter } } },
      { new: true }
    );
    if (!newComment) {
      return res.status(400).json({ error: "No such post exists" });
    }
    const populatedComment = await Post.findById(postID).populate({
      path: "comments.commenter",
      select: "-password",
    }); //not saving

    return res.status(201).json(populatedComment);
  } catch (err) {
    return res.status(404).json({ error: "No such post exists!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate({
      path: "uploadedBy",
      select: "-password",
    });
    if (!posts) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const postOfFollowing = async (req, res) => {
  try {
    const userID = req.user;
    const user = await User.findById(userID);
    const following = user.following;
    if (following.length <= 0) {
      return res.status(200).json({ message: "You aren't following anyone" });
    }
    const posts = await Post.find({ uploadedBy: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "uploadedBy",
        select: "-password",
      });
    if (!posts) {
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const likePost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const userID = req.user;
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "No such post exists" });
    }
    const liked = post.likes.includes(userID);
    if (!liked) {
      await Post.findByIdAndUpdate(postID, { $push: { likes: userID } });

      const informingLike = new Notification({
        to: post.uploadedBy,
        from: userID,
        topic: "like",
        read: false,
      });
      await informingLike.save();

      return res.status(200).json({ message: "Post liked successfully!" });
    } else {
      await Post.findByIdAndUpdate(postID, { $pull: { likes: userID } });
      await Notification.findOneAndDelete(
        { to: post.uploadedBy },
        { from: userID }
      );
      return res.status(200).json({ message: "Post unliked successfully!" });
    }
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const person = await User.findById(req.params.personid);
    if (!person) {
      return res.status(404).json({ error: "Invalid user" });
    }
    const posts = await Post.find({ likes: { $in: person._id } }).populate({
      path: "likes",
      select: "-password",
    });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(404).json({ error: "Invalid user!" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const postToDelete = await Post.findById(postID);
    if (!postToDelete) {
      return res.status(404).json({ error: "No such post exists" });
    }
    if (postToDelete.uploadedBy != req.user) {
      return res.status(400).json({ error: "You can't delete others posts!" });
    }
    const deleted = await Post.deleteOne(
      { _id: postID },
      { uploadedBy: req.user }
    );
    return res.status(200).json({ error: "Post deleted successfully" });
  } catch (err) {
    return res.status(404).json({ error: "No such post exists!" });
  }
};

module.exports = {
  createPost,
  getPosts,
  commentOnPost,
  postOfFollowing,
  likePost,
  getLikedPosts,
  deletePost,
};
