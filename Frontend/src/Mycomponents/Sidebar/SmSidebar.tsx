import { useAuthUser } from "@/context/userContext";
import CustomTooltip from "@/customComponents/ToolTip";
import { Bell, Bookmark, Earth, Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MdSidebar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [currentlyOn, setCurrentlyOn] = useState<any>();

  const { authUser } = useAuthUser();

  useEffect(() => {
    let loc = location.pathname.split("/")[1];

    if (!loc) setCurrentlyOn("home");
    else setCurrentlyOn(location.pathname.split("/")[1]);
  }, [location, navigate]);

  return (
    <div className="border-t border-gray-400/50 p-2 md:hidden  fixed bottom-0 w-full bg-black z-[50] ">
      <div className={` flex justify-around items-center `}>
        <div
          className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
          onClick={() => navigate("/")}
        >
          <CustomTooltip title="Home">
            <Home
              className={`size-8  rounded-md     ${
                currentlyOn === "home" ? "text-blue-400" : ""
              } `}
            />
          </CustomTooltip>
        </div>

        <div
          className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
          onClick={() => navigate("/search")}
        >
          <CustomTooltip title="Search">
            <Search
              className={`size-8  rounded-md     ${
                currentlyOn === "search" ? "text-blue-400" : ""
              } `}
            />
          </CustomTooltip>
        </div>

        <div
          className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
          onClick={() => navigate("/notifications")}
        >
          <CustomTooltip title="Notifications">
            <Bell
              className={`size-8  rounded-md     ${
                currentlyOn === "notifications" ? "text-blue-400" : ""
              } `}
            />
          </CustomTooltip>
        </div>

        <div
          className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
          onClick={() => navigate("/bookmarks")}
        >
          <CustomTooltip title="Bookmarks">
            <Bookmark
              className={`size-8  rounded-md     ${
                currentlyOn === "bookmarks" ? "text-blue-400" : ""
              } `}
            />
          </CustomTooltip>
        </div>

        <div
          className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
          onClick={() => navigate("/connect_people")}
        >
          <CustomTooltip title="Suggestions">
            <Earth
              className={`size-8  rounded-md     ${
                currentlyOn === "connect_people" ? "text-blue-400" : ""
              } `}
            />
          </CustomTooltip>
        </div>

        <div
          className={` hover:bg-white/20 rounded-full   cursor-pointer   `}
          onClick={() => {
            navigate(`settings`);
          }}
        >
          <CustomTooltip title="Profile">
            <img
              src={authUser?.profilePic}
              alt="ProfilePic"
              className={`size-10  object-cover rounded-full border-2  ${
                currentlyOn === "settings"
                  ? "text-blue-400   "
                  : " border-transparent"
              } `}
            />
          </CustomTooltip>
        </div>
      </div>
    </div>
  );
};

export default MdSidebar;
