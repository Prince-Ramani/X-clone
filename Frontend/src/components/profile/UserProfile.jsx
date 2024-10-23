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
import Spinner from "../../ani/Spinner";
import { useAuthUserContext } from "../../context/AuthUserContext";

function UserProfile() {
  const navigate = useNavigate();

  const { currentProfile } = useProfileContext();

  const { authUser, setAuthUser } = useAuthUserContext();

  useEffect(() => {
    if (!currentProfile) navigate("/home");
    if (currentProfile == authUser._id) {
      navigate("/profile");
    }
  }, [currentProfile, navigate]);

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  //state

  const [totalFollowers, setTotalFollowers] = useState([]);
  const [totalFollowing, setTotalFollowing] = useState([]);
  const [userOffSet, setUserOffset] = useState(0);
  const [totalUserPosts, setTotalUserPosts] = useState([]);
  const [morePost, setMorePost] = useState(true);

  //getting profile
  const {
    data: profile,
    isLoading: gettingPro,
    isPendingingProf: gettingProf,
  } = useQuery({
    queryKey: ["userProfile", currentProfile],
    queryFn: async () => {
      try {
        const res = await fetch(`/user/profile/${currentProfile}`);
        const data = await res.json();
        if ("error" in data) return data;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!currentProfile || !!authUser,
  });

  useEffect(() => {
    if (profile) {
      setTotalFollowers([...profile.followers]);
      setTotalFollowing([...profile.following]);
    }
  }, [profile]);

  //posts

  const {
    data: userPosts,
    isLoading,
    isPending,
    refetch: FetchPosts,
    isFetching,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/post/profile/${currentProfile}?limit=10&offset=${userOffSet}`
        );
        const data = await res.json();
        if (data.length < 10) setMorePost(false);
        setUserOffset((prev) => prev + data.length);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!profile || !!currentProfile || !!authUser,
  });

  useEffect(() => {
    if (profile) setTotalUserPosts((prev) => [...prev, ...userPosts]);
  }, [userPosts]);

  useEffect(() => {
    setTotalUserPosts([]);
    setUserOffset(0);
    FetchPosts();
  }, [currentProfile]);

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + window.scrollY + 1 >=
        document.documentElement.scrollHeight &&
      morePost
    ) {
      FetchPosts();
    }
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [morePost]);

  //following logic
  const {
    mutate: follow,
    isLoading: loadingFollow,
    isPending: pendingFollow,
  } = useMutation({
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
        return;
      }
      if (data.message === "unfollowed successfully") {
        await setAuthUser({
          ...authUser,
          following: authUser.following.filter((val) => val !== profile._id),
        });
        setTotalFollowers([
          totalFollowers.filter((val) => val !== authUser._id),
        ]);
      }
      if (data.message === "followed successfully") {
        await setAuthUser({
          ...authUser,
          following: [...authUser.following, profile._id],
        });
        setTotalFollowers([...totalFollowers, authUser._id]);
      }
      toast.success(data.message);
    },
  });

  const handleFollowClick = (e) => {
    e.preventDefault();
    follow();
  };

  return (
    <div className="w-screen pt-12 lg:p-2 bg-black  text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
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
          {!authUser.following.includes(profile?._id) &&
            profile?._id !== authUser._id && (
              <div
                className="ml-auto mx-4  rounded-md"
                onClick={handleFollowClick}
              >
                <button
                  className="bg-blue-500 hover:bg-blue-300 active:bg-green-500 p-2 rounded-md px-4 select-none "
                  disabled={loadingFollow || pendingFollow}
                >
                  {loadingFollow || pendingFollow ? "Following..." : "Follow"}
                </button>
              </div>
            )}
          {authUser.following.includes(profile?._id) &&
            profile?._id !== authUser._id && (
              <div
                className="ml-auto mx-4  rounded-md"
                onClick={(e) => handleFollowClick(e)}
              >
                <button
                  className="bg-red-500 hover:bg-pink-300 active:bg-green-500 p-2 rounded-md px-4 select-none"
                  disabled={loadingFollow || pendingFollow}
                >
                  {loadingFollow || pendingFollow
                    ? "Unfollowing..."
                    : "Unfollow"}
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
      {totalUserPosts?.length > 0 &&
        totalUserPosts?.map((post, index) => (
          <Postdisplayer
            key={`${post._id}-${userOffSet}-${index}`}
            post={post}
            userID={authUser._id}
          />
        ))}
      {isFetching && (
        <div className="flex justify-center items-center ">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default UserProfile;
