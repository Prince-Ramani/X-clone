import { useAuthUser } from "@/context/userContext";
import { useState } from "react";
import ForYou from "./ForYou";
import CreatePostHome from "@/customComponents/createPostHome";

import Following from "./Following";

const Home = () => {
  const { authUser } = useAuthUser();

  const [isActive, setIsActive] = useState<"For you" | "Following">("For you");

  return (
    <div className="min-h-full  w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0 ">
      {/* Top */}

      <div className="border-b border-gray-800 h-12  flex  justify-around items-center backdrop-blur-lg bg-black/70  sticky top-0 z-10  ">
        <button
          className="h-full w-1/2 text-center hover:bg-gray-700/30"
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
        </button>
        <button
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
        </button>
      </div>
      {/* Posts */}

      <CreatePostHome />

      {isActive === "For you" ? (
        <ForYou
          authUserId={authUser?._id}
          snapChange={isActive}
          setSnapChange={setIsActive}
        />
      ) : (
        <Following authUserId={authUser?._id} />
      )}
    </div>
  );
};

export default Home;
