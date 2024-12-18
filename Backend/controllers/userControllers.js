const Notification = require("../models/notification");
const User = require("../models/userModel");
const Bookmark = require("../models/bookmark");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../Cloudinary/cloudinary");

const fs = require("fs").promises;
const { default: mongoose } = require("mongoose");
const Post = require("../models/postmodel");

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const getProfile = async (req, res) => {
  try {
    const { username: UserName } = req.params;
    const profile = await User.findOne({ username: UserName }).select(
      "-password"
    );
    if (!profile) {
      return res
        .status(404)
        .json({ error: "Account with this id doesn't exists" });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const followPerson = async (req, res) => {
  try {
    const { id: profileID } = req.params;
    const userToFollow = await User.findById(profileID).select("-password");
    if (!userToFollow) {
      return res
        .status(404)
        .json({ error: "Account with this id doesn't exists" });
    }
    const me = await User.findById(req.user);
    if (userToFollow.id === me.id) {
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow youself" });
    }
    const following = await me.following.includes(userToFollow.id);
    if (!following) {
      //Follow
      await User.findByIdAndUpdate(me.id, {
        $push: { following: userToFollow.id },
      });
      await User.findByIdAndUpdate(userToFollow.id, {
        $push: { followers: me.id },
      });
      const informing = new Notification({
        to: userToFollow.id,
        from: me.id,
        topic: "follow",
        read: false,
      });
      await informing.save();

      return res.status(200).json({ message: "followed successfully" });
    } else {
      //Unfollow
      await User.findByIdAndUpdate(me.id, {
        $pull: { following: userToFollow.id },
      });
      const updated = await User.findByIdAndUpdate(userToFollow.id, {
        $pull: { followers: me.id },
      });
      await Notification.findOneAndDelete(
        { to: userToFollow.id },
        { from: me.id }
      );
      return res.status(200).json({ message: "unfollowed successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const myself = await User.findById(req.user);
    const noti = await Notification.find({
      to: myself.id,
    })
      .populate({
        path: "from",
        select: "-password",
      })
      .populate({
        path: "postId",
        select: "postContent _id ",
      });
    await Notification.updateMany(
      { to: myself.id, read: false },
      { read: true }
    );
    return res.status(200).json(noti);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    var { username, newpass, password, bio, location } = req.body;
    var newPassword, newUserName;
    const { banner, profilePic } = req.files;
    var newProfilePic, newBanner;

    if (!password) {
      return res
        .status(400)
        .json({ error: "password is required to update profile!" });
    }
    const user = await User.findById(req.user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({ error: "Incorrect password" });
    }
    if (username && username !== "") {
      username = username.trim();
      const userNameAvailable = await User.exists({ username });
      if (userNameAvailable.length === 0) {
        newUserName = username;
      } else {
        return res.status(400).json({ erro: "Username already taken!" });
      }
    }
    if (newpass) {
      newpass = newpass.trim();
      newPassword = await bcrypt.hash(newpass, 10);
    }

    if (banner && banner[0].path) {
      try {
        if (
          user.banner !==
          "https://res.cloudinary.com/dwxzguawt/image/upload/v1732515390/jeremy-thomas-4dpAqfTbvKA-unsplash_xwdeqn.jpg"
        ) {
          const imgID = user.banner.split("/").slice(-1)[0].split(".")[0];
          const foldername = "X-clone/Banners";
          const picID = `${foldername}/${imgID}`;
          const result = await cloudinary.uploader.destroy(picID);
        }
        const uploadRes = await cloudinary.uploader.upload(banner[0].path, {
          folder: "X-clone/Banners",
        });

        try {
          await fs.unlink(banner[0].path);
        } catch (err) {
          console.log(err);
        }

        newBanner = uploadRes.secure_url;
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Make sure the Internet is ON!" });
      }
    }

    if (profilePic && profilePic[0].path) {
      try {
        if (
          user.profilePic !==
          "https://res.cloudinary.com/dwxzguawt/image/upload/v1727403075/defaultXprofile_siuopn.jpg"
        ) {
          const imgID = user.profilePic.split("/").slice(-1)[0].split(".")[0];
          const foldername = "X-clone/Profile_pics";
          const picID = `${foldername}/${imgID}`;
          const result = await cloudinary.uploader.destroy(picID);
        }
        const uploadRes = await cloudinary.uploader.upload(profilePic[0].path, {
          folder: "X-clone/Profile_pics",
        });
        try {
          await fs.unlink(profilePic[0].path);
        } catch (err) {
          console.log(err);
        }

        const pic = uploadRes.secure_url;
        newProfilePic = pic;
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Make sure the Internet is ON!" });
      }
    }

    user.username = newUserName || user.username;
    user.password = newPassword || user.password;
    user.bio = bio || user.bio;
    user.profilePic = newProfilePic || user.profilePic;
    user.location = location || user.location || "";
    user.banner = newBanner || user.banner;
    let data = await user.save();
    return res.status(200).json({ message: "Profile updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const findUser = async (req, res) => {
  try {
    const findUserName = req.params.name;
    const data = await User.find({
      username: { $regex: `^${findUserName}`, $options: "i" },
    }).select("-password");

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const { user: userID } = req;
    const user = await User.findById(userID);
    if (
      user.profilePic !==
      "https://res.cloudinary.com/dwxzguawt/image/upload/v1727403075/defaultXprofile_siuopn.jpg"
    ) {
      const imgID = user.profilePic.split("/").slice(-1)[0].split(".")[0];
      const foldername = "X-clone/Profile_pics";
      const picID = `${foldername}/${imgID}`;
      const result = await cloudinary.uploader.destroy(picID);
    }
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "X-clone/Profile_pics",
    });
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });
    const pic = uploadRes.secure_url;
    await User.findByIdAndUpdate(userID, { profilePic: pic });
    return res
      .json({ message: "Profile Picture updated successfully!" })
      .status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const updateBannerPic = async (req, res) => {
  try {
    const { user: userID } = req;
    const user = await User.findById(userID);
    if (
      user.banner !==
      "https://res.cloudinary.com/dwxzguawt/image/upload/v1732515390/jeremy-thomas-4dpAqfTbvKA-unsplash_xwdeqn.jpg"
    ) {
      const imgID = user.banner.split("/").slice(-1)[0].split(".")[0];
      const foldername = "X-clone/Banners";
      const picID = `${foldername}/${imgID}`;
      const result = await cloudinary.uploader.destroy(picID);
    }
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "X-clone/Banners",
    });
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });
    const pic = uploadRes.secure_url;
    await User.findByIdAndUpdate(userID, { banner: pic });
    return res.json({ message: "Banner updated successfully!" }).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const suggestUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const limit = parseInt(req.query.limit) || 3;

    const suggest = await User.aggregate([
      { $match: { _id: { $ne: user._id, $nin: user.following } } },
      { $sample: { size: limit } },
    ]);
    return res.status(200).json(suggest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

const getFollowersList = async (req, res) => {
  try {
    const { personID } = req.query;
    if (!personID || !mongoose.Types.ObjectId.isValid(personID))
      return res.status(404).json({ error: "No such account exists!" });
    const user = await User.findById(personID).select("followers").populate({
      path: "followers",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({ error: "No such account exists!" });
    }
    return res.status(200).json(user.followers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const getFollowersListByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username }).select("followers").populate({
      path: "followers",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({ error: "No such account exists!" });
    }

    return res.status(200).json(user.followers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const getFollowingListByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username }).select("following").populate({
      path: "following",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({ error: "No such account exists!" });
    }

    return res.status(200).json(user.following);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const getFOllowingList = async (req, res) => {
  try {
    const { personID } = req.query;
    if (!personID || !mongoose.Types.ObjectId.isValid(personID))
      return res.status(404).json({ error: "No such account exists!" });
    const user = await User.findById(personID).select("following").populate({
      path: "following",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({ error: "No such account exists!" });
    }
    return res.status(200).json(user.following);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const userNameAvailable = async (req, res) => {
  try {
    const userName = req.params.username;
    const data = await User.findOne({ username: userName });
    if (data) return res.json([data]).status(200);
    return res.json([]).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowersNumber = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username: username });

    if (!user)
      return res.status(404).json({ error: "No such account exists!" });

    if (user && user.followers.length === 0) return res.json([]).status(200);

    return res.json([...user.followers]).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const userExists = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("username");

    if (!user) return res.status(404).json({ error: "No such user exists!" });

    return res.json({ username: user.username }).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMediaOfUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset);
    const personID = req.params.personID;
    const postss = await Post.find({
      $and: [{ uploadedPhoto: { $ne: null } }, { uploadedBy: personID }],
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "uploadedBy",
        select: "-password",
      })
      .lean();

    if (!postss) return res.status(200).json([]);

    const posts = postss.map((post) => ({
      ...post,
      comments: post.comments.length,
    }));

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Internal server error!" }).status(500);
  }
};

const addToBookmarks = async (req, res) => {
  try {
    const userID = req.user;
    const { postID } = req.params;

    const post = await Post.findById(postID);

    if (!post) return res.status(404).json({ error: "No such post exists!" });

    const alredyBookmarked = await Bookmark.findOne({ userID, postID });

    if (alredyBookmarked) {
      await Bookmark.deleteOne({ userID, postID });
      await Post.findByIdAndUpdate(postID, {
        $pull: { bookmarkedBy: userID },
      });
      return res.status(200).json({ message: "Removed from bookmarks!" });
    }

    const newBookmark = new Bookmark({
      userID,
      postID,
    });

    await Post.findByIdAndUpdate(postID, {
      $push: { bookmarkedBy: userID },
    });

    await newBookmark.save();

    return res.status(200).json({ message: "Added to bookmarks!" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Internal server error!" }).status(500);
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userID = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const data = await Bookmark.find({ userID })
      .skip(offset)
      .limit(limit)
      .select("postID")
      .populate({
        path: "postID",
        populate: {
          path: "uploadedBy",
          select: "username profilePic",
        },
      })
      .lean();
    if (data.length === 0) return res.json([]).status(200);

    const posts = data.map((item) => {
      const { postID } = item;
      const commentCount = postID.comments ? postID.comments.length : 0;
      return {
        ...postID,
        comments: commentCount,
      };
    });
    return res.json(posts).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const blockUser = async (req, res) => {
  try {
    const pers = req.params.personID;
    const personToBlock = pers.toString();

    if (!personToBlock)
      return res.json({ error: "Person id required!" }).status(400);

    const person = await User.findById(personToBlock);

    if (!person) return res.json({ error: "No such user exists!" }).status(400);

    const us = await User.findById(req.user);

    if (us.blocked.includes(personToBlock)) {
      us.blocked.pull(personToBlock);
      await us.save();
      return res.json({ message: "Unblocked successfully!" }).status(200);
    }

    us.blocked.push(personToBlock);
    await us.save();

    return res.json({ message: "Blocked successfully!" }).status(200);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Internal server error!" }).status(500);
  }
};

const getBlockedPerson = async (req, res) => {
  try {
    const blocked = await User.findById(req.user).select("blocked").populate({
      path: "blocked",
      select: "username _id",
    });

    if (blocked.length === 0) return res.json([]).status(200);

    return res.json(blocked).status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

module.exports = {
  getProfile,
  followPerson,
  getUserNotifications,
  updateProfile,
  findUser,
  suggestUser,
  uploadProfilePic,
  updateBannerPic,
  getFollowersList,
  getFOllowingList,
  userNameAvailable,
  getFollowersNumber,
  getFollowersListByUsername,
  userExists,
  getFollowingListByUsername,
  getMediaOfUser,
  addToBookmarks,
  getBookmarks,
  blockUser,
  getBlockedPerson,
};
