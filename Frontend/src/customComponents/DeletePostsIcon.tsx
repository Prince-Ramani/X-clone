import { AlertOctagon, Trash } from "lucide-react";
import CustomTooltip from "./ToolTip";
import { memo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDeletePostContext } from "@/context/DeletePostContext";

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
    const querClient = useQueryClient();
    const { setDeletePostId, setHasDeletedAnyPost } = useDeletePostContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { mutate: Delete, isPending: pendingDelete } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/post/deletepost/${postID}`, {
          method: "POST",
        });
        const data = await res.json();

        if ("error" in data) return toast.error(data.error);
        setDeletePostId(() => postID);
        setHasDeletedAnyPost(() => true);
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;
        querClient.invalidateQueries({ queryKey: [username, "PostsCount"] });

        setIsOpen(false);

        toast.success(data.message);
      },
    });

    return (
      <>
        {isOpen ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="min-w-full h-full flex items-center justify-center pb-10    z-50  flex-col bg-blue-200/10 bg-opacity-50 ">
              <DialogTitle />
              <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px] md:max-w-xs w-full">
                {pendingDelete ? (
                  <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                    <Loading />
                  </div>
                ) : (
                  ""
                )}
                <DialogDescription>
                  <div className=" w-full  flex flex-col p-4 gap-2 ">
                    <div className="font-bold tracking-tight text-red-600 flex gap-2  items-center ">
                      <div>
                        <AlertOctagon className="size-6" />
                      </div>
                      <div className="text-xl">Delete Post</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      When you delete a post, it will be permanently removed
                      from your profile and cannot be retrieved. Deleted posts
                      will no longer appear in your feed or be visible to
                      others.
                    </div>

                    <div>
                      <div className="flex flex-col gap-2 mt-7">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            pendingDelete ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={pendingDelete}
                          onClick={() => Delete()}
                        >
                          Delete post
                        </button>

                        <button
                          className={`bg-transparent  ring-1 ring-white/50 font-semibold rounded-full p-2 text-sm ${
                            pendingDelete ? "opacity-75" : "hover:bg-white/10"
                          } 
                      `}
                          disabled={pendingDelete}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Cancle
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
        <p
          className="p-2 rounded-full hover:bg-white/10"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <CustomTooltip title="Delete">
            <Trash className={`size-4 text-red-600 ${className}`} />
          </CustomTooltip>
        </p>
      </>
    );
  }
);

export default DeletPost;
