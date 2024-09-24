import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";
import { useProfileContext } from "../../context/ProfileContex";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Postdisplayer from "../home/Postdisplayer";

function UserProfile() {
  const navigate = useNavigate();
  const queryclient = useQueryClient();
  const { currentProfile } = useProfileContext();

  useEffect(() => {
    if (!currentProfile) navigate("/home");
  }, [currentProfile]);

  //state
  const [isauthuserFollowing, setAuthUserFollowing] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState([]);
  const [totalFollowing, setTotalFollowing] = useState([]);
  //getting profile
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const { data: profile } = useQuery({
    queryKey: ["userProfile", currentProfile, authuser],
    queryFn: async () => {
      try {
        const res = await fetch(`/user/profile/${currentProfile}`);
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!currentProfile,
  });

  //settng state
  useEffect(() => {
    if (
      profile &&
      JSON.stringify(authuser?.following) !== JSON.stringify(totalFollowing)
    ) {
      setAuthUserFollowing([...authuser.following]);
      setTotalFollowing([...profile.following]);
      setTotalFollowers([...profile.followers]);
    }
  }, [profile, currentProfile, authuser]);

  //getting post
  const {
    data: userPosts,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/post/profile/${profile?._id}`);
        const data = await res.json();
        console.log(data);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!profile,
  });
  console.log(profile?.banner);

  //following logic
  const { mutate: follow } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/user/follow/${profile._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return toast.error(data.error);
      }
      await queryclient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
    },
  });

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b m-2 p-1 font-medium ">Profile</div>
      <div className=" rounded-lg  w-full h-40 md:h-fit lg:h-fit my-2">
        {/* {isPending ||
            (isLoading && <div className="skeleton h-40 w-full"></div>)} */}
        <a href={profile?.banner} target="_blank">
          <img
            src={profile?.banner}
            className="h-full rounded-md w-full md:h-fit select-none"
          ></img>
        </a>
      </div>
      <div>
        <div className="flex m-1 items-center">
          <div className="h-fit w-fit m-1 rounded-full border ">
            <a href={profile?.profilePic} target="_blank">
              <img
                src={profile?.profilePic}
                className="h-20 w-20 rounded-full select-none object-cover"
              ></img>
            </a>
          </div>
          <div className="mx-2 font-semibold tracking-wider select-none lg:text-xl ">
            {profile?.username}
          </div>
          {/* Hello */}
          {!isauthuserFollowing.includes(profile?._id) &&
            profile?._id !== authuser._id && (
              <div className="ml-auto mx-4  rounded-md" onClick={follow}>
                <button className="bg-blue-500 hover:bg-blue-300 active:bg-green-500 p-2 rounded-md px-4 select-none ">
                  Follow
                </button>
              </div>
            )}
          {isauthuserFollowing.includes(profile?._id) &&
            profile?._id !== authuser._id && (
              <div className="ml-auto mx-4  rounded-md" onClick={follow}>
                <button className="bg-red-500 hover:bg-blue-300 active:bg-green-500 p-2 rounded-md px-4 select-none ">
                  Unfollow
                </button>
              </div>
            )}
        </div>
        <div className=" m-2 h-fit">
          <div className="p-2 flex flex-col gap-1">
            <div>
              <span className="text-blue-400 font-medium">Email : </span>
              {profile?.email}
            </div>
            <div>
              <span className="text-blue-400 font-medium">Bio : </span>
              {profile?.bio}
            </div>
            <div>
              <span className="text-blue-400 font-medium">Socials : </span>
              {profile?.links}
            </div>
          </div>
        </div>
        <div className=" m-2">
          <div className="flex gap-2 items-center">
            <div className=" p-1 text-gray-400 ">
              <span className=" font-bold mx-2 text-xl ">
                {totalFollowers?.length}
              </span>
              Followers
            </div>
            <div className=" p-1 text-gray-400">
              <span className=" font-bold mx-2 text-xl">
                {totalFollowing?.length}
              </span>
              Following
            </div>
          </div>
        </div>
      </div>
      {(isLoading || isPending) && <Skele />}
      {userPosts?.length > 0 &&
        userPosts?.map((post) => (
          <Postdisplayer key={post._id} post={post} userID={authuser._id} />
        ))}
    </div>
  );
}

export default UserProfile;
