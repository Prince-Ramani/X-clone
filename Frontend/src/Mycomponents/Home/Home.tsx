import { useAuthUser } from "@/context/userContext";
import { ArrowUpDown, ImageIcon, Smile, VideoIcon } from "lucide-react";
import { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";

const Home = () => {
  const { authUser } = useAuthUser();
  const [isActive, setIsActive] = useState<"For you" | "Following">("For you");
  const [textareaValue, setTextareaValue] = useState<string>("");

  return (
    <div className="min-h-full w-full  bg-black border border-gray-800 border-b-0 border-t-0  ">
      {/* Top */}

      <div className="border-b border-gray-800   flex justify-around items-center bg-black sticky top-0  ">
        <div
          className=" py-4  h-full w-1/2 text-center hover:bg-gray-700/30 cursor-pointer"
          onClick={() => setIsActive("For you")}
        >
          <span
            className={`  h-full py-3  rounded-sm font-semibold tracking-tight ${
              isActive === "For you" ? "border-b-4 border-blue-500" : null
            }`}
          >
            For you
          </span>
        </div>
        <div
          className=" py-4  h-full w-1/2 text-center hover:bg-gray-700/30 cursor-pointer"
          onClick={() => setIsActive("Following")}
        >
          <span
            className={`  h-full py-3   rounded-sm font-semibold tracking-tight ${
              isActive === "Following" ? "border-b-4 border-blue-500" : null
            }`}
          >
            Following
          </span>
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
                maxRows={100}
                value={textareaValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTextareaValue(e.target.value)
                }
              />
            </div>
            <div className="flex gap-1 p-2 items-center h-full ">
              <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer ">
                <ImageIcon className="size-5 text-blue-400" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
