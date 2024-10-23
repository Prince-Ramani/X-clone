import Postdisplayer from "./Postdisplayer";
import { isValidElement, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";
import { FaSadTear } from "react-icons/fa";
import Spinner from "../../ani/Spinner";
import { useAuthUserContext } from "../../context/AuthUserContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { authUser, setAuthUser } = useAuthUserContext();
  const [currentlyFollowing, setFollowing] = useState([...authUser.following]);
  const [currentOffSet, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState([]);
  const [isActive, setActive] = useState("getallpost");
  const [isChanged, setChanged] = useState(null);

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const { mutate: follow } = useMutation({
    mutationFn: async (personID) => {
      try {
        const res = await fetch(`/user/follow/${personID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if ("error" in data) {
          toast.error(data.error);
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data, personID) => {
      if ("error" in data) {
        return;
      }
      if (data.message === "unfollowed successfully") {
        setFollowing((prev) => prev.filter((per) => per != personID));
        await setAuthUser({
          ...authUser,
          following: authUser.following.filter((val) => val !== personID),
        });
      }
      if (data.message === "followed successfully") {
        setFollowing((prev) => [...prev, personID]);
        await setAuthUser({
          ...authUser,
          following: [...authUser.following, personID],
        });
      }
      toast.success(data.message);
    },
  });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["PostsKey", isChanged],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/post/${isActive}?limit=10&offset=${currentOffSet}`
        );
        const data = await res.json();
        if (data.length === 0) setHasMore(false);
        return data;
      } catch (err) {
        setHasMore(false);
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
    enabled: hasMore && !!authUser,
  });

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + window.scrollY + 1 >=
        document.documentElement.scrollHeight &&
      hasMore
    ) {
      refetch();
    }
  }, 200);

  useEffect(() => {
    setTotalPosts([]);
    setCurrentOffset(0);
    setHasMore(true);
    setChanged((prev) => prev + 1);
  }, [isActive]);

  useEffect(() => {
    if (isChanged !== null && hasMore) refetch();
  }, [isChanged]);

  useEffect(() => {
    if (data && data.length > 0 && hasMore) {
      setCurrentOffset((prev) => prev + data.length);
      setTotalPosts((prev) => [...prev, ...data]);
    }
  }, [data]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="w-screen  bg-black  pb-96 lg:pb-10 text-white flex flex-col md:w-5/12 p-2 pt-12 lg:pt-2 ">
      <div className="w-full h-10 flex justify-around items-center">
        <button
          className={`w-5/12 p-1 border-b-2 select-none  ${
            isActive == "getallpost" ? "border-blue-500" : "border-none"
          } `}
          onClick={() => setActive(`getallpost`)}
        >
          For you
        </button>
        <button
          className={` w-5/12 p-1 border-b-2 select-none transition-opacity duration-700po ${
            isActive == "followingposts" ? "border-blue-500" : "border-none"
          }`}
          onClick={() => setActive(`followingposts`)}
        >
          Following
        </button>
      </div>
      {isLoading ? (
        <Skele />
      ) : (
        totalPosts.map((post, index) => (
          <Postdisplayer
            key={`${post._id}-${currentOffSet}-${index}-${isChanged}`}
            post={post}
            isFollowing={currentlyFollowing.includes(post.uploadedBy._id)}
            followFunc={follow}
            userID={authUser._id}
          />
        ))
      )}

      {(isLoading || isFetching) && (
        <div className="flex justify-center items-center p-4 transition-opacity  ">
          <Spinner />
        </div>
      )}

      {totalPosts.length === 0 && !isFetching && (
        <div className="flex flex-col justify-center items-center h-screen w-full pb-20">
          <FaSadTear className="h-2/6 w-7/12  opacity-20 " />
          <div className="text-xl tracking-wider opacity-50 p-2">
            NO posts available!
          </div>
        </div>
      )}

      {!hasMore && totalPosts?.length > 0 && (
        <h1 className="w-full text-center p-4 text-green-500 ">
          You have seen every single post!
        </h1>
      )}
    </div>
  );
}

export default Home;
