import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SuggestionDisplayer from "./SuggestionDisplayer";
import toast from "react-hot-toast";
import LinesSkele from "../skeletons/LinesSekele";
import { IoIosRefresh } from "react-icons/io";

function Suggestion() {
  const querclient = useQueryClient();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [isFollowing, setFollowing] = useState([]);

  useEffect(() => {
    if (
      authuser &&
      JSON.stringify(isFollowing) !== JSON.stringify(authuser.following)
    ) {
      setFollowing([...authuser.following]);
    }
  }, [authuser, isFollowing]);

  const { data: suggestedUsers, mutate: refetchSuggestions } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/user/suggestion", {
          method: "POST",
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  //follow
  const { mutate: follow } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/user/follow/${id}`, {
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

  useEffect(() => {
    refetchSuggestions();
  }, []);

  return (
    <div className=" w-2/12 bg-black border-2 hidden h-screen  lg:block p-2 text-white sticky top-0 lebot-0 select-none">
      <div className="border-b p-2 select-none">Suggestions</div>
      {/* {(isLoading || isPending) && <LinesSkele />} */}
      {suggestedUsers?.length <= 0 && (
        <div className="h-32 flex items-center justify-center p-3 text-blue-500">
          You are following everyone!
        </div>
      )}
      {suggestedUsers?.map((sug) => (
        <SuggestionDisplayer
          key={sug._id}
          suggestion={sug}
          following={isFollowing.includes(sug._id)}
          follow={follow}
        />
      ))}
      <div>
        <IoIosRefresh
          className={` w-full h-10 active:animate-spin active:text-green-400 `}
          onClick={() => refetchSuggestions()}
        />
      </div>
    </div>
  );
}

export default Suggestion;
