import CustomTooltip from "@/customComponents/ToolTip";
import { useQuery } from "@tanstack/react-query";

import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username: personUsername } = useParams();

  const { data: profile } = useQuery({
    queryKey: [personUsername, "Profile"],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${personUsername}`);
      const data = await res.json();
      console.log(data);
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: [personUsername, "Posts"],
    queryFn: async () => {
      const res = await fetch(`/api/post/profile/${profile?._id}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      return data;
    },
    enabled: !!profile,
  });

  return (
    <div className="border border-gray-800 min-h-full ">
      <div className="  p-3 flex  items-center backdrop-blur-lg bg-black/70  sticky top-0 gap-8 ">
        <CustomTooltip title="Back">
          <div className="h-fit w-fit p-2 hover:bg-gray-500/20 rounded-full">
            <ArrowLeft className="size-5 " />
          </div>
        </CustomTooltip>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-lg tracking-wider">
            {profile?.username}
          </span>
          <span className="text-sm text-gray-400">
            {posts.length || 0} posts
          </span>
        </div>
      </div>

      <div>
        <img src={profile.banner} />
      </div>
    </div>
  );
};

export default Profile;
