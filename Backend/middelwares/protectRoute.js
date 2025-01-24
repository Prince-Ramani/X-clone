const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = await req.cookies["user"];

    if (!token) {
      return res
        .status(400)
        .json({ error: "cookies doesn't exists! Try logging in again" });
    }
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY);
    if (!userId) {
      return res.status(400).json({
        error: "You are trying to modify cookies! Try logging in again",
      });
    }
    req.user = userId;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Please verify yourself by logging in" });
  }
};

module.exports = protectRoute;
