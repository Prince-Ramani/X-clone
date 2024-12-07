import TextareaAutosize from "react-textarea-autosize";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useCreatePostContext } from "@/context/createPostContext";
import {
  ArrowUpDown,
  ImageIcon,
  Plus,
  Smile,
  VideoIcon,
  X,
} from "lucide-react";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomTooltip from "@/customComponents/ToolTip";
import Loading from "@/components/ui/Loading";
import EmojiPicker from "@/customComponents/EmojiPicker";

const CreatePostDialog = () => {
  const { isCreateDialogOpen, setCreateDialog } = useCreatePostContext();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [textareaValue, setTextareaValue] = useState<string | null>("");
  const [type, setType] = useState<"poll" | "post">("post");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [totalOptions, setTotalOptions] = useState<number>(2);
  const [optionValue, setOptionValue] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    option5: "",
    option6: "",
    option7: "",
  });

  const [_, setSelectedEmoji] = useState();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);

  //post

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/post/createpost", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        setCreateDialog(false);
        setIsEmojiOpen(false);
        queryClient.invalidateQueries({
          queryKey: [authUser?.username, "Posts"],
        });
        queryClient.invalidateQueries({
          queryKey: [authUser?.username, "Media"],
        });
        return toast.success("Post created successfully!");
      }
    },
  });

  useEffect(() => {
    if (isCreateDialogOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreateDialogOpen]);

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    setTextareaValue((prevText) => prevText + emoji.native);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileExists = e.target.files?.[0];
    if (fileExists) {
      setFile(fileExists);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(fileExists);
    }
  };

  const { mutate: createPoll } = useMutation({
    mutationFn: async (send) => {
      const res = await fetch("/api/post/createPoll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(send),
      });

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        setFile(null);
        setTextareaValue("");
        setIsEmojiOpen(false);
        setImagePreview(null);

        setCreateDialog(false);

        return toast.success(data.message);
      }
    },
  });

  const handlePostSubmit = () => {
    if (!textareaValue) return toast.error("Content required!");

    if (type === "post") {
      if (textareaValue.length >= 280)
        return toast.error("Post length must be less than 280 characters!");

      const formData = new FormData();

      formData.append("postContent", textareaValue);
      if (file) formData.append("uploadedPhoto", file);

      createPost(formData);
    }

    if (textareaValue && type === "poll") {
      if (textareaValue.length >= 280)
        return toast.error(
          "Poll content length must be less than 280 characters!"
        );

      const optionsArray = Object.values(optionValue).filter(
        (option) => option.trim() !== ""
      );

      let errory: boolean = false;

      for (let i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].length > 25) errory = true;
      }

      if (errory) return toast.error("A option can have maximum 25 charcters!");

      if (optionsArray.length < 2)
        return toast.error("A poll must have minimum 2 options!");

      //@ts-ignore

      createPoll({ postContent: textareaValue, options: optionsArray });
    }
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialog}>
      <DialogContent className="fixed inset-0 p-3 pt-20 sm:pt-36 flex items-center md:p-0 md:pt-9 z-50 flex-col bg-blue-200/20 bg-opacity-50 ">
        <DialogTitle />
        <div className="bg-black p-3 relative rounded-3xl max-w-xl w-full ">
          {isPending ? (
            <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-3xl bg-blue-50/20 cursor-not-allowed">
              <Loading />
            </div>
          ) : (
            ""
          )}
          <DialogClose asChild>
            <button
              className={`  text-white  p-2 rounded-full cursor-pointer ${
                isPending ? "opacity-70" : "hover:bg-gray-800/50 "
              }  `}
              disabled={isPending}
              onClick={() => {
                setTextareaValue("");
                setFile(null);
              }}
            >
              <X />
            </button>
          </DialogClose>
          <DialogDescription>
            <div className=" w-full  flex flex-col ">
              <div className="w-full flex gap-3 p-1">
                <img
                  src={authUser?.profilePic}
                  className="size-10 object-cover rounded-full "
                />
                <TextareaAutosize
                  className="bg-transparent w-full  text-lg resize-none focus:outline-none mt-2 scro"
                  minRows={3}
                  maxRows={14}
                  value={textareaValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setTextareaValue(e.target.value)
                  }
                  ref={textareaRef}
                  placeholder={` ${
                    type === "post" ? "What is happening?!" : "Ask a question"
                  }`}
                />
              </div>

              {type === "poll" ? (
                <div className="border m-2 rounded-xl border-white/50 mb-5  ">
                  <div className="p-2 flex ">
                    <div className="flex w-full h-full pb-3   ">
                      <div className="w-full flex flex-col gap-2 ">
                        {Array(totalOptions)
                          .fill(0)
                          .map((_, index) => (
                            <input
                              key={index}
                              type="text"
                              className="bg-transparent border-[1px] border-gray-500 rounded-md focus:outline-none focus:border-blue-400 w-full p-2"
                              placeholder={`Option ${index + 1} ${
                                index + 1 > 2 ? "(optional)" : ""
                              } `}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setOptionValue((prev) => ({
                                  ...prev,
                                  [`option${index + 1}`]: e.target.value,
                                }))
                              }
                            />
                          ))}
                      </div>
                    </div>
                    {totalOptions < 7 ? (
                      <div className="flex min-h-full  items-end pl-1  pb-3  ">
                        <CustomTooltip title="Add">
                          <div
                            className=" rounded-full hover:bg-blue-600/20 p-1 transition-colors cursor-pointer"
                            onClick={() => setTotalOptions((prev) => prev + 1)}
                          >
                            <Plus className="text-blue-400" />
                          </div>
                        </CustomTooltip>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className="border-t border-gray-500 cursor-pointer  text-center text-lg p-3 text-red-500 hover:bg-white/5 transition-colors active:bg-red-500/20  "
                    onClick={() => setType("post")}
                  >
                    Remove poll
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="flex gap-1 p-2 items-center h-full  pb-0 border-t-2 border-gray-800/50 ">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={type === "poll"}
                />
                <CustomTooltip title="Media">
                  <button
                    className={`rounded-full    ${
                      type === "poll"
                        ? " cursor-default"
                        : "hover:bg-gray-800 cursor-pointer"
                    } `}
                    disabled={type === "poll"}
                  >
                    <label
                      htmlFor="file-upload"
                      className={`${
                        type === "poll" ? " cursor-default" : " cursor-pointer"
                      }`}
                    >
                      <ImageIcon
                        className={`size-5  m-2 ${
                          type === "poll" ? "text-gray-400/70" : "text-blue-400"
                        }`}
                      />
                    </label>
                  </button>
                </CustomTooltip>
                <CustomTooltip title="Video">
                  <button
                    className={`rounded-full p-2 ${
                      type === "poll"
                        ? " cursor-default"
                        : "cursor-pointer hover:bg-gray-800/70"
                    } `}
                    disabled={type === "poll"}
                  >
                    <VideoIcon
                      className={`size-5  ${
                        type === "poll" ? "text-gray-400/70" : "text-blue-400"
                      } `}
                    />
                  </button>
                </CustomTooltip>
                <CustomTooltip title="Poll">
                  <button
                    className={`rounded-full p-2  ${
                      type === "poll"
                        ? "hover:bg-gray-800/70 cursor-default"
                        : " cursor-pointer"
                    }  `}
                    onClick={() => setType("poll")}
                    disabled={type === "poll"}
                  >
                    <ArrowUpDown
                      className={`size-5  ${
                        type === "poll" ? "text-gray-400/70" : "text-blue-400"
                      } `}
                    />
                  </button>
                </CustomTooltip>
                <CustomTooltip title="Emoji">
                  <button
                    className=" relative rounded-full p-2 hover:bg-gray-800/70 cursor-pointer"
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
                  </button>
                </CustomTooltip>
                <div
                  className={`ml-auto lg:size-8 size-5 md:size-6 text-sm flex justify-center items-center bg-green-600 rounded-full ${
                    !textareaValue ? "hidden" : "flex"
                  } ${
                    textareaValue && textareaValue.length >= 280
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                >
                  {textareaValue?.length}
                </div>
                <button
                  className={`bg-blue-400 rounded-full  w-2/12 p-2 ml-auto  ${
                    isPending
                      ? "opactiy-75"
                      : "hover:opacity-90 active:bg-green-500 "
                  }`}
                  onClick={() => handlePostSubmit()}
                  disabled={isPending}
                >
                  {isPending ? "Posting..." : "Post"}
                </button>
              </div>
              {imagePreview ? (
                <div className="text-xs ml-5  w-fit p-2 flex gap-3 items-center ">
                  <img
                    src={imagePreview}
                    alt="Selected preview"
                    className=" size-24 object-cover rounded-md"
                  />
                  <CustomTooltip title="Close">
                    <button
                      className={`  text-white  p-2 rounded-full ${
                        isPending ? "" : "hover:bg-gray-800/50"
                      }   `}
                      onClick={() => {
                        setFile(null);
                        setImagePreview(null);
                      }}
                      disabled={isPending}
                    >
                      <X className="size-5  rounded-full  text-center cursor-pointer hover:opacity-70" />
                    </button>
                  </CustomTooltip>
                </div>
              ) : (
                ""
              )}
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
