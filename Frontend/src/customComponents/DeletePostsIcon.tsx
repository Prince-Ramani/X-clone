import { Trash } from "lucide-react";
import CustomTooltip from "./ToolTip";
import { memo } from "react";

import { useDeletePostContext } from "@/context/DeletePostContext";

const DeletPost = memo(
  ({
    className,
    postID,
  }: {
    className?: string;
    postID: string;
    username: string;
  }) => {
    const { setDeletePostId, setDeleteContext } = useDeletePostContext();

    return (
      <p
        className="p-2 rounded-full hover:bg-white/10"
        onClick={() => {
          setDeleteContext(true);
          setDeletePostId(postID);
        }}
      >
        <CustomTooltip title="Delete">
          <Trash className={`size-4 text-red-600 ${className}`} />
        </CustomTooltip>
      </p>
    );
  }
);

export default DeletPost;
