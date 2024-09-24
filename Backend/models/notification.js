const mongoose = require("mongoose");
const User = require("./userModel");
const notificationSchema = new mongoose.Schema({
    to : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User" ,
      required : true 
    },
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true 
      },
      topic :{
        type : String,
        enum : ["like","follow"],
        default : "like"
      },
      read :{
        type : Boolean,
        default : false,
      }
},{
    timestamps: true
});

const Notification = mongoose.model("Notification",notificationSchema);

module.exports = Notification;