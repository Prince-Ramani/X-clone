import { Bookmark, Dot, Heart, MessageCircle, Share } from "lucide-react";
import { PostType } from "./ForYou";
import { memo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomTooltip from "@/customComponents/ToolTip";
import { useNavigate } from "react-router-dom";
import { FormateDate } from "@/lib/Date";

const PostDisplayer = memo(
  ({
    post,
    authUserId,
  }: {
    post: PostType;
    authUserId: string | null | undefined;
  }) => {
    const {
      comments,
      createdAt,
      likes,
      uploadedBy,
      uploadedPhoto,
      postContent,
    } = post;

    const navigate = useNavigate();
    const [totalLikes, setTotalLikes] = useState(likes);
    const [hasUserLiked, setHasUserLiked] = useState<boolean>(
      likes.includes(authUserId)
    );

    const { mutate } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/post/likepost/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if ("error" in data) toast.error(data.error);

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;

        if (data.message === "Post liked successfully!" && !hasUserLiked) {
          setHasUserLiked(true);
          setTotalLikes((prev) => [...prev, authUserId]);
        } else {
          setHasUserLiked(false);
          setTotalLikes((prev) => prev.filter((p) => p !== authUserId));
        }
        toast.success(data.message);
      },
    });

    const handlPostClick = (e: any) => {
      if (e.target.tagName !== "DIV") return;
      navigate(`/profile/${uploadedBy.username}/post/${post._id}`);
    };

    return (
      <div
        className="border-b border-gray-600/60  w-full  p-2 pb-1 pr-5 flex "
        onClick={(e: any) => handlPostClick(e)}
      >
        <img
          src={uploadedBy.profilePic}
          className="size-10   rounded-full object-cover border "
          loading="lazy"
          onClick={() => navigate(`/profile/${uploadedBy?.username}`)}
        />

        <div className=" w-full h-fit ml-2 flex-flex-col ">
          <div className="flex gap-2 items-center ">
            <span
              className="font-bold hover:underline decoration-white decoration-1"
              onClick={() => navigate(`/profile/${uploadedBy?.username}`)}
            >
              {uploadedBy.username}
            </span>
            <div className="flex items-center   text-gray-400/90">
              <span className="text-sm">@{uploadedBy.username}</span>
              <span>
                <Dot className="size-3" />
              </span>
              <span className="text-sm">{FormateDate(createdAt)}</span>
            </div>
          </div>

          <div className="leading-normal text-sm tracking-wide break-all break-words ">
            {" "}
            {postContent}
          </div>

          {uploadedPhoto ? (
            <div className=" w-full  h-fit mt-2 flex justify-center items-center  ">
              <a href={uploadedPhoto} target="_blank" className="w-full h-fit">
                <img
                  src={uploadedPhoto}
                  className=" w-full h-fit rounded-2xl border-gray-400/20 border"
                />
              </a>
            </div>
          ) : (
            ""
          )}

          <div className=" p-1 mt-1 flex items-center justify-between gap-4  text-gray-500/90">
            <CustomTooltip title="Reply">
              <span className="flex gap-1 items-end text-sm hover:text-blue-500 ">
                <MessageCircle className="size-6 p-1  rounded-full  hover:bg-blue-400/20" />
                {comments || 0}
              </span>
            </CustomTooltip>
            <CustomTooltip title={hasUserLiked ? "Unlike" : "Like"}>
              <span
                className="flex gap-2 items-end text-sm hover:text-pink-600 group "
                onClick={() => mutate()}
              >
                <Heart
                  className={`size-6 p-1  rounded-full   group-hover:bg-pink-600/20  ${
                    hasUserLiked ? "fill-pink-600 text-transparent" : ""
                  }`}
                />
                {totalLikes.length}
              </span>
            </CustomTooltip>

            <div className="flex items-center gap-1">
              <CustomTooltip title="Save">
                <span className="flex gap-2 items-end text-sm group">
                  <Bookmark className="size-6 p-1 rounded-full hover:bg-blue-400/20 group-active:bg-green-500 group-active:text-white" />
                </span>
              </CustomTooltip>

              <CustomTooltip title="Copy url">
                <span
                  className="flex gap-2 items-end text-sm group"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(
                        `${import.meta.env.VITE_BASE_URL}/profile/${
                          uploadedBy.username
                        }/post/${post?._id}`
                      )
                      .then(() => toast.success("URL copied!"))
                  }
                >
                  <Share className="size-6 p-1 rounded-full hover:bg-blue-400/20 group-active:bg-green-500 group-active:text-white" />
                </span>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PostDisplayer;
