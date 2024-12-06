import { useAuthUser } from "@/context/userContext";
import CustomTooltip from "@/customComponents/ToolTip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import CommentDisplayer from "./CommentDisplayer";
import {
  ArrowLeft,
  BookmarkPlus,
  Dot,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
  Smile,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { CommentType } from "@/lib/Types";
import EmojiPicker from "@/customComponents/EmojiPicker";

const ShowPost = () => {
  const { username, postId } = useParams();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [textareaValue, setTextareaValue] = useState("");
  const querClient = useQueryClient();
  const [hasBookmarked, setHasBookmarked] = useState<boolean | undefined>();
  const [_, setSelectedEmoji] = useState();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);

  const { data: userExists } = useQuery({
    queryKey: [username, "sync"],
    queryFn: async () => {
      const res = await fetch(`/api/userexists/${username}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);

      return data;
    },
    enabled: !!username,
  });

  const { data: post } = useQuery({
    queryKey: [postId, username],
    queryFn: async () => {
      const res = await fetch(`/api/post/getpost/${postId}`);
      const data = await res.json();

      setTotalLikes(data.likes);
      setHasUserLiked(data.likes.includes(authUser?._id));
      setHasBookmarked(data.bookmarkedBy.includes(authUser?._id));

      if ("error" in data) toast.error("Invalid post id!");
      return data;
    },
    enabled: !!userExists && !!username && !!postId,
  });

  const [totalLikes, setTotalLikes] = useState<string[]>();
  const [hasUserLiked, setHasUserLiked] = useState<boolean>();

  const { mutate: likePost } = useMutation({
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
        setTotalLikes((prev: any) => [...prev, authUser?._id]);
      } else {
        setHasUserLiked(false);
        setTotalLikes((prev: any) =>
          prev.filter((p: any) => p !== authUser?._id)
        );
      }
      toast.success(data.message);
    },
  });
  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/post/comment/${post?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if (data.error) return;
      querClient.invalidateQueries({ queryKey: [postId, username] });
      setTextareaValue("");
      setIsEmojiOpen(false);
      toast.success("Replied sucessfully!");
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

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    setTextareaValue((prevText) => prevText + emoji.native);
  };

  const handleComment = () => {
    if (textareaValue) {
      if (textareaValue?.length >= 280)
        return toast.error("reply length must be less than 280 characters!");

      postComment(textareaValue);
    } else {
      toast.error("Reply should have some content!");
    }
  };

  return (
    <div className="border border-gray-800 min-h-full  cursor-pointer pt-[6px]">
      <div className=" pb-1  px-4   flex   items-center backdrop-blur-lg bg-black/70  sticky top-0 gap-5 z-50 ">
        <CustomTooltip title="Back">
          <div
            className="h-fit w-fit p-2 hover:bg-gray-500/20 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-5 " />
          </div>
        </CustomTooltip>

        <span className="font-bold text-lg tracking-wider">Post</span>
      </div>

      <div className=" mt-3 p-2 border-b border-gray-600/70">
        <div className="flex gap-2">
          <img
            src={post?.uploadedBy.profilePic}
            className="size-10 rounded-full object-cover "
          />

          <div className="flex flex-col text-sm ">
            <span className="font-bold">{post?.uploadedBy.username}</span>
            <span className="tracking-wide text-gray-400/70">
              @{post?.uploadedBy.username}
            </span>
          </div>
          <div className="ml-auto  h-fit w-fit rounded-full p-1 hover:bg-gray-500/20">
            <CustomTooltip title="More">
              <MoreHorizontal className="size-5" />
            </CustomTooltip>
          </div>
        </div>

        <div className="break-all break-words mt-2 tracking-wide">
          {post?.postContent}
        </div>

        {post?.uploadedPhoto ? (
          <div className="w-full h-fit mt-3 border border-gray-500/20 rounded-2xl">
            <a target="_blank" href={post.uploadedPhoto}>
              <img src={post.uploadedPhoto} className="rounded-2xl" />
            </a>
          </div>
        ) : (
          ""
        )}

        <div className="flex text-sm py-2 leading-tight tracking-tighter text-gray-400/80">
          <span>
            {post?.createdAt ? format(post?.createdAt, "h:mm a") : "hello"}
          </span>
          <Dot />
          <span>
            {post?.createdAt ? format(post?.createdAt, "MMM dd, yyyy ") : "j"}
          </span>
        </div>

        <div className="border-t border-b border-gray-600/70 flex justify-between items-center p-1 text-gray-500 text-sm  ">
          <div className="flex justify-center items-center">
            <CustomTooltip title="Reply">
              <div className="flex gap-2 items-end text-sm group h-fit w-fit p-1 active:bg-green-500 hover:bg-blue-400/20 rounded-full">
                <MessageCircle className="size-6 p-[2px] group  group-active:text-white" />
              </div>
            </CustomTooltip>
            <span className="text-gray-400/80">
              {post?.comments.length || 0}
            </span>
          </div>
          <CustomTooltip title={1 ? "Unlike" : "Like"}>
            <span
              className="flex gap-1 items-center text-sm hover:text-pink-600 group "
              onClick={() => likePost()}
            >
              <Heart
                className={`size-7 p-1  rounded-full   group-hover:bg-pink-600/20  ${
                  hasUserLiked ? "fill-pink-600 text-transparent" : ""
                }`}
              />
              <span className="text-gray-400/80 ">
                {totalLikes?.length || 0}
              </span>
            </span>
          </CustomTooltip>

          <div className="flex justify-center items-center">
            <CustomTooltip title={hasBookmarked ? "Unsave" : "Save"}>
              <div
                className="flex gap-2 items-end text-sm group h-fit w-fit p-1  hover:bg-blue-400/20 active:bg-green-500 rounded-full"
                onClick={() => addToBookmark()}
              >
                <BookmarkPlus
                  className={`size-5 group group-active:text-white transition-colors ${
                    hasBookmarked ? "fill-white text-white" : ""
                  }   `}
                />
              </div>
            </CustomTooltip>
          </div>

          <CustomTooltip title="Copy url">
            <div
              className="flex gap-2 items-end text-sm group h-fit w-fit p-1 hover:bg-blue-400/20  active:bg-green-500 rounded-full"
              onClick={() =>
                navigator.clipboard
                  .writeText(
                    //@ts-ignore
                    `${import.meta.env.VITE_BASE_URL}/profile/${
                      post.uploadedBy.username
                    }/post/${post?._id}`
                  )
                  .then(() => toast.success("URL copied!"))
              }
            >
              <Share className="size-5  group group-active:text-white" />
            </div>
          </CustomTooltip>
        </div>

        <div className="pt-4 p-4 px-2 pb-1 ">
          <div className=" flex gap-2   min-h-fit">
            <img
              src={authUser?.profilePic}
              alt="Your profilePic"
              className="h-10 w-10 object-cover shrink-0 rounded-full"
            />
            <div className="w-full flex flex-col">
              <div className="w-full  min-h-fit ">
                <TextareaAutosize
                  placeholder="Post your reply"
                  className="bg-transparent pl-1 text-lg/6  h-auto block focus:outline-none w-full resize-none  "
                  minRows={2}
                  maxRows={25}
                  value={textareaValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setTextareaValue(e.target.value)
                  }
                />
              </div>

              <div className="flex w-full  items-center">
                <span
                  className="rounded-full h-fit p-2 hover:bg-gray-800/70 relative cursor-pointer"
                  onClick={() => setIsEmojiOpen((prev) => !prev)}
                >
                  <Smile className="size-5 text-blue-400" />
                  {isEmojiOpen ? (
                    <EmojiPicker
                      onSelect={handleEmojiSelect}
                      isOpen={isEmojiOpen}
                    />
                  ) : (
                    ""
                  )}
                </span>
                <div className="ml-auto flex items-center gap-4  ">
                  {textareaValue ? (
                    <div
                      className={` lg:size-7 size-5 md:size-6  text-xs flex justify-center items-center  bg-green-600 rounded-full ${
                        textareaValue && textareaValue?.length >= 280
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {textareaValue?.length}
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    className={`bg-blue-400 rounded-full p-2  w-20 text-center ml-auto  active:bg-green-500 focus:outline-none ${
                      isPending ? "opacity-75" : ""
                    } `}
                  >
                    <button onClick={handleComment} disabled={isPending}>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {post?.comments.map((comment: CommentType) => (
          <CommentDisplayer
            comment={comment}
            authUserId={authUser?._id}
            postId={post._id}
            key={comment._id}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowPost;
