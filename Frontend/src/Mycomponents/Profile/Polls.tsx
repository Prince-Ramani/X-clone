import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";
import { memo, useEffect, useRef, useState } from "react";
import { useDeletePostContext } from "@/context/DeletePostContext";
import Loading from "@/components/ui/Loading";
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
    const offset = useRef<number>(0);
    const {
      hasDeletedAnyPost,
      setHasDeletedAnyPost,
      DeletePostId,
      setDeletePostId,
    } = useDeletePostContext();

    const { isPending, isLoading, isFetching, refetch, data } = useQuery({
      queryKey: [personUsername, "Polls"],
      queryFn: async () => {
        const res = await fetch(
          `/api/post/polls/${profileId}?limit=30&offset=${offset.current}`,
        );

        const data: [] = await res.json();

        if (data.length < 30) setHasMore(false);

        setTotalPosts((prev) => [...prev, ...data]);

        offset.current = offset.current + data?.length;

        return data;
      },
      enabled: isAuthenticated && !!profileId,
      refetchOnWindowFocus: false,
    });

    // useEffect(() => {
    //   if (data && "error" in data) return;
    //   if (data) {
    //     setTotalPosts((prev) => [...prev, ...data]);
    //     offset.current = offset.current + data?.length;
    //   }
    // }, [data]);

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

    useEffect(() => {
      setTotalPosts((prev) =>
        prev.filter((p: PostType) => p._id !== DeletePostId),
      );
      setHasDeletedAnyPost(false);
      setDeletePostId(undefined);
      offset.current = offset.current === 0 ? 0 : offset.current - 1;
    }, [hasDeletedAnyPost, setHasDeletedAnyPost]);

    useEffect(() => {
      return () => {
        setTotalPosts([]);
        offset.current = 0;
      };
    }, []);

    return (
      <div className="min-h-fit relative bottom-10">
        {totalPosts?.map((post: PostType) => (
          <PostDisplayer post={post} authUserId={authUserId} key={post?._id} />
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
  },
);

export default ProfilePost;
