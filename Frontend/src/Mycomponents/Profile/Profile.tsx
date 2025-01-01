import CustomTooltip from "@/customComponents/ToolTip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Lock,
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
import ProfilePost from "./profilePosts";
import FollowButton from "@/customComponents/FollowButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Count from "./Count";
import EditProfileDialog from "@/Layout/EditProfileDialog";
import Polls from "./Polls";

const Profile = () => {
  const navigate = useNavigate();
  const queryclient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

      if ("error" in data) {
        toast.error(data.error);
        setTimeout(() => navigate(-1), 1000);
        return null;
      } else return data;
    },
    enabled: !!personUsername,
    refetchOnWindowFocus: false,
  });

  const { data: totalPosts } = useQuery({
    queryKey: [personUsername, "PostsCount"],

    queryFn: async () => {
      if ("error" in profile || "isBlocked" in profile) return null;

      const res = await fetch(
        `/api/post/getpostscount?personID=${profile._id}`
      );
      const data = await res.json();

      return data;
    },
    enabled: !!profile,
    refetchOnWindowFocus: false,
  });

  const { mutate: Block } = useMutation({
    mutationFn: async () => {
      if (authUser._id === profile._id)
        return toast.error("You can't block yourself!");
      const res = await fetch(`/api/blockuser/${profile?._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if ("error" in data) return toast.error(data.error);

      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: [personUsername, "Profile"] });

      return data;
    },
  });

  return (
    <div
      className={`border border-b-0 border-gray-800 min-h-full    cursor-pointer ${
        isOpen ? "overflow-y-hidden" : ""
      }`}
    >
      {isOpen ? (
        <EditProfileDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : (
        ""
      )}
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

      <div className="h-40  md:h-44 lg:h-56 w-full   ">
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

      {profile && !("error" in profile) && !("isBlocked" in profile) ? (
        <div className=" relative bottom-20  sm:bottom-24 md:bottom-32   flex items-center justify-end gap-3 md:gap-4 px-4  ">
          {profile._id !== authUser._id ? (
            <Popover>
              <PopoverTrigger>
                <div className="size-8 border border-white/70 hover:bg-white/20 rounded-full active:bg-white/40 flex justify-center items-center ">
                  <MoreHorizontal className="size-5" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="  bg-black text-white p-0 border-none shadow-md  shadow-red-600/80  ring-1 ring-red-500/80  ">
                <div
                  className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-red-600/20 transition-colors cursor-pointer select-none font-semibold tracking-wide"
                  onClick={() => Block()}
                >
                  Block
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            ""
          )}

          <CustomTooltip title="Search">
            <button className="size-8 border  border-white/70 hover:bg-white/20 active:bg-white/40  rounded-full  flex justify-center items-center">
              <Search className="size-4 m-1 " />
            </button>
          </CustomTooltip>

          {authUser._id === profile?._id ? (
            <button
              className="bg-transparent border rounded-full w-24 border-gray-200/90 hover:bg-white/10 h-8 text-sm font-bold"
              onClick={() => setIsOpen(true)}
            >
              Edit profile
            </button>
          ) : (
            ""
          )}
          {profile && profile !== null ? (
            <FollowButton personId={profile?._id} username={personUsername} />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {isFetching || isLoading || isPending ? (
        <div className="bg-white/5 animate-pulse duration-600 size-28 relative bottom-20 rounded-md w-2/3 m-2 mx-5"></div>
      ) : (
        <>
          <div className="p-2 px-5 relative bottom-20 md:bottom-20  ">
            <div className="font-bold text-xl flex gap-2 items-center ">
              {" "}
              <div>{profile?.username}</div>
              {profile?.accountType === "private" ? (
                <CustomTooltip title="Private account">
                  <div>
                    <Lock className="size-5" />
                  </div>
                </CustomTooltip>
              ) : (
                ""
              )}
            </div>
            <div className="text-gray-400/80">@{profile?.username}</div>
          </div>

          <div className="  relative bottom-16 md:bottom-20  mb  px-2 md:px-5 flex flex-col gap-2">
            <div className="text-sm mb-1">{profile?.bio}</div>
            <div className="flex  items-center gap-2 text-gray-400/70 text-xs 2xl:text-sm ">
              <MapPin className="size-4" />
              {profile?.location || "unknown"}
              <LucideCalendarRange className="size-4" /> Joined{" "}
              {profile && profile.createdAt
                ? format(profile?.createdAt, "MMMM yyyy")
                : ""}
            </div>
            {!!profile && "isBlocked" in profile ? (
              ""
            ) : (
              <Count
                personUsername={personUsername}
                followingLength={profile.following.length}
              />
            )}
          </div>
        </>
      )}
      {/* dcdc */}
      <div className="font-semibold relative bottom-12  text-sm  sm:text-base  tracking-wide flex border-b border-gray-800 text-gray-400/70 select-none    ">
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
        <div
          className={`w-1/3 hover:bg-white/20  flex flex-col justify-center items-center gap-1  ${
            currentPath === "polls" ? "text-white font-bold" : ""
          }  `}
          onClick={() => navigate(`/profile/${personUsername}/polls`)}
        >
          <div className="p-1 pt-2">Polls</div>
          <div
            className={`border-2 border-blue-400 w-20 rounded-full ${
              currentPath === "polls" ? "block" : "hidden"
            }`}
          />
        </div>
      </div>

      {currentPath === "likedposts" && profile && !("isBlocked" in profile) ? (
        <LikedPosts
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}
      {currentPath === "media" && profile && !("isBlocked" in profile) ? (
        <Media
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}

      {currentPath === "polls" && profile && !("isBlocked" in profile) ? (
        <Polls
          isAuthenticated={!!profile._id}
          authUserId={authUser._id}
          profileId={profile._id}
        />
      ) : (
        ""
      )}

      {!currentPath && profile && !("isBlocked" in profile) ? (
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
