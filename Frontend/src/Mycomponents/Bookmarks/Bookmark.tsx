import Loading from "@/components/ui/Loading";
import { useAuthUser } from "@/context/userContext";
import Bar from "@/customComponents/Bar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";

const Bookmark = () => {
  const [totalPosts, setTotalPosts] = useState([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const offset = useRef<number>(0);

  const { authUser } = useAuthUser();
  const { isLoading, isFetching, isPending, refetch } = useQuery({
    queryKey: [authUser?.username, "Bookmarks"],
    queryFn: async () => {
      const res = await fetch(
        `/api/getbookmarks?limit=30&offset=${offset.current}`
      );
      const data: [] = await res.json();
      if (data.length < 30) setHasMore(false);
      setTotalPosts((prev) => [...prev, ...data]);
      offset.current = offset.current + data?.length;

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !isFetching) refetch();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching]);

  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0 ">
      <Bar title="Bookmarks" />
      <div className="border-b border-gray-400/20" />

      {totalPosts?.map((post: PostType) => (
        <PostDisplayer post={post} authUserId={authUser?._id} key={post?._id} />
      ))}

      {isPending || isLoading || isFetching ? (
        <div className="  flex justify-center items-center p-2 ">
          <Loading />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Bookmark;
