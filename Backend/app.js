const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const { error } = require("console");
const { v2: cloudinary } = require("cloudinary");

const mongodbConnect = require("./connection.js");
const auth = require("./routes/auth.js");
const protectRoute = require("./middelwares/protectRoute.js");
const userFile = require("./routes/user.js");
const postRoute = require("./routes/post.js");

const app = express();
const port = process.env.PORT || 8000;

cloudinary.config({
  cloud_name: process.env.CLODINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", auth);
app.use("/user", userFile);
app.use("/api/post", postRoute);

app.get("*", (req, res) => {
  res.status(400).json({ error: "Page doesn't exists" });
});

app.listen(port, () => {
  mongodbConnect();
  console.log("App listening on PORT : ", port);
});
