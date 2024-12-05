import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";
import { useEffect, useState } from "react";

export interface PostType {
  _id: string;
  postContent: string;
  uploadedPhoto: string;
  comments: any[] | number;
  likes: any[];
  uploadedBy: UploadedByType;
  bookmarkedBy?: any[];
  createdAt: string;
  updatedAt: string;
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

const ForYou = ({ authUserId }: { authUserId: string | null | undefined }) => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPosts, setTotalPosts] = useState([]);
  const [offset, setOffset] = useState<number>(0);
  const { isPending, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["ForYouPosts"],
    queryFn: async () => {
      const res = await fetch(`/api/post/getallpost?limit=30&offset=${offset}`);
      const data: [] = await res.json();
      if (data.length < 30) setHasMore(false);
      setTotalPosts((prev) => [...prev, ...data]);
      setOffset((prev) => prev + data.length);
      return data;
    },
    refetchOnWindowFocus: false,
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
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching]);

  return (
    <div>
      {totalPosts?.map((post: PostType) => (
        <PostDisplayer key={post._id} post={post} authUserId={authUserId} />
      ))}
    </div>
  );
};

export default ForYou;
