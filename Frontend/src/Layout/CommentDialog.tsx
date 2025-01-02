import TextareaAutosize from "react-textarea-autosize";

import { Dot, Smile, X } from "lucide-react";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { FormateDate } from "@/lib/Date";
import Loading from "@/components/ui/Loading";
import EmojiPicker from "@/customComponents/EmojiPicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const CommentDialog = ({
  setIsOpen,
  isOpen,
  postId,
  username,
  postContent,
  createdAt,
  uploadedPhoto,
  profilePic,
  setTotalNewComments,
}: {
  isOpen: boolean;
  setIsOpen: any;
  postId: string;
  username: string;
  postContent: string;
  createdAt: string;
  uploadedPhoto: string[];
  profilePic: string;
  setTotalNewComments: any;
}) => {
  const { authUser } = useAuthUser();

  const querClient = useQueryClient();

  const [textareaValue, setTextareaValue] = useState<string>("");
  const [_, setSelectedEmoji] = useState();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    mutate: postReply,
    isPending,
    data,
  } = useMutation({
    mutationFn: async (value: string) => {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        querClient.invalidateQueries({
          queryKey: [postId, username],
        });

        return toast.success("Replied successfully!");
      }
    },
  });

  useEffect(() => {
    if (data) {
      setIsEmojiOpen(false);
      setTotalNewComments((prev: number) => prev + 1);
      setIsOpen(false);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    setTextareaValue((prevText) => prevText + emoji.native);
  };

  const handleReplySubmit = () => {
    if (textareaValue) {
      if (textareaValue.length >= 280)
        return toast.error("Post length must be less than 280 characters!");

      postReply(textareaValue);
    } else {
      toast.error("Reply content required!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="fixed w-full flex items-center  pb-40   z-50 flex-col     bg-transparent  ">
        <DialogTitle />
        <div className="relative bg-black p-3 rounded-3xl max-w-xl  focus:outline-none focus-visible:outline-none focus-visible:border-none w-full border shadow-sm shadow-slate-50/30 border-gray-400/20">
          {isPending ? (
            <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
              <Loading />
            </div>
          ) : (
            ""
          )}
          <DialogClose asChild>
            <button
              className={`  text-white  p-2 rounded-full${
                isPending ? "opacity-70" : " hover:bg-gray-800/50 "
              } `}
              disabled={isPending}
              onClick={() => {
                setTextareaValue("");
              }}
            >
              <X />
            </button>
          </DialogClose>
          <DialogDescription />
          <div className=" w-full  flex flex-col  ">
            <div className="flex gap-2">
              <div className="w-fit flex flex-col justify-center items-center gap-1   shrink-0 ">
                <img
                  src={profilePic}
                  className="size-10 object-cover rounded-full shrink-0  "
                />
                <div className="border border-gray-500/80 h-full w-0 " />
              </div>
              <div className="flex flex-col gap-2  w-full">
                <div className="flex gap-2 h-fit 8 items-center ">
                  <span className="font-semibold">{username}</span>
                  <div className="text-sm flex justify-center text-gray-400/80 font-thin ">
                    <span className="">@{username}</span>
                    <Dot className="size-4 mt-1" />
                    <span>{FormateDate(createdAt)}</span>
                  </div>
                </div>
                <div className="tracking-wide leading-snug break-words break-all text-sm  lg:pr-4   ">
                  {postContent}
                </div>
                {uploadedPhoto.length > 0 && uploadedPhoto.length === 1 ? (
                  <div>
                    <img
                      src={uploadedPhoto[0]}
                      className="min-w-40 max-h-40 border-[1px] border-gray-400/80 rounded-2xl "
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="text-gray-400/80 text-sm ">
                  Replying to <span className="text-blue-400">@{username}</span>
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
              <span
                className="rounded-full p-2 hover:bg-gray-800/70 relative cursor-pointer"
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
              <div
                className={`ml-auto text-xs lg:size-8 size-5 md:size-6 md:text-sm flex justify-center items-center rounded-full ${
                  textareaValue && textareaValue.length >= 280
                    ? "bg-red-600"
                    : "bg-green-600"
                } 
                     ${!textareaValue ? "hidden" : "block"} `}
              >
                {textareaValue?.length}
              </div>
              <button
                className={`bg-blue-400 rounded-full  w-2/12 min-w-28 p-2 ml-auto cursor-pointer ${
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
