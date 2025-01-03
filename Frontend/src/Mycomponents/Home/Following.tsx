import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";

import { PostType } from "./ForYou";
import { memo, useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

const Following = memo(
  ({ authUserId }: { authUserId: string | null | undefined }) => {
    const [totalPosts, setTotalPosts] = useState([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { isPending, isFetching, isLoading, refetch, data } = useQuery({
      queryKey: ["FollowingPosts"],
      queryFn: async () => {
        const res = await fetch(
          `/api/post/followingposts?limit=30&offset=${offset}`
        );
        const data: [] = await res.json();
        if (data.length < 30) setHasMore(false);
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
      if (data) {
        const totalPostsID = new Set(totalPosts.map((p: PostType) => p._id));

        const FilteredPosts = data.filter((post: PostType) => {
          return !totalPostsID.has(post._id);
        });

        for (let i = FilteredPosts.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));

          [FilteredPosts[i], FilteredPosts[randomIndex]] = [
            FilteredPosts[randomIndex],
            FilteredPosts[i],
          ];
        }

        setTotalPosts((prev) => [...prev, ...FilteredPosts]);
        setOffset((prev) => prev + data.length);
      }
    }, [data]);

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isFetching]);

    useEffect(() => {
      if (data) {
        setOffset((prev) => prev + data.length);

        setTotalPosts((prev) => [...prev, ...data]);
      }
    }, [data]);

    useEffect(() => {
      return () => {
        setTotalPosts(() => []);
        setOffset(() => 0);
        setHasMore(() => true);
      };
    }, []);

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
  }
);

export default Following;
