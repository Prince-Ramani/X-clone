const express = require("express");
const router = express.Router();
const protectRoute = require("../middelwares/protectRoute");

const { createPost, getPosts, commentOnPost, postOfFollowing, likePost, getLikedPosts,deletePost} = require("../controllers/postControllers");

router.post("/createpost",protectRoute,createPost);
router.get("/getallpost",protectRoute,getPosts);
router.post("/comment/:postid",protectRoute,commentOnPost);
router.get("/followingposts",protectRoute,postOfFollowing);
router.post("/likepost/:postid",protectRoute,likePost);
router.post("/likedposts/:personid",protectRoute,getLikedPosts);
router.post("/deletepost/:postid",protectRoute,deletePost)

module.exports = router;