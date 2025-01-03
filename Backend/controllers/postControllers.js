const Post = require("../models/postmodel");
const User = require("../models/userModel");
const Notification = require("../models/notification");
const { unlink } = require("fs").promises;
const { v2: cloudinary } = require("cloudinary");
const { error } = require("console");
const { default: mongoose, set } = require("mongoose");

const createPost = async (req, res) => {
  try {
    const { postContent } = req.body;
    const uploadedImages = [];
    const uploadedBy = req.user;
    if (!postContent) {
      return res.status(400).json({ error: "A post must have some content!" });
    }

    if (
      !!req.files.uploadedPhoto &&
      req.files.uploadedPhoto.length > 0 &&
      req.files.uploadedPhoto.length <= 4
    ) {
      await Promise.all(
        req.files.uploadedPhoto.map(async (file) => {
          try {
            const uploadRes = await cloudinary.uploader.upload(file.path, {
              folder: "X-clone/Posts",
              resource_type: "image",
            });
            await unlink(file.path);
            uploadedImages.push(uploadRes.secure_url);
          } catch (err) {
            console.error("Error uploading  the file:", err);
            return res.status(400).json({ error: "Resource type invalid!" });
          }
        })
      );

      const post = new Post({
        postContent,
        uploadedPhoto: uploadedImages,
        uploadedBy,
      });
      await post.save();
      return res.status(201).json({ message: "Post created successfully!" });
    }

    if (req.files.uploadedVideo && req.files.uploadedVideo.length > 0) {
      var uploadedVid;
      try {
        const pather = req.files.uploadedVideo[0];
        const uploadResult = await cloudinary.uploader.upload(pather.path, {
          folder: "X-clone/Videos",
          resource_type: "video",
        });
        await unlink(pather.path);
        uploadedVid = uploadResult.secure_url;
      } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Resource type invalid!" });
      }

      const post = new Post({
        postContent,
        uploadedVideo: uploadedVid,
        uploadedBy,
      });
      await post.save();
      return res.status(201).json({ message: "Post created successfully!" });
    }

    const post = new Post({
      postContent,
      uploadedBy,
    });
    await post.save();
    return res.status(201).json({ message: "Post created successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const createPoll = async (req, res) => {
  try {
    const { postContent, explanation } = req.body;
    var { options } = req.body;
    options = JSON.parse(options);
    if (!postContent)
      return res.json({ error: "Poll must have some content!" }).status(400);

    if (!options || options.length < 2)
      return res
        .json({ error: "A poll must have minimum 2 options!" })
        .status(400);

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "X-clone/Posts",
        resource_type: "image",
      });

      try {
        await unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting the file:", err);
      }
      const explanationImage = uploadRes.secure_url;
      const post = new Post({
        type: "poll",
        postContent,
        explanationImage: explanationImage,
        options,
        explanation: explanation || "",
        uploadedBy: req.user,
      });
      await post.save();
      return res.status(201).json({ message: "Poll created successfully!" });
    }

    const newPoll = new Post({
      type: "poll",
      postContent,
      options,
      explanation: explanation || "",
      uploadedBy: req.user,
    });

    await newPoll.save();
    return res.json({ message: "Poll created successfully!" }).status(200);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Make sure internet is ON!" }).status(5000);
  }
};

const submitPollAnswer = async (req, res) => {
  try {
    const { postID } = req.params;
    const { answerNumber } = req.body;
    const userID = req.user;
    const ans = Number(answerNumber);

    const post = await Post.findById(postID);

    if (!post || post.type !== "poll")
      return res.json({ error: "No such post exists!" }).json(404);

    const alreadyAnswered = post.answeredBy.filter((o) => {
      return o.userAnswered.toString() === userID;
    });

    if (alreadyAnswered.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already answered this poll!" });
    }

    await post.answeredBy.push({
      userAnswered: userID,
      optionSelected: ans,
    });

    await post.optionsCount.push({
      optionText: post.options[ans],
      vote: ans,
    });

    await post.save();

    let arr = [];
    let totalVotes = post.answeredBy.length;

    for (let i = 0; i < post.options.length; i++) {
      const matchingOptions = post.optionsCount.filter(
        (o) => o.optionText === post.options[i]
      );

      arr.push((matchingOptions.length * 100) / totalVotes);
    }

    return res
      .json({
        arr,
        totalVotes,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Internal server error!" }).status(500);
  }
};

const getPollResult = async (req, res) => {
  try {
    const { postID } = req.params;

    const post = await Post.findById(postID);

    if (!post || post.type !== "poll")
      return res.json({ error: "No such post exists!" }).status(404);

    const totalVotes = post.optionsCount.length;

    let arr = [];

    for (let i = 0; i < post.options.length; i++) {
      const matchingOptions = post.optionsCount.filter(
        (o) => o.optionText === post.options[i]
      );

      arr.push((matchingOptions.length * 100) / totalVotes);
    }

    return res
      .json({
        totalVotes,
        arr,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    return res.json({ error: "INternal server error!" }).status(500);
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

    return res.status(201).json({ message: "Commented!" });
  } catch (err) {
    return res.status(404).json({ error: "No such post exists!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit) || 5;
    const user = await User.findById(req.user);
    const posts = await Post.find({
      $and: [
        { uploadedBy: { $ne: req.user } },
        { uploadedBy: { $nin: user.blocked } },
        { uploadedBy: { $nin: user.blockedBy } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: "username profilePic accountType",
      })
      .lean();

    const postss = posts.map((post) => {
      if (post.type === "poll") {
        const totalVotes = post.optionsCount.length;

        let hasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered.toString() === req.user
        );

        if (hasAnswered.length > 0) {
          let arr = [];

          for (let i = 0; i < post.options.length; i++) {
            const matchingOptions = post.optionsCount.filter(
              (o) => o.optionText === post.options[i]
            );

            arr.push((matchingOptions.length * 100) / totalVotes);
          }

          return {
            ...post,
            totalVotes,
            arr,
            comments: post.comments.length,
            answeredBy: hasAnswered[0] || null,
          };
        }

        return {
          ...post,
          totalVotes,
          comments: post.comments.length,
          answeredBy: hasAnswered[0] || null,
        };
      }

      return {
        ...post,
        comments: post.comments.length,
      };
    });

    return res.status(200).json(postss);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const getPostsCount = async (req, res) => {
  try {
    const userID = new mongoose.Types.ObjectId(req.query.personID);

    const posts = await Post.countDocuments({
      uploadedBy: userID,
    });

    if (!posts) return res.status(200).json(0);
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Internal sever error!" }).status(500);
  }
};

const postOfFollowing = async (req, res) => {
  try {
    const userID = req.user;
    const user = await User.findById(userID);
    const following = user.following;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset);
    if (following.length <= 0) {
      return res.status(200).json([]);
    }
    const posts = await Post.find({ uploadedBy: { $in: following } })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: "-password",
      })
      .lean();
    if (!posts) {
      return res.status(200).json([]);
    }

    const postss = posts.map((post) => ({
      ...post,
      comments: post.comments.length,
    }));

    return res.status(200).json(postss);
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
      const something = await post.likes.push(userID);
      await post.save();

      if (userID != post.uploadedBy._id) {
        const informingLike = new Notification({
          to: post.uploadedBy,
          from: userID,
          topic: "like",
          read: false,
          postId: postID,
        });
        await informingLike.save();
      }

      return res
        .status(200)
        .json({ message: "Post liked successfully!", toatlLikes: something });
    } else {
      const something = await post.likes.pull(userID);
      await post.save();
      await Notification.findOneAndDelete(
        { to: post.uploadedBy },
        { from: userID },
        {
          postId: postID,
        }
      );
      return res.status(200).json({
        message: "Post unliked successfully!",
        toatlLikes: something.length,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const person = await User.findById(req.params.personid);
    if (!person) {
      return res.status(404).json({ error: "Invalid user" });
    }
    const user = await User.findById(req.user).select("blocked");

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const postss = await Post.find({
      $and: [
        { likes: { $in: req.params.personid } },
        { uploadedBy: { $nin: user.blocked } },
      ],
    })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: " username email _id profilePic createdAt ",
      })
      .lean();

    if (!postss) return res.status(200).json([]);

    const posts = postss.map((post) => {
      if (post.type === "poll") {
        const totalVotes = post.optionsCount.length;

        let hasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered.toString() === req.user
        );

        if (hasAnswered.length > 0) {
          let arr = [];

          for (let i = 0; i < post.options.length; i++) {
            const matchingOptions = post.optionsCount.filter(
              (o) => o.optionText === post.options[i]
            );

            arr.push((matchingOptions.length * 100) / totalVotes);
          }

          return {
            ...post,
            totalVotes,
            arr,
            comments: post.comments.length,
            answeredBy: hasAnswered[0] || null,
          };
        }

        return {
          ...post,
          totalVotes,
          comments: post.comments.length,
          answeredBy: hasAnswered[0] || null,
        };
      }

      return {
        ...post,
        comments: post.comments.length,
      };
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
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

    if (postToDelete.uploadedPhoto.length > 0) {
      const foldername = "X-clone/Posts";
      await Promise.all(
        postToDelete.uploadedPhoto.map(async (photo) => {
          try {
            const imgID = photo.split("/").slice(-1)[0].split(".")[0];
            const picID = `${foldername}/${imgID}`;
            await cloudinary.uploader.destroy(picID, {
              resource_type: "image",
            });
          } catch (error) {
            console.error(`Error deleting photo: ${photo}`, error);
          }
        })
      );
    }

    if (!!postToDelete.explanationImage) {
      try {
        const foldername = "X-clone/Posts";
        const imgID = postToDelete.explanationImage
          .split("/")
          .slice(-1)[0]
          .split(".")[0];
        const picID = `${foldername}/${imgID}`;
        await cloudinary.uploader.destroy(picID, {
          resource_type: "image",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error!" });
      }
    }
    if (!!postToDelete.uploadedVideo) {
      const foldername = "X-clone/Videos";
      try {
        const vidID = postToDelete.uploadedVideo
          .split("/")
          .slice(-1)[0]
          .split(".")[0];
        const videoID = `${foldername}/${vidID}`;

        await cloudinary.uploader.destroy(videoID, {
          resource_type: "video",
        });
      } catch (error) {
        console.error(`Error deleting video`, error);
      }
    }

    await Post.deleteOne({ _id: postID }, { uploadedBy: req.user });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "No such post exists!" });
  }
};

const getProfilePost = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset);
    const personID = req.params.personID;

    const user = await User.findById(req.user).select("blocked");
    const person = await User.findById(personID).select("blocked");

    if (user.blocked && person.blocked) {
      if (
        user.blocked.includes(personID) ||
        person.blocked.includes(req.user)
      ) {
        return res.json([]).status(200);
      }
    }

    const postss = await Post.find({ uploadedBy: personID })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: "-password",
      })
      .lean();

    if (!postss) return res.status(200).json([]);

    const posts = postss.map((post) => {
      if (post.type === "poll") {
        const totalVotes = post.optionsCount.length;

        let hasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered.toString() === req.user
        );

        if (hasAnswered.length > 0) {
          let arr = [];

          for (let i = 0; i < post.options.length; i++) {
            const matchingOptions = post.optionsCount.filter(
              (o) => o.optionText === post.options[i]
            );

            arr.push((matchingOptions.length * 100) / totalVotes);
          }

          return {
            ...post,
            totalVotes,
            arr,
            comments: post.comments.length,
            answeredBy: hasAnswered[0] || null,
          };
        }

        return {
          ...post,
          totalVotes,
          comments: post.comments.length,
          answeredBy: hasAnswered[0] || null,
        };
      }

      return {
        ...post,
        comments: post.comments.length,
      };
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const getPolls = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset);
    const personID = req.params.personID;

    const user = await User.findById(req.user).select("blocked");
    const person = await User.findById(personID).select("blocked");

    if (user.blocked && person.blocked) {
      if (
        user.blocked.includes(personID) ||
        person.blocked.includes(req.user)
      ) {
        return res.json([]).status(200);
      }
    }

    const postss = await Post.find({
      $and: [{ uploadedBy: personID }, { type: "poll" }],
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: "-password",
      })
      .lean();

    if (!postss || postss.length === 0) return res.status(200).json([]);

    const posts = postss.map((post) => {
      if (post.type === "poll") {
        const totalVotes = post.optionsCount.length;

        let hasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered.toString() === req.user
        );

        if (hasAnswered.length > 0) {
          let arr = [];

          for (let i = 0; i < post.options.length; i++) {
            const matchingOptions = post.optionsCount.filter(
              (o) => o.optionText === post.options[i]
            );

            arr.push((matchingOptions.length * 100) / totalVotes);
          }

          return {
            ...post,
            totalVotes,
            arr,
            comments: post.comments.length,
            answeredBy: hasAnswered[0] || null,
          };
        }

        return {
          ...post,
          totalVotes,
          comments: post.comments.length,
          answeredBy: hasAnswered[0] || null,
        };
      }

      return {
        ...post,
        comments: post.comments.length,
      };
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const getPost = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const posts = await Post.find({
      $and: [
        { _id: req.params.postID },
        { uploadedBy: { $nin: user.blocked } },
      ],
    })
      .sort({ "comments.createdAt": -1 })
      .populate({
        path: "uploadedBy",
        select: "-password",
      })
      .populate({
        path: "comments.commenter",
        select: "username _id profilePic",
      })
      .lean();

    if (posts.length === 0) {
      return res.status(404).json({ error: "Invalid post Id" });
    }

    if (posts && posts.length > 0) {
      posts[0].comments.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (posts.length > 0 && posts[0].type === "poll") {
      const totalVotes = posts[0].optionsCount.length;

      let hasAnswered = posts[0].answeredBy.filter(
        (entry) => entry.userAnswered.toString() === req.user
      );

      if (hasAnswered.length > 0) {
        let arr = [];

        for (let i = 0; i < posts[0].options.length; i++) {
          const matchingOptions = posts[0].optionsCount.filter(
            (o) => o.optionText === posts[0].options[i]
          );

          arr.push((matchingOptions.length * 100) / totalVotes);
        }

        return res
          .json({
            ...posts[0],
            totalVotes,
            arr,
            answeredBy: hasAnswered[0] || null,
          })
          .status(200);
      }

      return res.status(200).json({
        ...posts[0],
        totalVotes,
        answeredBy: hasAnswered[0] || null,
      });
    }

    return res.status(200).json(...posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    if (!post) {
      return res.json({ error: "No such post exists!" }).status(404);
    }
    const comment = await post.comments.id(req.params.commentID);
    if (!comment) {
      return res.json({ error: "No such commnet exists!" }).status(404);
    }
    if (!comment.likes.includes(req.user)) {
      await comment.likes.push(req.user);
      await post.save();
      return res.json({ message: "Liked successfully!" }).status(200);
    } else {
      await comment.likes.pull(req.user);
      await post.save();
      return res.json({ message: "unLiked successfully!" }).status(200);
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { user: userID } = req;
    const { postID, commentID } = req.params;

    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "No such post exists!" });
    }

    const commentExists = await post.comments.filter((p) => p._id == commentID);
    if (
      commentExists.length > 0 &&
      (commentExists[0].commenter._id == userID ||
        post.uploadedBy._id == userID)
    ) {
      await post.comments.pull(commentID);
      await post.save();
      return res.status(200).json({ message: "Comment deleted successfully!" });
    } else {
      return res.status(400).json({ error: "Comment cannot be deleted" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
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
  getProfilePost,
  getPost,
  likeComment,
  deleteComment,
  createPoll,
  submitPollAnswer,
  getPollResult,
  getPostsCount,
  getPolls,
};
