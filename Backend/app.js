const {v2:cloudinary} = require("cloudinary")
const multer = require("multer")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const { error } = require("console");


const cors = require("cors");


const mongodbConnect = require("./connection.js");
const auth = require("./routes/auth.js");
const userFile = require("./routes/user.js");
const postRoute = require("./routes/post.js");


const corsOptions = {
  origin : "*",
  methods : ["GET","POST","PATCH","DELETE","PUT","OPTIONS"],
  allowedHeaders : ["Content-Type"]
}

const app = express();
const port = process.env.PORT || 8000;

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({limit : '10mb'}));

app.use("/api/auth", auth);
app.use("/user", userFile);
app.use("/api/post", postRoute);

app.options("*",cors())

app.get("*", (req, res) => {
  res.status(400).json({ error: "Page doesn't exists" });
});

app.listen(port, () => {
  mongodbConnect();
  console.log("App listening on PORT : ", port);
});
