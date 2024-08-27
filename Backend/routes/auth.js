const express = require("express");
const router = express.Router();

const { createAccount , loginAccount , logout , getMe} = require("../controllers/authControllers.js");
const protectRoute = require("../middelwares/protectRoute.js");

router.post("/create", createAccount);

router.post("/login", loginAccount);

router.post("/logout",logout);
 
router.get("/me",protectRoute,getMe)
module.exports = router;