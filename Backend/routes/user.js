const express = require("express");
const protectRoute = require("../middelwares/protectRoute");
const {
  getProfile,
  followPerson,
  getUserNotifications,
  updateProfile,
  findUser,
  suggestUser,
  userExists,
  uploadProfilePic,
  updateBannerPic,
  getFollowersList,
  getFOllowingList,
  userNameAvailable,
  getFollowersNumber,
  getFollowersListByUsername,
  getFollowingListByUsername,
  getMediaOfUser,
  addToBookmarks,
  getBookmarks,
  blockUser,
  getBlockedPerson,
  setPrivate,
  AcceptRequest,
  deleteAccount,
} = require("../controllers/userControllers");
const { upload } = require("../Cloudinary/cloudinary");
const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.post("/follow/:id", protectRoute, followPerson);
router.get("/getnoti", protectRoute, getUserNotifications);
router.post(
  "/updateprofile",
  protectRoute,
  upload.fields([{ name: "banner" }, { name: "profilePic" }]),
  updateProfile
);
router.post("/finduser/:name", protectRoute, findUser);
router.get("/suggestion", protectRoute, suggestUser);
router.post(
  "/updatepicture",
  protectRoute,
  upload.single("profilePic"),
  uploadProfilePic
);
router.post(
  "/updatebanner",
  protectRoute,
  upload.single("banner"),
  updateBannerPic
);
router.get("/getfollowers", protectRoute, getFollowersList);
router.get("/getfollowersbyusername", protectRoute, getFollowersListByUsername);
router.get("/getfollowingbyusername", protectRoute, getFollowingListByUsername);
router.get("/getfollowersnumbers", protectRoute, getFollowersNumber);
router.get("/getfollowings", protectRoute, getFOllowingList);
router.post("/usernameavailable/:username", protectRoute, userNameAvailable);
router.get("/userexists/:username", protectRoute, userExists);
router.get("/profile/media/:personID", protectRoute, getMediaOfUser);

router.post("/add/bookmark/:postID", protectRoute, addToBookmarks);
router.get("/getbookmarks", protectRoute, getBookmarks);
router.get("/totalblocks", protectRoute, getBlockedPerson);
router.post("/blockuser/:personID", protectRoute, blockUser);
router.patch("/setprivate", protectRoute, setPrivate);
router.post("/acceptrequest", protectRoute, AcceptRequest);
router.post("/deleteaccount", protectRoute, deleteAccount);

module.exports = router;
