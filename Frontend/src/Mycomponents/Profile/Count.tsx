import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Count = memo(
  ({
    personUsername,
    followingLength,
  }: {
    personUsername: string;
    followingLength: number;
  }) => {
    const navigate = useNavigate();
    const [hasPendingRequest, setHasPendingRequest] = useState<boolean>(false);

    const { data: followers } = useQuery({
      queryKey: [personUsername, "followers"],
      queryFn: async () => {
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
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (followers) {
        const hasObj = followers.some(
          (item: string | object) =>
            typeof item === "object" &&
            item !== null &&
            "pendingRequest" in item
        );
        if (hasObj) {
          setHasPendingRequest(true);
        } else {
          if (setHasPendingRequest) setHasPendingRequest(false);
        }
      }
    }, [followers]);

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
          <span className="font-bold">
            {followers && hasPendingRequest
              ? followers.length - 1
              : followers
              ? followers.length
              : 0}
          </span>
          <span className="text-gray-400/70">Followers</span>
        </div>
      </div>
    );
  }
);

export default Count;
