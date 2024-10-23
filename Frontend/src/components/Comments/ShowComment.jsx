import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Postdisplayer from "../home/Postdisplayer";
import CommentDisplayer from "./CommentDisplayer";

import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";
import { useAuthUserContext } from "../../context/AuthUserContext";

function ShowComment() {
  const { authUser } = useAuthUserContext();
  const [commentText, setCommentText] = useState("");
  const location = useLocation();
  const { state: postID } = location;

  const queryclient = useQueryClient();

  const {
    data: post,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await fetch(`/api/post/getpost/${postID}`);
      const data = await res.json();
      const something = data[0];

      return something;
    },
    refetchOnWindowFocus: true,
  });
  post?.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  //comment
  const {
    mutate,
    isPending: pendingCommnent,
    isLoading: loadingComment,
  } = useMutation({
    mutationFn: async (text) => {
      try {
        const res = await fetch(`/api/post/comment/${postID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text }),
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return toast.error(data.error);
      }
      await queryclient.invalidateQueries("post");
      toast.success("Comment posted successfully!");
      setCommentText("");
    },
    refetchOnWindowFocus: true,
  });

  function postComment() {
    if (commentText.length > 500) {
      return toast.error("Comment lenght must be less than 500 characters!");
    }
    if (commentText.length < 5) {
      return toast.error("Comment lenght must be alteast 5 characters!");
    }
    mutate(commentText);
  }

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b m-2 p-2">{post?.uploadedBy.username}</div>
      {post && <Postdisplayer post={post} isOn="comments" />}
      <div className="my-2">
        <div className="px-2 text-xl tracking-wider border-b pb-4 ">
          Comments ({post?.comments.length})
        </div>
        <div className="border my-2 rounded-md p-2 bg-sky-900 ">
          <div className="flex">
            <div className="h-fit w-fit rounded-full m-2 border">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={authUser.profilePic}
              ></img>
            </div>
            <div className="w-full ml-2 ">
              <textarea
                className="bg-transparent w-full focus:outline-none p-2 overflow-hidden rounded resize-y"
                placeholder="Share you thoughts on this post..."
                rows={7}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </div>
          <div className=" my-2 p-2 flex justify-end  items-center">
            <div
              className={`border w-fit h-7 mx-4 rounded-md px-2  grid place-content-center text-xs ${
                commentText.length > 500 ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {commentText.length}
            </div>
            <button
              className="bg-blue-500 rounded-md p-2 w-1/5 active:bg-green-500 hover:bg-blue-200"
              onClick={postComment}
              disabled={
                isPending || isLoading || pendingCommnent || loadingComment
              }
            >
              {isPending || isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        {(isLoading || isPending) && <Skele />}
        {post?.comments.length > 0 &&
          post?.comments.map((comment) => (
            <CommentDisplayer
              key={comment._id}
              comment={comment}
              postID={post._id}
              userID={authUser._id}
              isPostOwner={authUser._id == post.uploadedBy._id}
            />
          ))}
      </div>
    </div>
  );
}

export default ShowComment;
