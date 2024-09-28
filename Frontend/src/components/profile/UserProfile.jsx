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
import { useNavigate } from "react-router-dom";
import Postdisplayer from "../home/Postdisplayer";

function UserProfile() {
  const navigate = useNavigate();
  const queryclient = useQueryClient();
  const { currentProfile } = useProfileContext();

  const { data: authuser, refetch } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    if (!currentProfile) navigate("/home");
  }, [currentProfile, navigate]);

  //state
  const [isauthuserFollowing, setAuthUserFollowing] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState([]);
  const [totalFollowing, setTotalFollowing] = useState([]);
  //getting profile
  const {
    data: profile,
    isLoading: gettingPro,
    isPendingingProf: gettingProf,
  } = useQuery({
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
    enabled: !!currentProfile || !!authuser,
  });

  //settng state
  useEffect(() => {
    if (profile) {
      setAuthUserFollowing([...authuser.following]);
      setTotalFollowers([...profile.followers]);
      setTotalFollowing([...profile.following]);
    }
  }, [currentProfile, authuser, profile]);

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
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!profile,
  });

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

  const handleFollowClick = (e) => {
    e.preventDefault();
    follow();
  };

  return (
    <div className="w-screen pt-12 lg:p-2 bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b m-2 p-1 font-medium ">Profile</div>
      <div className=" rounded-lg  w-full  h-fit my-2">
        {gettingPro || gettingProf ? (
          <div className="skeleton h-40 w-full"></div>
        ) : (
          <a href={profile?.banner} target="_blank">
            <img
              src={profile?.banner}
              className="h-full rounded-md w-full md:h-fit select-none"
            ></img>
          </a>
        )}
      </div>
      <div>
        <div className="flex m-1 items-center">
          <div className="h-fit w-fit m-1 rounded-full shrink-0  ">
            {gettingPro || gettingProf ? (
              <div className="skeleton h-20 w-20 rounded-full"></div>
            ) : (
              <a href={profile?.profilePic} target="_blank">
                <img
                  src={profile?.profilePic}
                  className="h-20 w-20 rounded-full select-none  object-cover border"
                ></img>
              </a>
            )}
          </div>
          <div className="mx-2 font-semibold tracking-wider select-none lg:text-xl ">
            {profile?.username}
          </div>
          {!isauthuserFollowing.includes(profile?._id) &&
            profile?._id !== authuser._id && (
              <div
                className="ml-auto mx-4  rounded-md"
                onClick={handleFollowClick}
              >
                <button className="bg-blue-500 hover:bg-blue-300 active:bg-green-500 p-2 rounded-md px-4 select-none ">
                  Follow
                </button>
              </div>
            )}
          {isauthuserFollowing.includes(profile?._id) &&
            profile?._id !== authuser._id && (
              <div
                className="ml-auto mx-4  rounded-md"
                onClick={(e) => handleFollowClick(e)}
              >
                <button className="bg-red-500 hover:bg-pink-300 active:bg-green-500 p-2 rounded-md px-4 select-none ">
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
            <div className="flex flex-col ">
              <span className="text-blue-400 font-medium ">Socials:</span>
              {profile?.links.length > 0 &&
                profile?.links.map((l) => (
                  <div>
                    <a
                      href={l}
                      className="text-blue-600  hover:text-gray-400"
                      target="_blank"
                    >
                      {l}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className=" m-2">
          <div className="flex gap-2 items-center">
            <div
              className=" p-1 text-gray-400  cursor-pointer hover:text-blue-700 "
              onClick={() =>
                navigate(`/followers/${profile.username}/${profile._id}`)
              }
            >
              <span className=" font-bold mx-2 text-xl ">
                {totalFollowers?.length}
              </span>
              Followers
            </div>
            <div
              className=" p-1 text-gray-400 cursor-pointer hover:text-blue-700"
              onClick={() =>
                navigate(`/followings/${profile.username}/${profile._id}`)
              }
            >
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
