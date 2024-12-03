import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";
import { memo } from "react";
import PostSkeleton from "@/customComponents/PostSkeleton";
const LikedPosts = memo(
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
      data: LikedPostsArr,
      isPending,
      isLoading,
      isFetching,
    } = useQuery({
      queryKey: [personUsername, "LikedPosts"],
      queryFn: async () => {
        const res = await fetch(`/api/post/likedposts/${profileId}`);
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
        <div className="flex justify-center items-center border-b pb-1 gap-1 text-lg border-gray-800  ">
          Posts liked by{" "}
          <span className="font-bold tracking-wider text-pink-600">
            {personUsername}
          </span>
        </div>

        {isPending || isLoading || isFetching
          ? [...Array(5)].map((_, index) => (
              <PostSkeleton className="top-1" key={index} />
            ))
          : LikedPostsArr?.map((post: PostType) => (
              <PostDisplayer
                post={post}
                authUserId={authUserId}
                key={post?._id}
              />
            ))}
      </div>
    );
  }
);

export default LikedPosts;
