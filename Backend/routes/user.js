const express = require("express");
const protectRoute = require("../middelwares/protectRoute")
const { getProfile ,followPerson,getUserNotifications,updateProfile } = require("../controllers/userControllers")

const router = express.Router();

router.get("/profile/:id",protectRoute,getProfile);
router.post("/follow/:id",protectRoute,followPerson);
router.get("/getnoti",protectRoute,getUserNotifications);
router.post("/updateprofile",protectRoute,updateProfile);


module.exports = router;