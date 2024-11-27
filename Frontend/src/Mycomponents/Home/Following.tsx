import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";

import { PostType } from "./ForYou";

const Following = ({
  authUserId,
}: {
  authUserId: string | null | undefined;
}) => {
  const { data: posts } = useQuery({
    queryKey: ["ForYouPosts"],
    queryFn: async () => {
      const res = await fetch("/api/post/followingposts?limit=10&offset=0");
      const data = await res.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      {posts?.map((post: PostType) => (
        <PostDisplayer key={post._id} post={post} authUserId={authUserId} />
      ))}
    </div>
  );
};

export default Following;
