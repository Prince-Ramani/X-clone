import { useAuthUser } from "@/context/userContext";
import { ArrowUpDown, ImageIcon, Smile, VideoIcon, X } from "lucide-react";
import { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import ForYou from "./ForYou";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Following from "./Following";
import CustomTooltip from "@/customComponents/ToolTip";

const Home = () => {
  const { authUser } = useAuthUser();

  const [isActive, setIsActive] = useState<"For you" | "Following">("For you");
  const [textareaValue, setTextareaValue] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/post/createpost", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        setFile(null);
        setTextareaValue("");
        return toast.success("Post created successfully!");
      }
    },
  });

  const handlePostSubmit = () => {
    if (textareaValue) {
      if (textareaValue.length >= 280)
        return toast.error("Post length must be less than 280 characters!");

      const formData = new FormData();

      formData.append("postContent", textareaValue);
      if (file) formData.append("uploadedPhoto", file);

      createPost(formData);
    } else {
      toast.error("Post content required!");
    }
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

  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0   ">
      {/* Top */}
      <div className="border-b border-gray-800 h-12  flex justify-around items-center backdrop-blur-lg bg-black/70  sticky top-0  ">
        <div
          className="h-full w-1/2 text-center hover:bg-gray-700/30   "
          onClick={() => setIsActive("For you")}
        >
          <div className="h-full flex flex-col justify-center items-center pt-3">
            <span
              className={`  h-full   rounded-sm font-semibold tracking-tight text-sm ${
                isActive === "For you" ? "" : "font-medium text-gray-400/60"
              }`}
            >
              For you
            </span>
            <div
              className={`border-2  border-blue-400 rounded-full w-12 ${
                isActive === "For you" ? "block" : "hidden"
              }`}
            />
          </div>
        </div>
        <div
          className="   h-full w-1/2 text-center hover:bg-gray-700/30 cursor-pointer"
          onClick={() => setIsActive("Following")}
        >
          <div className=" h-full flex flex-col justify-center items-center pt-[12px] ">
            <span
              className={`  h-full   rounded-sm font-semibold tracking-tight text-sm ${
                isActive === "Following" ? "" : "font-medium text-gray-400/60"
              }`}
            >
              Following
            </span>
            <div
              className={`border-2  border-blue-400 rounded-full w-16 ${
                isActive === "Following" ? "block" : "hidden"
              }`}
            />
          </div>
        </div>
      </div>
      {/* Posts */}
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
                placeholder="What is happening?!"
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
              />
            </div>

            <div className="flex gap-1 p-2 items-center h-full ">
              <CustomTooltip title="Media">
                <span className="rounded-full  hover:bg-gray-800/70 cursor-pointer ">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <ImageIcon className="size-5 text-blue-400 m-2" />
                  </label>
                </span>
              </CustomTooltip>
              <CustomTooltip title="Video">
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <VideoIcon className="size-5 text-blue-400" />
                </span>
              </CustomTooltip>
              <CustomTooltip title="Poll">
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <ArrowUpDown className="size-5 text-blue-400" />
                </span>
              </CustomTooltip>
              <CustomTooltip title="Emoji">
                <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                  <Smile className="size-5 text-blue-400" />
                </span>
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
            {imagePreview ? (
              <div className="text-xs  w-fit p-2 pt-0 flex gap-3 items-center ">
                <img
                  src={imagePreview}
                  alt="Selected preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
                <X
                  className="size-5  rounded-full  text-center cursor-pointer hover:opacity-70"
                  onClick={() => {
                    setFile(null);
                    setImagePreview(null);
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {isActive === "For you" ? (
        <ForYou authUserId={authUser?._id} />
      ) : (
        <Following authUserId={authUser?._id} />
      )}
    </div>
  );
};

export default Home;
