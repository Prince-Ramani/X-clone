import CustomTooltip from "@/customComponents/ToolTip";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  LucideCalendarRange,
  MapPin,
  MoreHorizontal,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import Media from "./Media";
import LikedPosts from "./LikedPosts";
import { useEditProfileContext } from "@/context/EditProfileContext";
import ProfilePost from "./profilePosts";
import FollowButton from "@/customComponents/FollowButton";

const Profile = () => {
  const navigate = useNavigate();
  const { setIsEditProfileDialog } = useEditProfileContext();

  const [currentPath, setCurrentPath] = useState<string | null | undefined>(
    null
  );

  useEffect(() => {
    const currentPath = window.location.pathname.split("/")[3]?.toLowerCase();
    setCurrentPath(currentPath || null);
  }, [navigate]);

  const { username: personUsername } = useParams();

  if (!personUsername) return;

  const { authUser } = useAuthUser();
  const userId = authUser?._id;
  if (!userId) return;

  const {
    data: profile,
    isFetching,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: [personUsername, "Profile"],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${personUsername}`);
      const data = await res.json();
      return data;
    },
    enabled: !!personUsername,
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
      return data;
    },

    refetchOnWindowFocus: false,
  });

  const { data: totalPosts } = useQuery({
    queryKey: [personUsername, "PostsCount"],
    queryFn: async () => {
      const res = await fetch(`/api/post/getpostscount`);
      const data = await res.json();
      return data;
    },
    enabled: !!personUsername,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="border border-b-0 border-gray-800 min-h-full  cursor-pointer">
      <div className=" pb-1  px-4   flex  items-center backdrop-blur-lg bg-black/70  sticky top-0 gap-5 z-10 ">
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
          <span className="text-xs text-gray-400">{totalPosts || 0} posts</span>
        </div>
      </div>

      <div className="h-40  md:h-44 w-full   ">
        {isPending || isFetching || isLoading ? (
          <div className="h-full w-full bg-white/10 animate-pulse duration-600 " />
        ) : (
          <a
            href={profile?.banner}
            target="_blank"
            className="focus:outline-none object-fill"
          >
            <img src={profile?.banner} className="h-full w-full " />
          </a>
        )}
      </div>

      <div className="relative   p-1 md:p-2 bg-black h-fit w-fit rounded-full bottom-10 left-3 sm:bottom-14 sm:left-4  md:bottom-16 md:left-5">
        {isPending || isFetching || isLoading ? (
          <div className="size-20 sm:size-24 md:size-32 rounded-full bg-white/10 animate-pulse duration-600 " />
        ) : (
          <a
            href={profile?.profilePic}
            target="_blank"
            className="focus:outline-none"
          >
            <img
              src={profile?.profilePic}
              className=" size-20 sm:size-24 md:size-32 rounded-full object-cover "
            />
          </a>
        )}
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

        {authUser._id === profile?._id ? (
          <button
            className="bg-transparent border rounded-full w-24 border-gray-200/90 hover:bg-white/10 h-8 text-sm font-bold"
            onClick={() => setIsEditProfileDialog(true)}
          >
            Edit profile
          </button>
        ) : (
          <FollowButton personId={profile?._id} username={personUsername} />
        )}
      </div>

      {isFetching || isLoading || isPending ? (
        <div className="bg-white/5 animate-pulse duration-600 size-28 relative bottom-20 rounded-md w-2/3 m-2 mx-5"></div>
      ) : (
        <>
          <div className="p-2 px-5 relative bottom-20 md:bottom-20  ">
            <div className="font-bold text-xl "> {profile?.username}</div>
            <div className="text-gray-400/80">@{profile?.username}</div>
          </div>

          <div className="  relative bottom-16 md:bottom-20  px-2 md:px-4 flex flex-col gap-2">
            {profile?.bio}
            <div className="flex  items-center gap-2 text-gray-400/70 text-xs 2xl:text-sm ">
              <MapPin className="size-4" />
              {profile?.location || "unknown"}
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
        </>
      )}

      <div className="font-semibold relative bottom-12  tracking-wide flex border-b border-gray-800 text-gray-400/70 select-none    ">
        <div
          className={`w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1 ${
            !currentPath ? "text-white font-bold" : ""
          }  `}
          onClick={() => navigate(`/profile/${personUsername}`)}
        >
          <div className="p-1 pt-2">Posts</div>
          <div
            className={`border-2 border-blue-400 w-16 rounded-full ${
              !currentPath ? "block" : "hidden"
            }`}
          />
        </div>
        <div
          className={`w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1  ${
            currentPath === "likedposts" ? "text-white font-bold" : ""
          }  `}
          onClick={() => navigate(`/profile/${personUsername}/likedposts`)}
        >
          <div className="p-1 pt-2">Liked posts</div>
          <div
            className={`border-2 border-blue-400 w-20 rounded-full ${
              currentPath === "likedposts" ? "block" : "hidden"
            }`}
          />
        </div>
        <div
          className={`w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1  ${
            currentPath === "media" ? "text-white font-bold" : ""
          }  `}
          onClick={() => navigate(`/profile/${personUsername}/media`)}
        >
          <div className="p-1 pt-2"> Media</div>
          <div
            className={`border-2 border-blue-400 w-16 rounded-full ${
              currentPath === "media" ? "block" : "hidden"
            }`}
          />
        </div>
      </div>

      {currentPath === "likedposts" && profile ? (
        <LikedPosts
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}
      {currentPath === "media" && profile ? (
        <Media
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}

      {!currentPath && profile ? (
        <ProfilePost
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
