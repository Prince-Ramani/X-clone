const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profilePic: {
        type: String,
        required: false,
        default: ""
    },
    banner: {
        type: String,
        required: false,
        default: ""
    },
    bio: {
        type: String,
        required: false,
        default: ""
    },
    links: {
        type: String,
        required: false,
        default: ""
    },
},{
    timestamps :true
});

const User = mongoose.model("User", userSchema);

module.exports = User;