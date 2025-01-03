import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";
import { memo, useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

export interface PostType {
  _id: string;
  postContent: string;
  uploadedPhoto: string[];
  uploadedVideo?: string;
  comments: any[] | number;
  likes: any[];
  uploadedBy: UploadedByType;
  bookmarkedBy?: any[];
  createdAt: string;
  updatedAt: string;
  explanation?: string;
  type: "poll" | "post";
  options?: string[];
  explanationImage?: string;
  answeredBy?: {
    userAnswered: string;
    optionSelected: number;
  } | null;
  totalVotes?: number;
  arr?: number[];
}

export interface UploadedByType {
  banner: string;
  bio: string | undefined;
  createdAt: string;
  updatedAt: string;
  email: string;
  followers: any[];
  following: any[];
  links: any[];
  profilePic: string;
  username: string;
  _id: string;
  location?: string;
}

const ForYou = memo(
  ({ authUserId }: { authUserId: string | null | undefined }) => {
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalPosts, setTotalPosts] = useState([]);
    const [offset, setOffset] = useState<number>(0);
    const { isPending, isLoading, isFetching, refetch, data } = useQuery({
      queryKey: ["ForYouPosts"],
      queryFn: async () => {
        const res = await fetch(
          `/api/post/getallpost?limit=30&offset=${offset}`
        );
        const data: [] = await res.json();
        if (data.length < 30) setHasMore(false);

        return data;
      },
      refetchOnWindowFocus: false,
      enabled: hasMore,
    });

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        hasMore &&
        (!isPending || !isLoading || !isFetching)
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

export default ForYou;
