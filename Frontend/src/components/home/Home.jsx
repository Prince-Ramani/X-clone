import Postdisplayer from "./Postdisplayer";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";
import { FaSadTear } from "react-icons/fa";

function Home() {
  const querclient = useQueryClient();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [currentlyFollowing, setFollowing] = useState([...authuser.following]);

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

  const [isActive, setActive] = useState("getallpost");
  const {
    data: posts,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["postsKey"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${isActive}`);
      const data = await res.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    querclient.invalidateQueries({ queryKey: ["postsKey"] });
  }, [isActive, setActive]);

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen border md:w-5/12 lg:5/12 p-2">
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
      ) : Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <Postdisplayer
            key={post._id}
            post={post}
            isFollowing={currentlyFollowing.includes(post.uploadedBy._id)}
            followFunc={follow}
            userID={authuser._id}
          />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center border h-screen">
          <FaSadTear className="h-3/6 w-7/12  opacity-20 " />
          <div className="text-xl tracking-wider opacity-50">
            No posts available!
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
