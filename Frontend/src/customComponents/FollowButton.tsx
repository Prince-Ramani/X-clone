import { useAuthUser } from "@/context/userContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        setIsFollowing((prev) => !prev);

        toast.success(data.message);
      },
    });

    return (
      <>
        <button
          className={`font-bold relative flex justify-center items-center z-10 group ${
            isHimself ? "hidden" : "flex"
          }  ${
            isFollowing
              ? "bg-transparent  border w-24 text-sm text-white hover:bg-red-500/30 hover:text-red-700 hover:border-red-800"
              : "bg-white text-black"
          } text-black w-20 h-8 ${className}    rounded-full`}
          disabled={pendingFollow}
          onClick={() => follow()}
        >
          <span className={`absolute opacity-100 group-hover:opacity-0 `}>
            {isFollowing ? "Following" : "Follow"}
          </span>
          <span className={`absolute opacity-0  group-hover:opacity-100 `}>
            {isFollowing ? "Unfollow" : "Follow"}
          </span>
        </button>
      </>
    );
  }
);

export default FollowButton;
