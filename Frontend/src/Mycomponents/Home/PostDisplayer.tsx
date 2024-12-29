import { BookmarkPlus, Dot, Heart, MessageCircle, Share } from "lucide-react";
import { PostType } from "./ForYou";
import { memo, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomTooltip from "@/customComponents/ToolTip";
import { useNavigate } from "react-router-dom";
import { FormateDate } from "@/lib/Date";
import { useReplyDialogContext } from "@/context/ReplyPostContext";
import DeletPost from "@/customComponents/DeletePostsIcon";

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

    console.log(post.uploadedVideo);

    const { setIsReplyDialog, setPostContent } = useReplyDialogContext();
    const [hasBookmarked, setHasBookmarked] = useState<boolean | undefined>(
      post.bookmarkedBy?.includes(authUserId)
    );

    const navigate = useNavigate();
    const [totalLikes, setTotalLikes] = useState(likes);
    const [hasUserLiked, setHasUserLiked] = useState<boolean>(
      likes.includes(authUserId)
    );
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | undefined>(
      undefined
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

    const { mutate: addToBookmark } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/add/bookmark/${post._id}`, {
          method: "POST",
        });

        const data = await res.json();
        if ("error" in data) toast.error(data.error);

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;

        if (data.message === "Removed from bookmarks!") setHasBookmarked(false);
        else setHasBookmarked(true);
        toast.success(data.message);
      },
    });

    const { mutate: answerPoll } = useMutation({
      mutationFn: async (answerNumber: number) => {
        const res = await fetch(`/api/post/answerpoll/${post._id}`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answerNumber }),
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        setSelectedOption(answerNumber);
        setHasAnswered(true);
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;
        toast.success(data.message);
      },
    });

    const { data: pollResultCount } = useQuery({
      queryKey: [post._id, "PollResult"],
      queryFn: async () => {
        const res = await fetch(`/api/post/getpollresult/${post._id}`);
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);

        return data;
      },
      enabled: hasAnswered && post.type === "poll",
    });

    const handlPostClick = (e: any) => {
      if (e.target.tagName !== "DIV") return;
      navigate(`/profile/${uploadedBy?.username}/post/${post._id}`);
    };

    const submitPollAnswer = (answerNumber: number) => {
      if (hasAnswered) return toast.error("Aleardy answered!");

      answerPoll(answerNumber);
    };

    useEffect(() => {
      if (post?.answeredBy && authUserId) {
        const userHasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered === authUserId
        );

        if (userHasAnswered.length > 0) {
          setHasAnswered(true);
          setSelectedOption(userHasAnswered[0].optionSelected);
        }
      }
    }, [post, authUserId]);

    return (
      <div
        className="border-b border-gray-600/60  w-full  p-2 pb-1 pr-5 flex "
        onClick={(e: any) => handlPostClick(e)}
      >
        <img
          src={uploadedBy?.profilePic}
          className="size-10   rounded-full object-cover border "
          loading="lazy"
          onClick={() => navigate(`/profile/${uploadedBy?.username}`)}
        />

        <div className=" w-full h-fit ml-2 flex flex-col ">
          <div className="flex gap-2  items-center  w-full ">
            <span
              className="font-bold hover:underline decoration-white decoration-1"
              onClick={() => navigate(`/profile/${uploadedBy?.username}`)}
            >
              {uploadedBy?.username}
            </span>
            <div className="flex items-center   text-gray-400/90 ">
              <span className="text-sm">@{uploadedBy?.username}</span>
              <span>
                <Dot className="size-3" />
              </span>
              <span className="text-sm">{FormateDate(createdAt)}</span>
            </div>
            {authUserId === uploadedBy?._id ? (
              <div className="ml-auto">
                <DeletPost postID={post._id} username={uploadedBy?.username} />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="leading-normal text-sm tracking-wide break-all break-words  ">
            {" "}
            {postContent}
          </div>

          {uploadedPhoto.length > 0 ? (
            <div
              className={`  grid ${
                uploadedPhoto.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }  gap-1 mt-2     `}
            >
              {uploadedPhoto.map((photo, index) => (
                <div
                  className={` w-full   ${
                    uploadedPhoto.length === 1
                      ? "h-fit"
                      : index === 2 && uploadedPhoto.length === 3
                      ? "col-span-2 max-h-48 sm:max-h-56 md:max-h-52  lg:max-h-64 "
                      : "h-40 sm:h-44  lg:h-48"
                  } overflow-hidden  flex justify-center `}
                >
                  <a href={photo} target="_blank" className="w-full  ">
                    <img
                      src={photo}
                      className=" w-full h-full object-cover rounded-2xl border-gray-400/20 "
                      alt="Post image"
                    />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}

          {post.uploadedVideo ? (
            <div className="mt-2 w-full">
              <video
                controls
                className="border w-full border-white/10 rounded-md"
              >
                <source src={post.uploadedVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            ""
          )}

          {post.type === "poll" ? (
            <div className="w-full rounded-xl mt-2 ">
              <div
                className={`text-xs text-gray-400/70 pl-3 ${
                  pollResultCount ? "block" : "hidden"
                } `}
              >
                Total votes : {pollResultCount?.totalVotes || 0}
              </div>
              <div className="p-2 flex rounded-xl ">
                <div className="flex flex-col gap-2 w-full">
                  {post.options?.map((option, index) => (
                    <span
                      className={`relative rounded-lg    flex bg-slate-100/10 ${
                        hasAnswered ? "" : "hover:bg-white/20"
                      }  `}
                      onClick={() => submitPollAnswer(index)}
                    >
                      <span
                        className={`h-10 rounded-lg    ${
                          selectedOption === index
                            ? "bg-blue-500 "
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${pollResultCount?.arr[index] || 0}%`,
                        }}
                      ></span>

                      <span
                        className={`absolute left-2  top-2     bg-transparent  text-white ${
                          hasAnswered &&
                          selectedOption &&
                          selectedOption === index
                            ? "font-semibold break-all"
                            : ""
                        }`}
                      >
                        {pollResultCount?.arr ? (
                          <span className="font-bold pr-3 ">
                            {Math.round(pollResultCount?.arr[index])}%
                          </span>
                        ) : (
                          ""
                        )}
                        {option}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className=" p-1 mt-1 flex items-center justify-between gap-4  text-gray-500/90">
            <CustomTooltip title="Reply">
              <span
                className="flex gap-1 items-end text-sm hover:text-blue-500 "
                onClick={() => {
                  setIsReplyDialog(true);
                  setPostContent(post);
                }}
              >
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
                <span
                  className="flex gap-2 items-end text-sm group"
                  onClick={() => addToBookmark()}
                >
                  <BookmarkPlus
                    className={`size-6 p-1 rounded-full hover:bg-blue-400/20 group-active:bg-green-500 group-active:text-white ${
                      hasBookmarked ? "fill-white text-white " : ""
                    }`}
                  />
                </span>
              </CustomTooltip>

              <CustomTooltip title="Copy url">
                <span
                  className="flex gap-2 items-end text-sm group"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(
                        //@ts-ignore
                        `${import.meta.env.VITE_BASE_URL}/profile/${
                          uploadedBy?.username
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
