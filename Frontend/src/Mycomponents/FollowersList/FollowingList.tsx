import CustomTooltip from "@/customComponents/ToolTip";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ListItem from "./ListItem";
import { UploadedByType } from "../Home/ForYou";
import { useAuthUser } from "@/context/userContext";
import PrivateAccount from "./PrivateAccount";

const FollowingList = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const { data: userExists } = useQuery({
    queryKey: [username, "sync"],
    queryFn: async () => {
      const res = await fetch(`/api/userexists/${username}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);

      return data;
    },
    enabled: !!username,
  });

  const { data: followers } = useQuery({
    queryKey: [username, "Following"],
    queryFn: async () => {
      const res = await fetch(
        `/api/getfollowingbyusername?username=${username}`
      );
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);
      return data;
    },
    enabled: !!username && !!userExists,
  });

  return (
    <div className="cursor-pointer min-h-full min-w-full border border-gray-800 border-b-0 border-t-0">
      <div className=" pb-1  px-4   flex  items-center backdrop-blur-lg bg-black/70  sticky top-0 gap-5 z-50 ">
        <CustomTooltip title="Back">
          <div
            className="h-fit w-fit p-2 hover:bg-gray-500/20 rounded-full"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-5 " />
          </div>
        </CustomTooltip>
        <div className="flex flex-col ">
          {!!userExists ? (
            <>
              <span className="font-bold text-lg tracking-wider ">
                {userExists.username}
              </span>
              <span className="text-xs text-gray-400">
                @ {userExists.username}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400">User not found</span>
          )}
        </div>
      </div>
      <div className=" flex border-b border-gray-600/60 ">
        <div
          className="w-1/2 flex flex-col justify-between  items-center p-2   pb-0   hover:bg-gray-600/30  "
          onClick={() => navigate(`/profile/${userExists.username}/followers`)}
        >
          <div className="flex justify-between  items-center flex-col min-h-full  gap-2">
            <span className="text-gray-400/70">Followers</span>
            <div className="relative bottom-0 w-24 "></div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-between  items-center p-2 pb-0   hover:bg-gray-600/30 ">
          <div className="flex justify-between items-center flex-col min-h-full gap-2">
            <span className="font-bold">Following</span>
            <div className=" relative bottom-0 w-24 rounded-full border-2 border-blue-400 "></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  ">
        {followers?.length > 0 && !("message" in followers)
          ? followers.map((follower: UploadedByType) => (
              <ListItem
                key={follower._id}
                follower={follower}
                isUserAlreadyFollowing={follower.followers.includes(
                  authUser?._id
                )}
                isUserHimself={follower._id === authUser?._id}
              />
            ))
          : ""}

        {followers?.length === 0 && !("message" in followers) ? (
          <div className="text-center text-gray-400">Not following anyone.</div>
        ) : (
          ""
        )}

        {followers && "message" in followers ? <PrivateAccount /> : ""}
      </div>
    </div>
  );
};

export default FollowingList;
