import { useCreatePostContext } from "@/context/createPostContext";
import { useAuthUser } from "@/context/userContext";

import {
  BellIcon,
  CircleEllipsis,
  Ellipsis,
  Home,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

enum CurrentlyOnOptions {
  home = "home",
  explore = "search",
  notifications = "notifications",
  profile = "profile",
  more = "more",
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setCreateDialog } = useCreatePostContext();

  const [currentlyOn, setCurrentlyOn] = useState<CurrentlyOnOptions | null>();

  const { authUser } = useAuthUser();

  useEffect(() => {
    if (
      Object.values(CurrentlyOnOptions).includes(
        location.pathname as CurrentlyOnOptions
      )
    ) {
      setCurrentlyOn(location.pathname as CurrentlyOnOptions);
    } else {
      setCurrentlyOn(CurrentlyOnOptions.home);
    }
  }, [location]);

  return (
    <div className=" md:w-3/12 lg:w-3/12 xl:w-2/12 min-h-full  border    py-2 border-r  border-gray-800/10 hidden md:flex flex-col   ">
      <X className="size-8 ml-3" />
      <div className="flex flex-col py-5 gap-y-1">
        <div
          className="flex justify-start cursor-pointer   gap-4 hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors delay-75"
          onClick={() => {
            navigate("/home");
          }}
        >
          <Home className="size-8 shrink-0" />
          <span
            className={` ${
              currentlyOn === "home" ? "font-semibold" : ""
            } text-xl rounded-full select-none   `}
          >
            Home
          </span>
        </div>

        <div
          className="flex justify-start cursor-pointer   gap-4 hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors delay-75"
          onClick={() => {
            navigate("/search");
          }}
        >
          <Search className="size-7 ml-1 shrink-0" />
          <span
            className={` ${
              currentlyOn === "search" ? "font-semibold" : ""
            }   text-xl rounded-full rounded-r-none select-none   `}
          >
            Explore
          </span>
        </div>

        <div
          className={`${
            currentlyOn === "notifications" ? "font-semibold" : ""
          }  flex justify-start cursor-pointer items-center   gap-4 hover:bg-gray-800/50  w-fit p-3 pr-6 rounded-full transition-colors delay-75`}
          onClick={() => {
            navigate("/Notifications");
          }}
        >
          <BellIcon className="size-6 ml-2 shrink-0" />
          <span className=" text-xl rounded-full rounded-r-none select-none   ">
            Notifications
          </span>
        </div>

        <div
          className="flex justify-start cursor-pointer   gap-4 hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors  delay-75"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <UserRound className="size-7 ml-2 shrink-0" />
          <span
            className={`${
              currentlyOn === "profile" ? "font-semibold" : ""
            }  text-xl rounded-full rounded-r-none select-none   `}
          >
            Profile
          </span>
        </div>

        <div
          className={`${
            currentlyOn === "more" ? "font-semibold" : ""
          }  flex justify-start cursor-pointer   gap-4 hover:bg-gray-800/50  w-fit p-3 pr-6 rounded-full transition-colors delay-75`}
          onClick={() => {
            navigate("/search");
          }}
        >
          <CircleEllipsis className="size-7 ml-2 shrink-0" />
          <span className="font-medium text-xl rounded-full rounded-r-none select-none  ">
            More
          </span>
        </div>

        <button
          className="bg-blue-400 rounded-full w-4/5 p-3 mt-1 hover:opacity-90 font-semibold text-lg"
          onClick={() => setCreateDialog(true)}
        >
          Post
        </button>
      </div>
      <div className=" mt-auto flex items-center gap-2 p-2 mx-2 hover:bg-gray-800/50 transition-colors cursor-pointer rounded-full">
        <img
          src={authUser?.profilePic}
          className="bg-white rounded-full h-10 w-10 shrink-0 object-cover"
        />
        <div className="flex flex-col gap-0">
          <span className="font-semibold">{authUser?.username}</span>
          <span className="text-gray-500 text-sm/6 tracking-wide">
            {authUser?.username}
          </span>
        </div>
        <div className=" h-fit w-fit shrink-0 ml-auto mr-1  hidden lg:block ">
          <Ellipsis className="size-5 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;