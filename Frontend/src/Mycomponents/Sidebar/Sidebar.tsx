import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreatePostContext } from "@/context/createPostContext";
import { useAuthUser } from "@/context/userContext";
import { useMutation } from "@tanstack/react-query";

import {
  BellIcon,
  Bookmark,
  CircleEllipsis,
  Earth,
  Ellipsis,
  LucideHome,
  Search,
  X,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { setCreateDialog } = useCreatePostContext();

  const [currentlyOn, setCurrentlyOn] = useState<any>();

  const { authUser, setAuthUser } = useAuthUser();

  useEffect(() => {
    let loc = location.pathname.split("/")[1];

    if (!loc) setCurrentlyOn("home");
    else setCurrentlyOn(location.pathname.split("/")[1]);
  }, [location, navigate]);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      else {
        toast.success(data.message);
        navigate("/sign-up");
        setAuthUser(null);
      }
      return data;
    },
  });

  return (
    <div className=" md:w-3/12 lg:w-3/12 xl:w-2/12 max-h-screen   sticky top-0    py-2    hidden md:flex flex-col    ">
      <X className="size-8 ml-3 " />

      <div className="flex flex-col py-5 gap-y-1 ">
        <div className="group w-full cursor-pointer ">
          <div
            className="flex justify-start   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors "
            onClick={() => {
              navigate("/");
            }}
          >
            <LucideHome className={`size-8 shrink-0 `} />
            <span
              className={` ${
                currentlyOn === "home" ? "font-bold" : ""
              } text-xl rounded-full select-none   `}
            >
              Home
            </span>
          </div>
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className="flex justify-start cursor-pointer   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors "
            onClick={() => {
              navigate("/search");
            }}
          >
            <Search className={`size-7  ml-1 shrink-0 `} />
            <span
              className={` ${
                currentlyOn === "search" ? "font-semibold" : ""
              }   text-xl rounded-full rounded-r-none select-none   `}
            >
              Explore
            </span>
          </div>
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className={`${
              currentlyOn === "notifications" ? "font-semibold" : ""
            }  flex justify-start cursor-pointer items-center   gap-4 group-hover:bg-gray-800/50  w-fit p-3   rounded-full transition-colors `}
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <BellIcon
              className={`size-6 ml-2 shrink-0   ${
                currentlyOn === "notifications" ? "fill-white" : ""
              } `}
            />
            <span className=" text-xl rounded-full rounded-r-none select-none   ">
              Notifications
            </span>
          </div>
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className="flex justify-start cursor-pointer   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors  "
            onClick={() => {
              navigate(`/profile/${authUser?.username}`);
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
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className="flex justify-start cursor-pointer   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors  "
            onClick={() => {
              navigate(`/bookmarks`);
            }}
          >
            <Bookmark
              className={`size-7 ml-2 shrink-0 ${
                currentlyOn === "bookmarks" ? "fill-white" : ""
              }`}
            />
            <span
              className={`${
                currentlyOn === "bookmarks" ? "font-semibold " : ""
              }  text-xl rounded-full rounded-r-none select-none   `}
            >
              Bookmarks
            </span>
          </div>
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className="flex justify-start  cursor-pointer   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-5 rounded-full transition-colors  "
            onClick={() => {
              navigate(`/connect_people`);
            }}
          >
            <Earth className="size-7 ml-2 shrink-0" />
            <span
              className={`${
                currentlyOn === "connect_people" ? "font-semibold" : ""
              }  text-xl rounded-full rounded-r-none select-none   `}
            >
              Suggestions
            </span>
          </div>
        </div>

        <div className="group w-full cursor-pointer ">
          <div
            className={`${
              currentlyOn === "more" ? "font-semibold" : ""
            }  flex justify-start cursor-pointer   gap-4 group-hover:bg-gray-800/50  w-fit p-3 pr-6 rounded-full transition-colors `}
            onClick={() => {
              navigate("/search");
            }}
          >
            <CircleEllipsis className="size-7 ml-2 shrink-0" />
            <span className="font-medium text-xl rounded-full rounded-r-none select-none  ">
              More
            </span>
          </div>
        </div>

        <button
          className="bg-blue-400 rounded-full w-4/5 p-3 mt-1 hover:opacity-90 font-semibold text-lg"
          onClick={() => setCreateDialog(true)}
        >
          Post
        </button>
      </div>

      <Popover>
        <PopoverTrigger className="  mt-auto ">
          <div className=" mt-auto flex items-center  gap-2 p-2 mx-2 group-hover:bg-gray-800/50 transition-colors cursor-pointer rounded-full">
            <img
              src={authUser?.profilePic}
              className="bg-white rounded-full h-10 w-10 shrink-0 object-cover"
            />
            <div className="flex flex-col gap-0 ">
              <span className="font-semibold">{authUser?.username}</span>
              <span className="text-gray-500 text-sm/6 tracking-wide">
                {authUser?.username}
              </span>
            </div>
            <div className=" h-fit w-fit shrink-0 ml-auto mr-1  hidden lg:block ">
              <Ellipsis className="size-5 shrink-0" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black text-white p-0 border-none shadow-sm   ring-1 shadow-white">
          <div
            className="font-bold hover:bg-white/10 p-4 cursor-pointer active:bg-red-600/50 rounded-md select-none"
            onClick={() => logout()}
          >
            Logout
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Sidebar;
