const Post = require("../models/postmodel");
const User = require("../models/userModel");
const Notification = require("../models/notification");
const {unlink} = require("fs")
const {v2:cloudinary} = require("cloudinary");
const { error } = require("console");


const createPost = async (req, res) => {
  try {
    const { postContent } = req.body;
    const uploadedBy = req.user;
    if (!postContent) { 
      return res
        .status(400)
        .json({ error: "A post must have some content!" });
    }

    if (req.file) {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
          folder: 'X-clone/Posts'
        });
        unlink(req.file.path,(err,data)=>{
          if(err){
            console.log(err)
          }
        })
        const uploadedPhoto = uploadRes.secure_url;
        const post = new Post({
          postContent,
          uploadedPhoto,
          uploadedBy,
        }); 
        await post.save();
        return res.status(201).json({message : "Post created successfully!"});
    }
    const post = new Post({
      postContent,
      uploadedBy,
    });
    await post.save();
    return res.status(201).json({message : "Post created successfully!"});
  } catch (err) {
    console.log(err)
    return res.status(500).json({error : "Internal server error!"});
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const commenter = req.user;
    const { text } = req.body;

    const newComment = await Post.findByIdAndUpdate(
      postID,
      { $push: { comments: { text, commenter } } },
      { new: true }
    );
    if (!newComment) {
      return res.status(400).json({ error: "No such post exists" });
    }
    const populatedComment = await Post.findById(postID).populate({
      path: "comments.commenter",
      select: "-password",
    }); //not saving

    return res.status(201).json({message : "Commented!"});
  } catch (err) {
    return res.status(404).json({ error: "No such post exists!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit) || 5
    const posts = await Post.find({uploadedBy : {$ne : req.user}}).sort({ createdAt: -1 }).skip(offset).limit(limit).populate({
      path: "uploadedBy",
      select: "-password",
    });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const postOfFollowing = async (req, res) => {
  try {
    const userID = req.user;
    const user = await User.findById(userID);
    const following = user.following;
    const limit = parseInt(req.query.limit) ||10;
    const offset = parseInt(req.query.offset);
    if (following.length <= 0) {
      return res.status(200).json([]);
    }
    const posts = await Post.find({ uploadedBy: { $in: following } })
      .sort({ createdAt: -1 }).skip(offset).limit(limit)
      .populate({
        path: "uploadedBy",
        select: "-password",
      });
    if (!posts) {
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const likePost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const userID = req.user;
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "No such post exists" });
    }
    const liked = post.likes.includes(userID);
    if (!liked) {
      const something = await post.likes.push(userID);
      await post.save();

      if(userID != post.uploadedBy._id){
         const informingLike = new Notification({
                to: post.uploadedBy,
                from: userID,
                topic: "like",
                read: false,
              });
              await informingLike.save();
      }

      return res.status(200).json({ message: "Post liked successfully!" , toatlLikes : something  });
    } else {
     const something = await post.likes.pull(userID)
     await post.save();
      await Notification.findOneAndDelete(
        { to: post.uploadedBy },
        { from: userID }
      );
      return res.status(200).json({ message: "Post unliked successfully!" , toatlLikes : something.length });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "internal server error" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const person = await User.findById(req.params.personid);
    if (!person) {
      return res.status(404).json({ error: "Invalid user" });
    }
    const posts = await Post.find({ likes: { $in: person._id } }).populate({
      path: "likes",
      select: "-password",
    });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(404).json({ error: "Invalid user!" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postID = req.params.postid;
    const postToDelete = await Post.findById(postID);
    if (!postToDelete) {
      return res.status(404).json({ error: "No such post exists" });
    }
    if (postToDelete.uploadedBy != req.user) {
      return res.status(400).json({ error: "You can't delete others posts!" });
    }
    if(postToDelete.uploadedPhoto){
        const imgID= postToDelete.uploadedPhoto.split('/').slice(-1)[0].split('.')[0];
          const foldername = "X-clone/Posts"
          const picID = `${foldername}/${imgID}`
          const result =  await cloudinary.uploader.destroy(picID)
      }
    const deleted = await Post.deleteOne(
      { _id: postID },
      { uploadedBy: req.user }
    );
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(404).json({ error: "No such post exists!" });
  }
};

const getProfilePost = async(req,res) =>{
  try {
    const limit = parseInt(req.query.limit)||10;
    const offset = parseInt(req.query.offset);
    const personID = req.params.personID
    const posts = await Post.find({uploadedBy : personID}).sort({ createdAt: -1 }).skip(offset).limit(limit).populate({
      path : "uploadedBy",
      select : "-password"
    });
    if (!posts) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: "Internal servere error" });
  }
}


const getPost= async (req, res) => {
  try {
    const posts = await Post.find({_id : req.params.postID}).populate({
      path: "uploadedBy",
      select: "-password",
    }).populate({
      path : "comments.commenter",
      select : "-password"
    }).sort()
    if (!posts) return res.status(200).json([]);
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal servere error" });
  }
};

const likeComment = async(req,res)=>{
  try{
    const post = await Post.findById(req.params.postID);
    if(!post){
      return res.json({error : "No such post exists!"}).status(404);
    }
    const comment =  await post.comments.id(req.params.commentID);
    if(!comment) {
       return res.json({error : "No such commnet exists!"}).status(404);
    }
    if(!comment.likes.includes(req.user)){
       await comment.likes.push(req.user);
       await post.save()
      return res.json({message : "Liked successfully!"}).status(200);
    }else{
       await comment.likes.pull(req.user);
       await post.save();
      return res.json({message : "unLiked successfully!"}).status(200);
    }
  }catch(err){
    console.log(err)
  }
}

const deleteComment = async(req,res)=>{
  try{
    const {user : userID} = req;
    const {postID,commentID} = req.params

    const post = await Post.findById(postID);
    if(!post){
      return res.status(404).json({error : "No such post exists!"})
    }

    const commentExists = await post.comments.filter(p=>p._id==commentID);
    if(commentExists.length>0 && (commentExists[0].commenter._id == userID || post.uploadedBy._id == userID)){
      await post.comments.pull(commentID)
      await post.save();
    return res.status(200).json({message : "Comment deleted successfully!"})
    }else{
      return res.status(400).json({error : "Comment cannot be deleted"})
    }

  }catch(err){
    console.log(err)
      return res.status(500).json({error : "Internal server error!"})
  }

}


module.exports = {
  createPost,
  getPosts,
  commentOnPost,
  postOfFollowing,
  likePost,
  getLikedPosts,
  deletePost,
  getProfilePost,
  getPost,
  likeComment,
  deleteComment,
};
