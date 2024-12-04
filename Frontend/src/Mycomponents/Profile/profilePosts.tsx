import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";
import { memo, useEffect, useState } from "react";
import PostSkeleton from "@/customComponents/PostSkeleton";
const ProfilePost = memo(
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

    const [totalPosts, setTotalPosts] = useState([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);

    const { isPending, isLoading, isFetching, refetch } = useQuery({
      queryKey: [personUsername, "Posts"],
      queryFn: async () => {
        const res = await fetch(
          `/api/post/profile/${profileId}?limit=30&offset=${offset}`
        );
        const data: [] = await res.json();

        if (data.length < 30) setHasMore(false);

        setTotalPosts((prev) => [...prev, ...data]);
        setOffset((prev) => prev + data.length);

        return data;
      },
      enabled: isAuthenticated && !!profileId,
      refetchOnWindowFocus: false,
    });

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        hasMore &&
        (!isPending || !isFetching || !isLoading)
      ) {
        refetch();
      }
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isFetching]);

    return (
      <div className="min-h-fit relative bottom-10">
        {isPending || isLoading || isFetching
          ? [...Array(5)].map((_, index) => (
              <PostSkeleton className="top-1" key={index} />
            ))
          : totalPosts?.map((post: PostType, index) => (
              <PostDisplayer
                post={post}
                authUserId={authUserId}
                key={(post?._id, index)}
              />
            ))}
      </div>
    );
  }
);

export default ProfilePost;
