import { useQuery } from "@tanstack/react-query";
import PostDisplayer from "./PostDisplayer";

export interface PostType {
  _id: string;
  postContent: string;
  uploadedPhoto: string;
  comments: any[];
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

const ForYou = () => {
  const { data: posts } = useQuery({
    queryKey: ["ForYouPosts"],
    queryFn: async () => {
      const res = await fetch("/api/post/getallpost?limit=10&offset=0");
      const data = await res.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      {posts?.map((post: PostType) => (
        <PostDisplayer key={post._id} post={post} />
      ))}
    </div>
  );
};

export default ForYou;
