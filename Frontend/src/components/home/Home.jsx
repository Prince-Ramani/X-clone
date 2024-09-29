import Postdisplayer from "./Postdisplayer";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";
import { FaSadTear } from "react-icons/fa";
import Spinner from "../../ani/Spinner";

function Home() {
  const querclient = useQueryClient();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [currentlyFollowing, setFollowing] = useState([...authuser.following]);
  const [currentOffSet, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState([]);
  const [isActive, setActive] = useState("getallpost");
  const [isChanged, setChanged] = useState(0);
  let temp = 0;

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
      }
      if (data.message === "followed successfully") {
        setFollowing((prev) => [...prev, personID]);
      }
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["PostsKey"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/post/${isActive}?limit=10&offset=${currentOffSet}`
        );
        const data = await res.json();
        if (data.length < 10) setHasMore(false);
        setCurrentOffset((prev) => prev + 10);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
    enabled: hasMore,
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
    setHasMore(true);
    setCurrentOffset(0);
  }, [isActive]);

  useEffect(() => {
    if (data) setTotalPosts((prev) => [...prev, ...data]);
  }, [data]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="w-screen  bg-black  overflow-y-scroll  text-white flex flex-col  md:w-5/12   p-2 pt-12 lg:pt-2 ">
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
          className={` w-5/12 p-1 border-b-2 select-none ${
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
            userID={authuser._id}
          />
        ))
      )}
      {totalPosts.length === 0 ||
        (!hasMore && (
          <div className="flex flex-col justify-center items-center h-screen w-full pb-20">
            <FaSadTear className="h-2/6 w-7/12  opacity-20 " />
            <div className="text-xl tracking-wider opacity-50 p-2">
              No More posts available!
            </div>
          </div>
        ))}
      {isLoading && (
        <div className=" p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Home;
