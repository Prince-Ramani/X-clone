import TextareaAutosize from "react-textarea-autosize";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";

import { ArrowUpDown, Dot, ImageIcon, Smile, VideoIcon, X } from "lucide-react";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useReplyDialogContext } from "@/context/ReplyPostContext";
import { FormateDate } from "@/lib/Date";

const ReplyDialog = () => {
  const { authUser } = useAuthUser();
  const { isReplyDialogOpen, setIsReplyDialog, postContent, setPostContent } =
    useReplyDialogContext();

  const querClient = useQueryClient();

  const [textareaValue, setTextareaValue] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: postReply, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/post/comment/${postContent._id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        setIsReplyDialog(false);
        setPostContent(null);
        querClient.invalidateQueries({
          queryKey: [postContent?._id, postContent?.uploadedBy.username],
        });

        return toast.success("Replied successfully!");
      }
    },
  });

  useEffect(() => {
    if (isReplyDialogOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReplyDialogOpen]);

  const handleReplySubmit = () => {
    if (textareaValue) {
      if (textareaValue.length >= 280)
        return toast.error("Post length must be less than 280 characters!");

      const formData = new FormData();

      formData.append("text", textareaValue);

      postReply(formData);
    } else {
      toast.error("Reply content required!");
    }
  };

  return (
    <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialog}>
      <DialogContent className="fixed inset-0 flex items-center pt-9 z-50 flex-col bg-blue-200/20 bg-opacity-50  ">
        <DialogTitle />
        <div className="bg-black p-3 rounded-3xl max-w-xl w-full">
          <DialogClose asChild>
            <button
              className="  text-white  p-2 rounded-full hover:bg-gray-800/50  "
              onClick={() => {
                setTextareaValue("");
              }}
            >
              <X />
            </button>
          </DialogClose>
          <DialogDescription>
            <div className=" w-full  flex flex-col  ">
              <div className="flex gap-2">
                <div className="w-fit flex flex-col justify-center items-center gap-1   shrink-0 ">
                  <img
                    src={postContent?.uploadedBy.profilePic}
                    className="size-10 object-cover rounded-full shrink-0  "
                  />
                  <div className="border border-gray-500/80 h-full w-0 " />
                </div>
                <div className="flex flex-col gap-2  w-full">
                  <div className="flex gap-2 h-fit 8 items-center ">
                    <span className="font-semibold">
                      {postContent?.uploadedBy.username}
                    </span>
                    <div className="text-sm flex justify-center text-gray-400/80 font-thin ">
                      <span className="">
                        @{postContent?.uploadedBy.username}
                      </span>
                      <Dot className="size-4 mt-1" />
                      <span>{FormateDate(postContent?.createdAt)}</span>
                    </div>
                  </div>
                  <div className="tracking-wide leading-snug break-words break-all text-sm  lg:pr-4   ">
                    {postContent.postContent}
                  </div>
                  {postContent?.uploadedPhoto ? (
                    <div>
                      <img
                        src={postContent.uploadedPhoto}
                        className="min-w-40 max-h-40 border-[1px] border-gray-400/80 rounded-2xl "
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="text-gray-400/80 text-sm ">
                    Replying to{" "}
                    <span className="text-blue-400">
                      @{postContent?.uploadedBy.username}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-3 p-1 mt-2 ">
                <img
                  src={authUser?.profilePic}
                  className="size-9 object-cover rounded-full "
                />
                <TextareaAutosize
                  className="bg-transparent w-full  text-lg resize-none focus:outline-none mt-2 scro"
                  minRows={4}
                  maxRows={10}
                  value={textareaValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setTextareaValue(e.target.value)
                  }
                  ref={textareaRef}
                  placeholder="Post your reply"
                />
              </div>
              <div className="flex gap-1 p-2 items-center h-full  pb-0 border-t-2 border-gray-800/50 ">
                <span className="rounded-full p-2 hover:bg-gray-800/70   cursor-pointer  ">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <ImageIcon className="size-5 text-blue-400" />
                  </label>
                </span>
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <VideoIcon className="size-5 text-blue-400" />
                </span>
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <ArrowUpDown className="size-5 text-blue-400" />
                </span>
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <Smile className="size-5 text-blue-400" />
                </span>
                <div
                  className={`ml-auto lg:size-8 size-5 md:size-6 text-sm flex justify-center items-center rounded-full ${
                    textareaValue && textareaValue.length >= 280
                      ? "bg-red-600"
                      : "bg-green-600"
                  } 
                     ${!textareaValue ? "hidden" : "block"} `}
                >
                  {textareaValue?.length}
                </div>
                <button
                  className={`bg-blue-400 rounded-full  w-2/12 p-2 ml-auto cursor-pointer ${
                    isPending || !textareaValue
                      ? "opacity-70"
                      : "active:bg-green-500 "
                  } `}
                  onClick={() => handleReplySubmit()}
                  disabled={isPending || !textareaValue}
                >
                  {isPending ? "Replying..." : "Reply"}
                </button>
              </div>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
