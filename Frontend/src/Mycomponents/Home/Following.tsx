import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";

import { PostType } from "./ForYou";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

const Following = ({
  authUserId,
}: {
  authUserId: string | null | undefined;
}) => {
  const [totalPosts, setTotalPosts] = useState([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { isPending, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["FollowingPosts"],
    queryFn: async () => {
      const res = await fetch(
        `/api/post/followingposts?limit=30&offset=${offset}`
      );
      const data: [] = await res.json();
      if (data.length < 30) setHasMore(false);
      setOffset((prev) => prev + 30);
      setTotalPosts((prev) => [...prev, ...data]);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      hasMore &&
      (!isPending || !isFetching || isLoading)
    ) {
      refetch();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching]);

  return (
    <div>
      {totalPosts?.map((post: PostType) => (
        <PostDisplayer key={post._id} post={post} authUserId={authUserId} />
      ))}
      {isPending || isLoading || isFetching ? (
        <div className="flex justify-center items-center p-2 h-full">
          <Loading />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Following;
