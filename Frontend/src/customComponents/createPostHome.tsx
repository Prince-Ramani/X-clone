import CustomTooltip from "@/customComponents/ToolTip";
import EmojiPicker from "@/customComponents/EmojiPicker";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import TextareaAutosize from "react-textarea-autosize";
import {
  ArrowUpDown,
  ImageIcon,
  Minus,
  Plus,
  Smile,
  VideoIcon,
  X,
} from "lucide-react";
import { memo, useState } from "react";
import { useAuthUser } from "@/context/userContext";
import VideoPlayer from "./VideoPlayer";

const CreatePostHome = memo(() => {
  const { authUser } = useAuthUser();
  const [textareaValue, setTextareaValue] = useState<string | null>("");
  const [file, setFile] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [_, setSelectedEmoji] = useState();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
  const [totalOptions, setTotalOptions] = useState<number>(2);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [explanation, setExpanation] = useState<string>("");
  const [explanationImage, setExpanationImage] = useState<File | null>(null);
  const [explanationImagePreview, setExpanationImagePreview] =
    useState<string>("");

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

      resetStates();

      return toast.success("Post created successfully!");
    },
  });

  const resetStates = () => {
    setType("post");
    setFile([]);
    setTextareaValue("");
    setIsEmojiOpen(false);
    setImagesPreview([]);
    setVideo(null);
    setVideoPreview(null);
  };

  const { mutate: createPoll, isPending: pendingPoll } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/post/createPoll", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);

      resetStates();
      return toast.success(data.message);
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
      const formData = new FormData();

      const optionsArray: string[] = Object.values(optionValue).filter(
        (option) => option.trim() !== ""
      );

      let errory: boolean = false;

      for (let i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].length > 25) errory = true;
      }

      if (errory) return toast.error("A option can have maximum 25 charcters!");

      if (optionsArray.length < 2)
        return toast.error("A poll must have minimum 2 options!");

      if (explanation) {
        if (explanation.length > 100) {
          return toast.error(
            "Explanation length must not exceed 100 characters!"
          );
        }
        formData.append("explanation", explanation);
      }

      if (explanationImage)
        formData.append("explanationImage", explanationImage);

      formData.append("postContent", textareaValue);
      const optionArraySerialized = JSON.stringify(optionsArray);
      formData.append("options", optionArraySerialized);

      createPoll(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + file.length > 4) {
      return toast.error("You can upload a maximum of 4 images.");
    }

    if (video || videoPreview) {
      setVideo(null);
      setVideoPreview(null);
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

  const handleExplanationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (file) {
      setFile([]);
      setImagesPreview([]);
    }

    if (video) {
      setVideo(null);
      setVideoPreview(null);
    }
    if (e.target.files !== null && e.target.files[0]) {
      const fi = e.target.files[0];
      setExpanationImage(fi);
      setExpanationImagePreview(URL.createObjectURL(fi));
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

  const switchToPoll = () => {
    if (imagesPreview || file) {
      setFile([]);
      setImagesPreview([]);
    }

    if (video || videoPreview) {
      setVideo(null);
      setVideoPreview(null);
    }

    setTotalOptions(2);

    setType("poll");
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
                  {totalOptions > 1 ? (
                    <div className="flex flex-col min-h-full  justify-end items-center gap-4 pl-1  pb-4   ">
                      {totalOptions > 2 ? (
                        <CustomTooltip title="Remove">
                          <div
                            className=" rounded-full hover:bg-blue-600/20  p-1  transition-colors"
                            onClick={() => setTotalOptions((prev) => prev - 1)}
                          >
                            <Minus className="text-red-600" />
                          </div>
                        </CustomTooltip>
                      ) : (
                        ""
                      )}
                      {totalOptions < 7 ? (
                        <CustomTooltip title="Add">
                          <div
                            className=" rounded-full hover:bg-blue-600/20 p-1 transition-colors"
                            onClick={() => setTotalOptions((prev) => prev + 1)}
                          >
                            <Plus className="text-blue-400" />
                          </div>
                        </CustomTooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="border-t border-gray-500 ">
                  <div className="p-2 flex flex-col gap-2 pb-5">
                    <div className="font-semibold text-gray-300">
                      Explanation{" "}
                      <span className="text-gray-400 font-normal ">
                        (optional)
                      </span>
                    </div>
                    <TextareaAutosize
                      placeholder="Explanation if needed!"
                      className="bg-transparent text-sm border-gray-400 border rounded-md  focus:border-blue-500 p-2  h-auto block focus:outline-none w-full resize-none  "
                      minRows={3}
                      maxRows={7}
                      value={explanation}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setExpanation(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-500 ">
                  <div className="font-semibold p-2">
                    Image for better explanation!{" "}
                    <span className="text-gray-400 font-normal ">
                      (optional)
                    </span>
                  </div>
                  <input
                    type="file"
                    id="explanation-upload"
                    className="hidden"
                    onChange={handleExplanationImageChange}
                    multiple
                    accept="image/*"
                  />

                  {explanationImagePreview ? (
                    <div className=" w-full p-2 relative ">
                      <img
                        src={explanationImagePreview}
                        className="h-full max-h-96 w-full rounded-sm border-gray-400/20 border"
                      />
                      <CustomTooltip title="Remove">
                        <div
                          className=" flex justify-center items-center font-bold pt-2  "
                          onClick={() => {
                            setExpanationImagePreview("");
                            setExpanationImage(null);
                          }}
                        >
                          <X className="hover:bg-white/20 p-2 size-10 rounded-full " />
                        </div>
                      </CustomTooltip>
                    </div>
                  ) : (
                    <label
                      htmlFor="explanation-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex justify-center items-center  p-5 group transition-colors duration-200 hover:bg-white/20">
                        <ImageIcon className="size-10 group group-hover:text-blue-500 transition-all" />
                      </div>
                    </label>
                  )}
                </div>

                <div
                  className="border-t border-gray-500  cursor-pointer text-center text-lg p-3 text-red-500 hover:bg-white/5 transition-colors active:bg-red-500/20  "
                  onClick={() => {
                    setType("post");
                    setExpanationImage(null);
                    setExpanation("");
                    setExpanationImagePreview("");
                  }}
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
                    ? "cursor-default"
                    : " cursor-pointer hover:bg-gray-800/70 "
                }  `}
                onClick={() => switchToPoll()}
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
              <div
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
              </div>
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
                isPending || pendingPoll ? "bg-gray-500" : ""
              }`}
              disabled={isPending || pendingPoll}
              onClick={handlePostSubmit}
            >
              {isPending || pendingPoll ? "Posting..." : "Post"}
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
              <div className="w-full h-fit">
                <VideoPlayer source={videoPreview} />
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
