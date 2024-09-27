import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { TbMoodSad } from "react-icons/tb";

import ListFollowersFollowings from "./ListFollowersFollowings";

function GetFollowing() {
  const { personID, username } = useParams();
  if (!personID) return;
  const querclient = useQueryClient();
  const [isFollowing, setFollowing] = useState([]);
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const auth = authuser._id;

  useEffect(() => {
    setFollowing([...authuser.following]);
  }, [authuser]);

  const { data: followings } = useQuery({
    queryKey: [`following${personID}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/user/getfollowings/?personID=${personID}`);
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
  });
  //follow

  const { mutate: follow } = useMutation({
    mutationFn: async (person) => {
      try {
        const res = await fetch(`/user/follow/${person}`, {
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
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
    },
  });

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b border-blue-500 p-1 m-2 font-semibold text-lg">
        {username}'s Followings
      </div>
      <div className="mt-2 p-2">
        {followings && followings.length > 0 ? (
          followings?.map((foo) => (
            <ListFollowersFollowings
              key={foo._id}
              person={foo}
              follow={follow}
              personFollowing={isFollowing.includes(foo._id)}
              isPerson={auth == foo._id}
            />
          ))
        ) : (
          <div className=" h-screen flex flex-col  items-center ">
            <div className="h-4/6 w-7/12 flex flex-col items-center">
              <TbMoodSad className="w-full h-5/6  opacity-50  " />
              <div className="text-md tracking-wide  md:text-xl md:tracking-wider opacity-75 p-1 ">
                {username} isn't following anyone!:(
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetFollowing;
