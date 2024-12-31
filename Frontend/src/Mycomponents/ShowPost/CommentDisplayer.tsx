import { CommentType } from "@/lib/Types";

import { Dot, Heart } from "lucide-react";
import { FormateDate } from "@/lib/Date";
import CustomTooltip from "@/customComponents/ToolTip";
import { memo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DeleteComment from "@/customComponents/DeleteComment";

const CommentDisplayer = memo(
  ({
    comment,
    authUserId,
    postId,
    postUploaderId,
    username,
  }: {
    comment: CommentType;
    authUserId?: string | undefined;
    postId: string;
    postUploaderId?: string;
    username: string;
  }) => {
    const [totalLikes, setTotalLikes] = useState([...comment.likes]);

    const { mutate: LikeComment } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/post/${postId}/likecomment/${comment._id}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        if ("error" in data) toast.error(data.error);

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;

        if (data.message === "Liked successfully!")
          setTotalLikes([...totalLikes, authUserId]);
        else setTotalLikes((prev) => prev.filter((p) => p !== authUserId));

        toast.success(data.message);
      },
    });

    const isLiked = totalLikes.includes(authUserId);

    return (
      <div className="w-full border-b border-gray-400/20 break-all">
        <div className="p-2 flex gap-1 w-full ">
          <img
            src={comment.commenter.profilePic}
            className="size-10 rounded-full object-cover"
          />
          <div className="flex flex-col gap-0.5 w-full">
            <div className="flex  h-fit ">
              <span className="font-bold text-sm pr-1">
                {comment.commenter.username}
              </span>
              <span className="text-xs text-gray-400/90">
                @{comment.commenter.username}
              </span>
              <Dot className="size-4 text-gray-400/90" />
              <span className="text-xs text-gray-400/90 ">
                {FormateDate(comment.createdAt)}
              </span>
              {comment.commenter._id === authUserId ||
              comment.commenter._id === postUploaderId ? (
                <div className=" ml-auto">
                  <DeleteComment
                    commentID={comment._id}
                    postID={postId}
                    username={username}
                    isCreator={postUploaderId === authUserId}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="text-sm tracking-wide ">{comment?.text}</div>
            <div className=" mt-2 w-full flex justify-center items-center  text-gray-4se00/90">
              <CustomTooltip title={isLiked ? "Unlike" : "Like"}>
                <span
                  className="flex gap-2 items-end text-sm hover:text-pink-600 group"
                  onClick={() => LikeComment()}
                >
                  <Heart
                    className={`size-6 p-1  rounded-full   group-hover:bg-pink-600/20  ${
                      isLiked ? "fill-pink-600 text-transparent" : ""
                    }`}
                  />
                  {totalLikes.length}
                </span>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CommentDisplayer;
