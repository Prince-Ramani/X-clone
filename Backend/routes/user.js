const express = require("express");
const protectRoute = require("../middelwares/protectRoute")
const { getProfile ,followPerson,getUserNotifications,updateProfile,findUser, suggestUser, uploadProfilePic, updateBannerPic, getFollowersList, getFOllowingList, userNameAvailable } = require("../controllers/userControllers")
const {upload} = require("../Cloudinary/cloudinary")
const router = express.Router();

router.get("/profile/:id",protectRoute,getProfile);
router.post("/follow/:id",protectRoute,followPerson);
router.get("/getnoti",protectRoute,getUserNotifications);
router.post("/updateprofile",protectRoute,updateProfile);
router.post("/finduser/:name",protectRoute,findUser)
router.post("/suggestion",protectRoute,suggestUser)
router.post("/updatepicture",protectRoute,upload.single('profilePic'),uploadProfilePic)
router.post("/updatebanner",protectRoute,upload.single('banner'),updateBannerPic)
router.get("/getfollowers",protectRoute,getFollowersList)
router.get("/getfollowings",protectRoute,getFOllowingList)
router.post("/usernameavailable/:username",protectRoute,userNameAvailable)


module.exports = router;