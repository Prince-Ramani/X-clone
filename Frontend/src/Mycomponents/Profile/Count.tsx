import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Count = memo(
  ({
    personUsername,
    followingLength,
    isBlocked,
    hasError,
    profile,
  }: {
    personUsername: string;
    followingLength: number;
    isBlocked: boolean;
    hasError: boolean;
    profile: boolean;
  }) => {
    const navigate = useNavigate();

    const { data: followers } = useQuery({
      queryKey: [personUsername, "followers"],
      queryFn: async () => {
        if (hasError || isBlocked) return null;
        const res = await fetch(
          `/api/getfollowersnumbers?username=${personUsername}`
        );
        const data = await res.json();

        if ("error" in data) {
          toast.error(data.error);
          return null;
        }
        return data;
      },
      enabled: !!profile,
      refetchOnWindowFocus: false,
    });

    return (
      <div className=" px-1 mt-2 flex  gap-4 text-sm">
        <div
          className="flex gap-1 hover:border-b"
          onClick={() => navigate(`/profile/${personUsername}/following`)}
        >
          <span className="font-bold">{followingLength || 0}</span>
          <span className="text-gray-400/70">Following</span>
        </div>
        <div
          className="flex gap-1 hover:border-b"
          onClick={() => navigate(`/profile/${personUsername}/followers`)}
        >
          <span className="font-bold">{followers?.length || 0}</span>
          <span className="text-gray-400/70">Followers</span>
        </div>
      </div>
    );
  }
);

export default Count;
