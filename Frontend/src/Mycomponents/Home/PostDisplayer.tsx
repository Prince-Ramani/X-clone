import { Bookmark, Dot, Heart, MessageCircle, Share } from "lucide-react";
import { PostType } from "./ForYou";

import { isToday, formatDistanceToNow } from "date-fns";

const PostDisplayer = ({ post }: { post: PostType }) => {
  const {
    comments,
    createdAt,
    likes,
        
    uploadedBy,
    uploadedPhoto,
    postContent,
  } = post;

  const formateDate = (dd: string) => {
    if (isToday(dd)) {
      return formatDistanceToNow(dd).split(" ")[1] + "h";
    }
  };

  return (
    <div className="border-b border-gray-600/60  p-2 pr-5 flex">
      <img
        src={uploadedBy.profilePic}
        className="size-10   rounded-full object-cover border "
      />

      <div className=" w-full h-fit ml-2 flex-flex-col ">
        <div className="flex gap-2 items-center ">
          <span className="font-bold">{uploadedBy.username}</span>
          <div className="flex items-center   text-gray-400/90">
            <span className="text-sm">@{uploadedBy.username}</span>
            <span>
              <Dot className="size-3" />
            </span>
            <span className="text-sm">{formateDate(createdAt)}</span>
          </div>
        </div>

        <div className="leading-normal text-sm/6 tracking-wide">
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

        <div className=" p-1 mt-1 flex items-center justify-between gap-4 text-gray-500/90">
          <span className="flex gap-1 items-end text-sm hover:text-blue-500 ">
            <MessageCircle className="size-6 p-1  rounded-full  hover:bg-blue-400/20" />
            {comments.length || 0}
          </span>
          <span className="flex gap-2 items-end text-sm hover:text-pink-600 ">
            <Heart className="size-6 p-1  rounded-full  hover:bg-pink-600/50" />
            {likes.length || 0}
          </span>

          <div className="flex items-center gap-4">
            <span className="flex gap-2 items-end text-sm">
              <Bookmark className="size-6 p-1 rounded-full hover:bg-blue-400/20" />
            </span>
            <span className="flex gap-2 items-end text-sm">
              <Share className="size-6 p-1 rounded-full hover:bg-blue-400/20" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDisplayer;
