import { useState } from "react";

import { NotificationsType } from "@/lib/Types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthUser } from "@/context/userContext";

const FollowRequest = ({
  notification,
}: {
  notification: NotificationsType;
}) => {
  const [topicChanged, setTopicChanged] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { authUser } = useAuthUser();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { mutate: follow, isPending: pendingFollow } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/follow/${notification.from._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;

      queryClient.invalidateQueries({
        queryKey: [notification.from.username, "followers"],
      });

      toast.success(data.message);
    },
  });

  const {} = useQuery({
    queryKey: [notification.from.username, "followers"],
    queryFn: async () => {
      const res = await fetch(
        `/api/getfollowersnumbers?username=${notification.from.username}`
      );
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      setIsFollowing(data.includes(authUser?._id));

      return data;
    },

    refetchOnWindowFocus: true,
  });

  const { mutate: acceptReq, isPending: pendingAccept } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/acceptrequest?persontofollow=${notification._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if ("error" in data) toast.error(data.error);

      if ("message" in data && data.message === "Follow request accepted!")
        setTopicChanged(true);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;

      toast.success(data.message);
    },
  });

  const navigate = useNavigate();

  const handleClick = (e: any) => {
    if (e.target.tagName !== "DIV") return;
    navigate(`/profile/${notification.from.username}`);
  };

  return (
    <>
      <div
        className="p-2 py-3 border-b border-gray-600/80 "
        onClick={(e: any) => handleClick(e)}
      >
        <div className="flex gap-2 items-center ">
          <img
            src={notification.from.profilePic}
            className="size-10 rounded-full object-cover shrink-0"
            onClick={() => navigate(`/profile/${notification.from.username}`)}
          />
          {notification.topic === "followRequest" && !topicChanged ? (
            <div className=" w-full flex items-center justify-between">
              <div className="text-xs sm:text-sm">
                <span
                  className="font-bold hover:underline text-blue-400"
                  onClick={() =>
                    navigate(`/profile/${notification.from.username}`)
                  }
                >
                  {notification.from.username}
                </span>{" "}
                requested to follow you!
              </div>

              <button
                className={`font-semibold tracking-wide  relative  flex hover:opacity-90 justify-center items-center group mr-3 bg-blue-500   w-20 h-8    rounded-full`}
                disabled={pendingAccept}
                onClick={() => acceptReq()}
              >
                <span className={`absolute opacity-100   `}>Accept</span>
              </button>
            </div>
          ) : (
            <div className=" w-full flex items-center justify-between">
              <div className="text-xs sm:text-sm">
                <span
                  className="font-bold hover:underline text-blue-400"
                  onClick={() =>
                    navigate(`/profile/${notification.from.username}`)
                  }
                >
                  {notification.from.username}
                </span>{" "}
                started following you!
              </div>

              <button
                className={`font-bold  relative  flex justify-center items-center group mr-3   ${
                  isFollowing
                    ? "bg-transparent   border w-24 text-sm text-white hover:bg-red-500/30 hover:text-red-700 hover:border-red-800"
                    : "bg-white text-black"
                } text-black w-20 h-8    rounded-full`}
                disabled={pendingFollow}
                onClick={() => follow()}
              >
                <span className={`absolute opacity-100 group-hover:opacity-0 `}>
                  {isFollowing ? "Following" : "Follow"}
                </span>
                <span
                  className={`absolute opacity-0  group-hover:opacity-100 `}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </span>
              </button>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
};

export default FollowRequest;