import { useUnfollowContext } from "@/context/UnfollowContext";
import { useAuthUser } from "@/context/userContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import toast from "react-hot-toast";

const FollowButton = memo(
  ({
    className,
    personId,
    username,
  }: {
    className?: string;
    personId: string;
    username: string;
  }) => {
    const queryClient = useQueryClient();
    const { authUser } = useAuthUser();
    const { setPersonInfo, setUnfollowContext } = useUnfollowContext();
    const isHimself = authUser?._id === personId;
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const { mutate: follow, isPending: pendingFollow } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/follow/${personId}`, {
          method: "POST",
        });
        const data = await res.json();

        if ("error" in data) toast.error(data.error);
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;

        queryClient.invalidateQueries({
          queryKey: [username, "followers"],
        });
        setIsFollowing(true);

        toast.success(data.message);
      },
    });

    const {} = useQuery({
      queryKey: [username, "followers"],
      queryFn: async () => {
        const res = await fetch(
          `/api/getfollowersnumbers?username=${username}`
        );
        const data = await res.json();
        if ("error" in data) toast.error(data.error);
        setIsFollowing(data.includes(authUser?._id));
        return data;
      },

      refetchOnWindowFocus: false,
    });

    const handleClick = () => {
      if (isFollowing) {
        setPersonInfo({ personId: personId, username: username });
        return setUnfollowContext(true);
      }
      follow();
    };

    return (
      <>
        <button
          className={`font-bold relative flex justify-center items-center z-10 group ${
            isHimself ? "hidden" : "flex"
          }  ${
            isFollowing
              ? "bg-transparent  border w-24    xl:text-base text-white hover:bg-red-500/30 hover:text-red-700 hover:border-red-800"
              : "bg-white text-black"
          } text-black w-16 sm:w-20     xl:w-24 h-8 ${className}    rounded-full`}
          disabled={pendingFollow}
          onClick={() => handleClick()}
        >
          <span
            className={`absolute opacity-100 group-hover:opacity-0 ${
              isFollowing ? " text-xs md:text-sm" : ""
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </span>
          <span
            className={`absolute opacity-0   group-hover:opacity-100  ${
              isFollowing ? " text-base" : ""
            }
              `}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </span>
        </button>
      </>
    );
  }
);

export default FollowButton;
