import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";

const Media = memo(
  ({
    isAuthenticated,
    authUserId,
    profileId,
  }: {
    isAuthenticated: boolean;
    authUserId: string;
    profileId: string;
  }) => {
    const { username: personUsername } = useParams();

    const {
      data: mediaPosts,
      isPending,
      isLoading,
    } = useQuery({
      queryKey: [personUsername, "Media"],
      queryFn: async () => {
        const res = await fetch(`/api/profile/media/${profileId}`);
        const data = await res.json();
        if ("error" in data) toast.error(data.error);
        console.log(data);
        return data;
      },
      enabled: isAuthenticated && !!profileId,
      refetchOnWindowFocus: false,
    });

    return (
      <div className="min-h-fit relative bottom-10">
        {" "}
        {mediaPosts?.map((post: PostType) => (
          <PostDisplayer post={post} authUserId={authUserId} key={post?._id} />
        ))}
        {(!isPending || isLoading) && mediaPosts?.length === 0 ? (
          <div className="text-center">
            {personUsername} haven't uploaded any Media!
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default Media;
