import { Trash } from "lucide-react";

import { memo, useState } from "react";
import CustomTooltip from "./ToolTip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";

const DeleteComment = memo(
  ({
    className,
    username,
    commentID,
    postID,
    isCreator,
  }: {
    isCreator: boolean;
    className?: string;
    commentID: string;
    postID: string;
    username: string;
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const querClient = useQueryClient();
    const { mutate: DeleteComment, isPending } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/post/${postID}/deletecomment/${commentID}`,
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
        querClient.invalidateQueries({ queryKey: [postID, username] });

        toast.success(data.message);
      },
    });

    return (
      <>
        {isOpen ? (
          <div className="">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="  flex items-center justify-center pb-10 min-w-full h-full    z-50 flex-col bg-blue-200/10 bg-opacity-50 ">
                <DialogTitle />
                <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px]  md:max-w-xs w-full">
                  {isPending ? (
                    <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                      <Loading />
                    </div>
                  ) : (
                    ""
                  )}
                  <DialogDescription />
                  <div className=" w-full  flex flex-col p-4 ">
                    <div className="font-bold ">
                      <div className="text-red-700 font-extrabold">
                        Delete Comment
                      </div>
                      <div className="">@{username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      {isCreator
                        ? "Are you sure you want to delete this comment from your post!?"
                        : "Their comment will no longer show up in this post . You can still comment on their posts, unless their posts are protected."}
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 mt-7">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={isPending}
                          onClick={() => DeleteComment()}
                        >
                          Delete
                        </button>

                        <button
                          className={`bg-transparent  ring-1 ring-white/50 font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:bg-white/10"
                          } 
                      `}
                          disabled={isPending}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Cancle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          ""
        )}

        <CustomTooltip title="Delete">
          <button
            className="p-1 rounded-full hover:bg-white/10"
            onClick={() => setIsOpen(true)}
            disabled={isPending}
          >
            <Trash className={`size-4 text-red-600 ${className}`} />
          </button>
        </CustomTooltip>
      </>
    );
  }
);

export default DeleteComment;
