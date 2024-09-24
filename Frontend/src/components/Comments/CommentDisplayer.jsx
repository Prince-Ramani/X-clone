import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function CommentDisplayer({ comment, postID, userID, isPostOwner }) {
  const { commenter, createdAt } = comment;
  const [isCommentLiked, setCommentLike] = useState([...comment.likes]);
  const queryclient = useQueryClient();
  const year = createdAt?.slice(0, 4);
  const mm = createdAt?.slice(5, 7);
  const dd = createdAt.slice(8, 10);
  //Like comment
  const isCreatedByUser = commenter._id === userID;

  const { mutate: like, data: postLiked } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `/api/post/${postID}/likecomment/${comment._id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      } else if (data.message === "unLiked successfully!") {
        toast.success(data.message);
        setCommentLike((prev) => prev.filter((c) => c != userID));
      } else {
        toast.success(data.message);
        setCommentLike((prev) => [...prev, userID]);
      }
      await queryclient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const { mutate: deletecomment } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `/api/post/${postID}/deletecomment/${comment._id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        toast.error(data.message);
        return;
      }
      await queryclient.invalidateQueries({ queryKey: ["post"] });
      toast.success(data.message);
    },
  });

  return (
    <div className=" m-2 mt-2 p-2 border-b select-none">
      <div className=" flex items-center p-1">
        <div className="h-fit w-fit rounded-full select-none">
          <img
            src={commenter.profilePic}
            className="w-10 h-10 rounded-full border object-cover"
          ></img>
        </div>
        <div className="mx-2 px-1 text-gray-200">{commenter.username}</div>
        <div className="mx-2 px-1 text-gray-200">
          {dd} {mm} {year}
        </div>
        {(isCreatedByUser || isPostOwner) && (
          <div
            className=" ml-auto text-red-500 p-1 active:text-green-500  "
            onClick={deletecomment}
          >
            <MdDelete className="h-full w-full  " />
          </div>
        )}
      </div>

      <div className=" p-1 m-1 font-light select-none ">{comment.text}</div>
      <div className=" flex justify-center items-center">
        <div
          className=" w-3/12 flex justify-center items-center opacity-80 py-2 "
          onClick={like}
        >
          <FaHeart
            className={` shrink-0  ${
              isCommentLiked.includes(userID) ? "text-pink-600" : "text-white"
            } `}
          />
          <p className="text-xs mx-1 select-none">{isCommentLiked.length}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentDisplayer;
