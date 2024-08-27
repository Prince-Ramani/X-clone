const User = require("./userModel")
const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    title : {
        type : String,
    },
    body :{
        type :String
    },
    postImg : {
        type : String,
    },
    likes: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            default : []
        }
    ],
    comments : [{
        text : {
            type : String,
            required : true
        },
        commenter :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        }
    }],
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
});

const Post = mongoose.model("Post",postSchema);
module.exports = Post;