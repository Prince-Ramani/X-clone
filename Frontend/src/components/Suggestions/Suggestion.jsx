import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SuggestionDisplayer from "./SuggestionDisplayer";
import toast from "react-hot-toast";
import { IoIosRefresh } from "react-icons/io";
import { useAuthUserContext } from "../../context/AuthUserContext";
import { useProfileContext } from "../../context/ProfileContex";

function Suggestion() {
  const { authUser, setAuthUser } = useAuthUserContext();
  const queryclient = useQueryClient();
  const { currentProfile } = useProfileContext();

  const {
    data: suggestedUsers,
    mutate: refetchSuggestions,
    isPending,
  } = useMutation({
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
        await setAuthUser({
          ...authUser,
          following: authUser.following.filter((val) => val !== personID),
        });
      }

      if (data.message === "followed successfully") {
        await setAuthUser({
          ...authUser,
          following: [...authUser.following, personID],
        });
      }
      //for userProfile
      if (currentProfile == personID) {
        console.log(currentProfile, personID);
        await queryclient.invalidateQueries({
          queryKey: ["userProfile", currentProfile],
        });
      }
      toast.success(data.message);
    },
  });

  useEffect(() => {
    refetchSuggestions();
  }, []);

  return (
    <div className=" w-2/12 bg-black border  border-white/30 rounded-tr-lg  rounded-br-lg hidden h-screen mr-auto lg:block p-2 text-white sticky top-0 lebot-0 select-none">
      <div className="border-b p-2 select-none">Suggestions</div>
      {isPending && <div className="skeleton h-screen w-full"></div>}
      {suggestedUsers?.length <= 0 && (
        <div className="h-32 flex items-center justify-center p-3 text-blue-500">
          You are following everyone!
        </div>
      )}
      {suggestedUsers?.map((sug) => (
        <SuggestionDisplayer
          key={sug._id}
          suggestion={sug}
          following={authUser.following.includes(sug._id)}
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
