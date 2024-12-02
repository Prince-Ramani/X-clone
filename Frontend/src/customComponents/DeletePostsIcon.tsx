import { Trash } from "lucide-react";
import CustomTooltip from "./ToolTip";
import { memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const DeletPost = memo(
  ({
    className,
    postID,
    username,
  }: {
    className?: string;
    postID: string;
    username: string;
  }) => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/post/deletepost/${postID}`, {
          method: "POST",
        });
        const data = await res.json();
        console.log(data);

        if ("error" in data) toast.error(data.error);

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;
        queryClient.invalidateQueries({ queryKey: [username, "Posts"] });
        queryClient.invalidateQueries({ queryKey: [username, "Media"] });

        toast.success(data.message);
      },
    });

    return (
      <p
        className="p-2 rounded-full hover:bg-white/10"
        onClick={() => mutate()}
      >
        <CustomTooltip title="Delete">
          <Trash className={`size-4 text-red-600 ${className}`} />
        </CustomTooltip>
      </p>
    );
  }
);

export default DeletPost;
