import CustomTooltip from "@/customComponents/ToolTip";
import EmojiPicker from "@/customComponents/EmojiPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import TextareaAutosize from "react-textarea-autosize";
import {
  ArrowUpDown,
  ImageIcon,
  Plus,
  Smile,
  VideoIcon,
  X,
} from "lucide-react";
import { memo, useState } from "react";
import { useAuthUser } from "@/context/userContext";

const CreatePostHome = memo(() => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [textareaValue, setTextareaValue] = useState<string | null>("");
  const [file, setFile] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [_, setSelectedEmoji] = useState();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
  const [totalOptions, setTotalOptions] = useState<number>(2);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [optionValue, setOptionValue] = useState({
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    option5: "",
    option6: "",
    option7: "",
  });

  const [type, setType] = useState<"post" | "poll">("post");

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
        setFile([]);
        setTextareaValue("");
        setIsEmojiOpen(false);
        setImagesPreview([]);
        setVideo(null);
        setVideoPreview(null);
        queryClient.invalidateQueries({
          queryKey: [authUser?.username, "Posts"],
        });

        return toast.success("Post created successfully!");
      }
    },
  });

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
        setFile([]);
        setTextareaValue("");
        setIsEmojiOpen(false);
        setImagesPreview([]);

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
      if (file && file.length > 0) {
        file.forEach((f) => formData.append("uploadedPhoto", f));
      }

      if (video) formData.append("uploadedVideo", video);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + file.length > 4) {
      return toast.error("You can upload a maximum of 4 images.");
    }

    setFile((prev) => [...prev, ...selectedFiles]);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagesPreview((prev) => [...prev, ...previews]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const v = e.target.files[0];
    if (v) {
      setVideo(v);
      setImagesPreview([]);
      setFile([]);
      setVideoPreview(URL.createObjectURL(v));
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    setTextareaValue((prevText) => prevText + emoji.native);
  };

  const handleRemoveImage = (index: number) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pt-4 p-4 pb-1 border-b-2 border-gray-800">
      <div className=" flex gap-2   min-h-fit">
        <img
          src={authUser?.profilePic}
          alt="Your profilePic"
          className="h-10 w-10 object-cover shrink-0 rounded-full"
        />
        <div className="w-full flex flex-col">
          <div className="w-full border-b border-gray-800 min-h-fit ">
            <TextareaAutosize
              placeholder={` ${
                type === "post" ? "What is happening?!" : "Ask a question"
              }`}
              className="bg-transparent text-lg/6  h-auto block focus:outline-none w-full resize-none  "
              minRows={3}
              maxRows={25}
              value={textareaValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTextareaValue(e.target.value)
              }
            />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              disabled={type === "poll"}
              multiple
              accept="image/*"
            />

            <input
              type="file"
              id="upload-video"
              className="hidden"
              onChange={handleVideoChange}
              disabled={type === "poll"}
              accept="video/*"
            />

            {type === "poll" ? (
              <div className="border rounded-xl border-white/50 mb-5 ">
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
                            placeholder={`Option ${index + 1}${
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
                          className=" rounded-full hover:bg-blue-600/20 p-1 transition-colors"
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
                  className="border-t border-gray-500  cursor-pointer text-center text-lg p-3 text-red-500 hover:bg-white/5 transition-colors active:bg-red-500/20  "
                  onClick={() => setType("post")}
                >
                  Remove poll
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-1 p-2 items-center h-full ">
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
                <label
                  htmlFor="upload-video"
                  className={`${
                    type === "poll" ? " cursor-default" : " cursor-pointer"
                  }`}
                >
                  <VideoIcon
                    className={`size-5  ${
                      type === "poll" ? "text-gray-400/70" : "text-blue-400"
                    } `}
                  />
                </label>
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

            {textareaValue ? (
              <div
                className={`ml-auto lg:size-7 size-5 md:size-6  text-xs flex justify-center items-center  bg-green-600 rounded-full ${
                  textareaValue && textareaValue.length >= 280
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {textareaValue?.length}
              </div>
            ) : (
              ""
            )}

            <button
              className={`rounded-full p-2 px-4 text-semibold bg-blue-400 hover:opacity-90 ml-auto ${
                isPending ? "bg-gray-500" : ""
              }`}
              disabled={isPending}
              onClick={handlePostSubmit}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
          {imagesPreview.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap ">
              {imagesPreview.map((preview, index) => (
                <div className="flex flex-col justify-center items-center gap-1">
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className=" h-fit w-fit rounded-full p-0.5 hover:bg-white/10">
                    <CustomTooltip title="Remove">
                      <X
                        className=" text-red-600 transition-colors cursor-pointer flex justify-center items-center w-full bg-transparent"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </CustomTooltip>
                  </div>
                </div>
              ))}
            </div>
          )}

          {videoPreview ? (
            <div className=" flex flex-col gap-2 items-center  ">
              <div>
                <video controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className=" h-fit w-fit rounded-full  p-1 hover:bg-white/10">
                <CustomTooltip title="Remove">
                  <X
                    className="   rounded-full  transition-colors cursor-pointer flex justify-center items-center w-full "
                    onClick={() => {
                      setVideo(null);
                      setVideoPreview(null);
                    }}
                  />
                </CustomTooltip>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
});

export default CreatePostHome;
