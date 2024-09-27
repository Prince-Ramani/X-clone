import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Postdisplayer from "../home/Postdisplayer";
import Skele from "../skeletons/Skele";
import { RiImageEditLine } from "react-icons/ri";
import ProfilepicSkele from "../skeletons/ProfilepicSkele";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function ShowProfile() {
  const { data: person } = useQuery({ queryKey: ["authUser"] });
  const querclient = useQueryClient();
  const navigate = useNavigate();

  console.log(person);

  const {
    data: userPosts,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["myPosts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/post/profile/${person._id}`);
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: uploadPic,
    isPending: uploading,
    isLoading: uploader,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/user/updatepicture", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if ("error" in data) {
          return toast.error("Make sure internet is ON!");
        }
        return data;
      } catch (err) {
        return toast.error("Make sure internet is ON!");
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      querclient.invalidateQueries("authUser");
      toast.success(`Profile picture updated successfully!`);
    },
  });

  const { mutate: uploadBanner } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/user/updatebanner", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if ("error" in data) {
          return toast.error("Make sure internet is ON!");
        }
        return data;
      } catch (err) {
        return toast.error("Make sure internet is ON!");
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      querclient.invalidateQueries("authUser");
      toast.success(`banner updated successfully!`);
    },
  });

  const handleProfileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return toast.error("File doesn't exists");
    const formData = new FormData();
    formData.append("profilePic", file);
    uploadPic(formData);
  };
  const handleBannerUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return toast.error("File doesn't exists");
    const formData = new FormData();
    formData.append("banner", file);
    uploadBanner(formData);
  };

  if (uploading || uploader) {
    return <h1>Uploading</h1>;
  }

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b m-2 p-1 font-medium ">Profile</div>
      <div className=" rounded-lg  w-full h-40 md:h-fit lg:h-fit my-2">
        {isLoading || isPending ? (
          <div className="skeleton h-40 w-full"></div>
        ) : (
          <div className="h-fit w-full m-1 rounded-md  hover:border-2  relative group">
            <label
              htmlFor="bannerUpload"
              className="hover:cursor-pointer group"
            >
              <RiImageEditLine className="absolute text-center h-full w-full  bg-zinc-700  group-hover:block group-hover:opacity-30 transition-opacity duration-500 opacity-0 rounded-sm" />
            </label>
            <input
              type="file"
              id="bannerUpload"
              className="hidden"
              accept="image/*"
              name="banner"
              onChange={(e) => handleBannerUpload(e)}
            />
            <a to={person.banner} target="_blank">
              <img
                src={person.banner}
                className="h-full rounded-md w-full md:h-fit select-none object-cover"
              ></img>
            </a>
          </div>
        )}
      </div>
      <div>
        <div className="flex m-1 items-center">
          <div className="h-fit w-fit m-1 rounded-full border hover:border-2 relative group">
            <label htmlFor="profilePicUpload" className="hover:cursor-pointer">
              <RiImageEditLine className="absolute text-center h-full w-full p-3 bg-zinc-700 opacity-0 group-hover:block  group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
            </label>
            <input
              type="file"
              id="profilePicUpload"
              className="hidden"
              accept="image/*"
              name="profilePic"
              onChange={(e) => handleProfileUpload(e)}
            />
            <a href={person.profilePic} target="_blank">
              <img
                src={person.profilePic}
                className="h-20 w-20 rounded-full select-none object-cover "
              ></img>
            </a>
          </div>
          <div className="mx-2 font-semibold  tracking-wider select-none lg:text-xl ">
            {person.username}
          </div>
          <div className="ml-auto h-fit w-fit">
            <button
              className="bg-green-600 p-2 rounded-md hover:border-2 active:bg-blue-500"
              onClick={() => {
                navigate("/update");
              }}
            >
              Update Profile
            </button>
          </div>
        </div>
        <div className=" m-2 h-fit">
          <div className="p-2 flex flex-col gap-1">
            <div>
              <span className="text-blue-400 font-medium">Email : </span>
              {person.email}
            </div>
            <div>
              <span className="text-blue-400 font-medium">Bio : </span>
              {person.bio}
            </div>
            <div>
              <div className="flex flex-col ">
                <span className="text-blue-400 font-medium ">Socials:</span>
                {person.links.length > 0 &&
                  person.links.map((l) => (
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
        </div>
        <div className=" m-2 border">
          <div className="flex gap-2 items-center">
            <div
              className=" p-1 text-gray-400 cursor-pointer hover:text-blue-700"
              onClick={() =>
                navigate(`/followers/${person.username}/${person._id}`)
              }
            >
              <span className=" font-bold mx-2 text-xl ">
                {person.followers.length}
              </span>
              Followers
            </div>
            <div
              className=" p-1 text-gray-400 cursor-pointer hover:text-blue-700"
              onClick={() =>
                navigate(`/followings/${person.username}/${person._id}`)
              }
            >
              <span className=" font-bold mx-2 text-xl">
                {person.following.length}
              </span>
              Following
            </div>
          </div>
        </div>
      </div>

      {(isLoading || isPending) && <Skele />}
      {userPosts?.length > 0 &&
        userPosts.map((post) => (
          <Postdisplayer
            key={post._id}
            post={post}
            isFollowing="false"
            userID={person._id}
          />
        ))}
    </div>
  );
}

export default ShowProfile;
