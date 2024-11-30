import CustomTooltip from "@/customComponents/ToolTip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { PostType } from "../Home/ForYou";
import {
  ArrowLeft,
  LucideCalendarRange,
  MapPin,
  MoreHorizontal,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import PostDisplayer from "../Home/PostDisplayer";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useState } from "react";

const Profile = () => {
  const { username: personUsername } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const userId = authUser?._id;
  if (!userId) return;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: [personUsername, "Profile"],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${personUsername}`);
      const data = await res.json();

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: posts } = useQuery({
    queryKey: [personUsername, "Posts"],
    queryFn: async () => {
      const res = await fetch(`/api/post/profile/${profile?._id}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);

      return data;
    },
    enabled: !!profile,
    refetchOnWindowFocus: false,
  });

  const { data: followers } = useQuery({
    queryKey: [personUsername, "followers"],
    queryFn: async () => {
      const res = await fetch(
        `/api/getfollowersnumbers?username=${personUsername}`
      );
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      setIsFollowing(data.includes(userId));
      return data;
    },

    refetchOnWindowFocus: false,
  });

  const { mutate: follow, isPending: pendingFollow } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/follow/${profile._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;

      queryClient.invalidateQueries({
        queryKey: [personUsername, "followers"],
      });

      toast.success(data.message);
    },
  });

  return (
    <div className="border border-b-0 border-gray-800 min-h-full  cursor-pointer">
      <div className=" pb-1  px-4   flex  items-center backdrop-blur-lg bg-black/70  sticky top-0 gap-5 z-50 ">
        <CustomTooltip title="Back">
          <div
            className="h-fit w-fit p-2 hover:bg-gray-500/20 rounded-full"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-5 " />
          </div>
        </CustomTooltip>
        <div className="flex flex-col ">
          <span className="font-bold text-lg tracking-wider">
            {profile?.username}
          </span>
          <span className="text-xs text-gray-400">
            {posts?.length || 0} posts
          </span>
        </div>
      </div>

      <div className="h-40  md:h-44 w-full   ">
        <a href={profile?.banner} target="_blank">
          <img src={profile?.banner} className="h-full w-full" />
        </a>
      </div>

      <div className="relative   p-1 md:p-2 bg-black h-fit w-fit rounded-full bottom-10 left-3 sm:bottom-14 sm:left-4  md:bottom-16 md:left-5">
        <a href={profile?.profilePic} target="_blank">
          <img
            src={profile?.profilePic}
            className=" size-20 sm:size-24 md:size-32 rounded-full object-cover "
          />
        </a>
      </div>
      <div className=" relative bottom-20  sm:bottom-24 md:bottom-32  flex items-center justify-end gap-3 md:gap-4 px-4  ">
        <CustomTooltip title="More">
          <button className="size-8 border border-white/70 hover:bg-white/20 rounded-full active:bg-white/40 flex justify-center items-center">
            <MoreHorizontal className="size-5" />
          </button>
        </CustomTooltip>
        <CustomTooltip title="Search">
          <button className="size-8 border  border-white/70 hover:bg-white/20 active:bg-white/40  rounded-full  flex justify-center items-center">
            <Search className="size-4 m-1 " />
          </button>
        </CustomTooltip>
        <button
          className={`font-bold relative flex justify-center items-center group  ${
            isFollowing
              ? "bg-transparent  border w-24 text-sm text-white hover:bg-red-900/50 hover:text-red-700 hover:border-red-800"
              : "bg-white text-black"
          } text-black w-20 h-8    rounded-full`}
          disabled={pendingFollow}
          onClick={() => follow()}
        >
          <span className={`absolute opacity-100 group-hover:opacity-0 `}>
            {isFollowing ? "Following" : "Follow"}
          </span>
          <span className={`absolute opacity-0  group-hover:opacity-100 `}>
            {isFollowing ? "Unfollow" : "Follow"}
          </span>
        </button>
      </div>

      <div className="p-2 px-5 relative bottom-20 md:bottom-20 ">
        <div className="font-bold text-xl "> {profile?.username}</div>
        <div className="text-gray-400/80">@{profile?.username}</div>
      </div>

      <div className="  relative bottom-16 md:bottom-20  px-2 md:px-4 flex flex-col gap-2">
        web dev for rest of us
        <div className="flex  items-center gap-2 text-gray-400/70 text-xs 2xl:text-sm ">
          <MapPin className="size-4" />
          {profile?.location || "India"}
          <LucideCalendarRange className="size-4" /> Joined{" "}
          {profile ? format(profile?.createdAt, "MMMM yyyy") : ""}
        </div>
        <div className=" px-1 mt-2 flex  gap-4 text-sm ">
          <div
            className="flex gap-1 hover:border-b"
            onClick={() => navigate(`/profile/${personUsername}/following`)}
          >
            <span className="font-bold">{profile?.following.length}</span>
            <span className="text-gray-400/70">Following</span>
          </div>
          <div
            className="flex gap-1 hover:border-b"
            onClick={() => navigate(`/profile/${personUsername}/followers`)}
          >
            <span className="font-bold">{followers?.length}</span>
            <span className="text-gray-400/70">Followers</span>
          </div>
        </div>
      </div>

      <div className="font-semibold relative bottom-12  tracking-wide flex border-b border-gray-800 text-gray-400/70 select-none    ">
        <div className="w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1  ">
          <div className="p-1 pt-2">Posts</div>
          <div className="border-2 border-blue-400 w-16 rounded-full" />
        </div>
        <div className="w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1 ">
          <div className="p-1 pt-2">Replies</div>
          <div className="border-2 border-blue-400 w-16 rounded-full" />
        </div>
        <div className="w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1 ">
          <div className="p-1 pt-2"> Media</div>
          <div className="border-2 border-blue-400 w-16 rounded-full" />
        </div>
      </div>

      <div className="min-h-screen relative bottom-10">
        {posts?.map((post: PostType) => (
          <PostDisplayer
            post={post}
            authUserId={authUser?._id}
            key={post._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
