import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";

export interface PostType {
  _id: string;
  postContent: string;
  uploadedPhoto: string;
  comments: any[] | number;
  likes: any[];
  uploadedBy: UploadedByType;
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
}

const ForYou = ({ authUserId }: { authUserId: string | null | undefined }) => {
  const { data: posts } = useQuery({
    queryKey: ["ForYouPosts"],
    queryFn: async () => {
      const res = await fetch("/api/post/getallpost?limit=30&offset=0");
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

export default ForYou;
