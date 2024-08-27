const Notification = require("../models/notification");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v2: cloudinary } = require("cloudinary");

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const getProfile = async (req, res) => {
  try {
    const { id: profileID } = req.params;
    const profile = await User.findById(profileID).select("-password");
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

      return res.status(400).json({ message: "followed successfully" });
    } else {
      //Unfollow
      await User.findByIdAndUpdate(me.id, {
        $pull: { following: userToFollow.id },
      });
      await User.findByIdAndUpdate(userToFollow.id, {
        $pull: { followers: me.id },
      });
      await Notification.findOneAndDelete(
        { to: userToFollow.id },
        { from: me.id }
      );
      return res.status(400).json({ message: "unfollowed successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const myself = await User.findById(req.user);
    const noti = await Notification.find({ to: myself.id, read: false });

    if (!noti) {
      return res.status(200).json("You don,t have any new notification");
    }
    await Notification.updateMany(
      { to: myself.id, read: false },
      { read: true }
    );
    return res.status(200).json(noti);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, newpass, password, bio, links } = req.body;
    let { profilePic, banner } = req.body;
    var newPassword, newUserName;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password is required to update profile!" });
    }
    const valid = validateEmail(email);
    if (!valid) {
      return res.json({
        error:
          "Invalid email formate! A email must be in formate of ->xyz@something.com",
      });
    }
    const user = await User.findById(req.user);
    if (user.email !== email) {
      return res.status(400).json({ error: "Invalid email!" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({ error: "Incorrect password" });
    }
    if (username) {
      const userNameAvailable = await User.find({ username });
      if (userNameAvailable.length === 0) {
        newUserName = username;
      } else {
        return res.status(400).json({ erro: "Username already taken!" });
      }
    }
    if (newpass) {
      newPassword = await bcrypt.hash(newpass, 10);
    }
    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadRes = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadRes.secure_url;
    }
    if (banner && user.banner) {
      await cloudinary.uploader.destroy(
        user.banner.split("/").pop().split(".")[0]
      );
      const uploadRes = await cloudinary.uploader.upload(banner);
      banner = uploadRes.secure_url;
    }
    user.username = newUserName || user.username;
    user.email = email;
    user.password = newPassword || user.password;
    user.profilePic = profilePic || user.profilePic;
    user.banner = banner || user.banner;
    user.bio = bio || user.bio;
    user.links = bio || user.links;
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

module.exports = {
  getProfile,
  followPerson,
  getUserNotifications,
  updateProfile,
};
