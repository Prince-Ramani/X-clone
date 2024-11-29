import { CommentType } from "@/lib/Types";
import { differenceInDays } from "date-fns";
import { Dot } from "lucide-react";

const CommentDisplayer = ({ comment }: { comment: CommentType }) => {
  console.log(comment.createdAt);
  return (
    <div>
      <div className="p-2 flex gap-2 ">
        <img
          src={comment.commenter.profilePic}
          className="size-10 rounded-full object-cover"
        />
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-sm">
            {comment.commenter.username}
          </span>
          <span className="text-xs text-gray-400/90">
            @{comment.commenter.username}
          </span>
          <Dot className="size-4 text-gray-400/90" />
        </div>
      </div>
    </div>
  );
};

export default CommentDisplayer;
