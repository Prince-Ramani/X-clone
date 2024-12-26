const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const createToken = require("../services/token");
const hashpass = async (pass) => {
  return await bcrypt.hash(pass, 10);
};
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const createAccount = async (req, res) => {
  try {
    var { username, email, password } = req.body;
    const usernameExists = await User.findOne({ username });
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (usernameExists) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const valid = validateEmail(email);
    if (!valid) {
      return res.json({
        error: "Invalid email formate!",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        error: "Account with this email already exists try logging in !",
      });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password lenght must be of 6 letters" });
    }

    const hashedPassword = await hashpass(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = await createToken(newUser._id);
    await res.cookie("user", token);

    return res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profilePic: newUser.profilePic,
      banner: newUser.banner,
      bio: newUser.bio,
      links: newUser.links,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "All fields required" });
  }
};

const loginAccount = async (req, res) => {
  try {
    var { email, password } = req.body;
    email.trim();
    password.trim();
    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.json({
        error: "Invalid email formate!",
      });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res
        .status(404)
        .json({ error: "Account with this email doesn't exists" });
    }

    const verified = await bcrypt.compare(password, userExists.password);
    if (!verified) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = await createToken(userExists._id);
    await res.cookie("user", token);
    return res.status(201).json({
      username: userExists.username,
      email: userExists.email,
      followers: userExists.followers,
      following: userExists.following,
      profilePic: userExists.profilePic,
      banner: userExists.banner,
      bio: userExists.bio,
      links: userExists.links,
    });
  } catch (err) {
    return res.status(400).json({ error: "All fields required" });
  }
};

const logout = async (req, res) => {
  try {
    await res.clearCookie("user");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const myself = await User.findById(req.user);
    if (!myself) {
      return res.status(400).json({ message: "You are not loggedin" });
    }
    return res.status(200).json({
      _id: myself._id,
      username: myself.username,
      email: myself.email,
      followers: myself.followers,
      following: myself.following,
      profilePic: myself.profilePic,
      banner: myself.banner,
      bio: myself.bio,
      links: myself.links,
      accountType: myself.accountType,
      blocked: myself.blocked,
      blockedBy: myself.blockedBy,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error try :( logging in again!" });
  }
};
module.exports = { createAccount, loginAccount, logout, getMe };
