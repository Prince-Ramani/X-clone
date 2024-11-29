import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadedByType } from "../Home/ForYou";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ListItem = ({
  follower,
  isUserAlreadyFollowing,
  isUserHimself,
}: {
  follower: UploadedByType;
  isUserAlreadyFollowing: boolean;
  isUserHimself: boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(isUserAlreadyFollowing);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: follow, isPending: pendingFollow } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/follow/${follower._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;

      queryClient.invalidateQueries({
        queryKey: [follower.username, "followers"],
      });

      setIsFollowing((prev) => !prev);

      toast.success(data.message);
    },
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    follow();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${follower.username}`);
  };

  return (
    <div
      className="flex gap-2 break-all active:bg-gray-500/20 p-2 py-4 "
      onClick={() => navigate(`/profile/${follower.username}`)}
    >
      <img
        src={follower.profilePic}
        className="size-12 shrink-0 object-cover rounded-full"
      />
      <div className=" leading-snug">
        <div
          className="font-semibold tracking-wide hover:underline decoration-white/90 decoration-[1px]"
          onClick={handleProfileClick}
        >
          {follower.username}
        </div>
        <div className="text-gray-400/70 tracking-tighter ">
          @{follower.username}
        </div>
        <div className="text-sm pt-1 ">
          {follower.bio ||
            "HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello"}
        </div>
      </div>
      <div>
        {!isUserHimself ? (
          <button
            className={` font-bold relative flex justify-center items-center group  ${
              isFollowing
                ? "bg-transparent  border w-24 text-sm text-white hover:bg-red-900/50 hover:text-red-700 hover:border-red-800"
                : "bg-white text-black"
            } text-black w-20 h-8    rounded-full`}
            disabled={pendingFollow}
            onClick={handleButtonClick}
          >
            {" "}
            <span className={`absolute opacity-100 group-hover:opacity-0   `}>
              {isFollowing ? "Following" : "Follow"}
            </span>
            <span className={`absolute opacity-0  group-hover:opacity-100   `}>
              {isFollowing ? "Unfollow" : "Follow"}
            </span>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ListItem;
