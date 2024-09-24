const {v2:cloudinary} = require("cloudinary")
const multer = require("multer")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


console.log(process.env.CLOUDINARY_NAME)

  

  const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
      cb(null,"../uploads")
    },
    filename : (req,file,cb)=>{
      cb(null,Date.now() + path.extname(file.originalname));
    }
    
  })
  const upload = multer({storage : storage})


  module.exports = {upload,cloudinary}
