import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function GetFollowers() {
  const { personID, username } = useParams();
  if (!personID) return;
  const { data: followers } = useQuery({
    queryKey: [`followers${personID}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/user/getfollowers/?personID=${personID}`);
        const data = await res.json();
        console.log(data);
        if ("error" in data) return toast.error(data.error);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b p-1 m-2 font-semibold text-lg">
        {username}'s followers
      </div>
      <div className="border">
        {followers &&
          followers.length > 0 &&
          followers?.map((follower) => <p>follwer</p>)}
      </div>
    </div>
  );
}

export default GetFollowers;
