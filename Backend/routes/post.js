const express = require("express");
const router = express.Router();
const protectRoute = require("../middelwares/protectRoute");
const { upload } = require("../Cloudinary/cloudinary");
const {
  createPost,
  getPosts,
  getProfilePost,
  commentOnPost,
  getPost,
  postOfFollowing,
  likePost,
  getLikedPosts,
  deletePost,
  likeComment,
  deleteComment,
  createPoll,
  submitPollAnswer,
  getPollResult,
  getPostsCount,
} = require("../controllers/postControllers");

router.post(
  "/createpost",
  protectRoute,
  upload.single("uploadedPhoto"),
  createPost
);
router.post(
  "/createpoll",
  protectRoute,
  upload.single("explanationImage"),
  createPoll
);
router.post("/answerpoll/:postID", protectRoute, submitPollAnswer);
router.get("/getallpost", protectRoute, getPosts);
router.get("/getpostscount", protectRoute, getPostsCount);
router.get("/getpollresult/:postID", protectRoute, getPollResult);
router.post("/comment/:postid", protectRoute, commentOnPost);
router.get("/followingposts", protectRoute, postOfFollowing);
router.post("/likepost/:postid", protectRoute, likePost);
router.get("/likedposts/:personid", protectRoute, getLikedPosts);
router.post("/deletepost/:postid", protectRoute, deletePost);
router.get("/profile/:personID", protectRoute, getProfilePost);
router.get("/getPost/:postID", protectRoute, getPost);
router.post("/:postID/likecomment/:commentID", protectRoute, likeComment);
router.post("/:postID/deletecomment/:commentID", protectRoute, deleteComment);

module.exports = router;
