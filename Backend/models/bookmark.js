const mongoose = require("mongoose");
const bookmarkSchema = new mongoose.Schema({
   userID : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   },
   postID : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post"
   }
},{
    timestamps: true
});

const Bookmark = mongoose.model("Bookmark",bookmarkSchema);

module.exports = Bookmark;