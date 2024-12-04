import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PostType } from "../Home/ForYou";
import PostDisplayer from "../Home/PostDisplayer";
import { memo, useEffect, useRef, useState } from "react";
import { useDeletePostContext } from "@/context/DeletePostContext";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
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

    const { isPending, isLoading, isFetching, refetch } = useQuery({
      queryKey: [personUsername, "Media"],
      queryFn: async () => {
        const res = await fetch(
          `/api/profile/media/${profileId}?limit=30&offset=${offset.current}`
        );
        const data: [] = await res.json();

        if ("error" in data) toast.error("Something went wrong");

        if (data.length < 30) setHasMore(false);

        setTotalPosts((prev) => [...prev, ...data]);
        offset.current = offset.current + data?.length;

        return data;
      },
      enabled: isAuthenticated && !!profileId,
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

    useEffect(() => {
      setTotalPosts((prev) =>
        prev.filter((p: PostType) => p._id !== DeletePostId)
      );
      setHasDeletedAnyPost(false);
      setDeletePostId(undefined);
      offset.current = offset.current - 1;
    }, [hasDeletedAnyPost, setHasDeletedAnyPost]);

    return (
      <div className="min-h-fit relative bottom-10">
        {totalPosts?.map((post: PostType) => (
          <PostDisplayer post={post} authUserId={authUserId} key={post?._id} />
        ))}

        {!isFetching && totalPosts.length === 0 ? (
          <div className="text-center">
            {personUsername} haven't uploaded any media!
          </div>
        ) : (
          ""
        )}

        {isPending || isLoading || isFetching ? (
          <div className="  flex justify-center items-center p-2 ">
            <Loading />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default ProfilePost;
