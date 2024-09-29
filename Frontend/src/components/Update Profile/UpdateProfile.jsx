import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiImageEditLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ani/Spinner";

function UpdateProfile() {
  const querclient = useQueryClient();
  const navigate = useNavigate();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const [isUsernameAvailable, setUsernameAvailable] = useState();
  const [updateInfo, setUpdateInfo] = useState({
    email: "",
    password: "",
    newpass: "",
    bio: "",
    links: "",
  });

  //update
  const {
    mutate: update,
    isPending,
    isLoading,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/user/updateprofile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateInfo),
        });
        const data = await res.json();
        if ("error" in data) toast.error(data.error);
        return data;
      } catch (err) {
        throw Error(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
      navigate("/profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updateInfo.email) {
      return toast.error("Please provide email");
    }
    if (updateInfo.email !== authuser.email) {
      return toast.error("Incorrect email!");
    }
    if (!updateInfo.password) {
      return toast.error("Please enter password!");
    }
    if (updateInfo.newpass && updateInfo.newpass.length < 6) {
      return toast.error("New password must contain more than 6 characters!");
    }
    update();
  };

  //banner upload

  const {
    mutate: uploadBanner,
    isLoading: loadingBanner,
    isPending: pendingBanner,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/user/updatebanner", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
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

  const handleBannerUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return toast.error("File doesn't exists");
    const formData = new FormData();
    formData.append("banner", file);
    uploadBanner(formData);
  };
  //prfoilepic update

  const {
    mutate: uploadPic,
    isPending: pendingPic,
    isLoading: loadingPic,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/user/updatepicture", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
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

  const handleProfileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return toast.error("File doesn't exists");
    const formData = new FormData();
    formData.append("profilePic", file);
    uploadPic(formData);
  };

  if (isPending || isLoading) {
    return (
      <div
        className={`w-screen bg-black text-white h-full min-h-screen md:w-5/12 border flex justify-center items-center  p-2 flex-col `}
      >
        <div className="p-2">Updating profile...</div>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className={`w-screen bg-black text-white h-full min-h-screen md:w-5/12  p-2 ${
        isPending || isLoading
          ? "pointer-events-none opacity-50 select-none"
          : ""
      } `}
    >
      <div className="border-b m-2  p-2">Update Profile</div>
      <div className="  px-3 ">
        <div className="  flex flex-col w-full  items-center justify-end ">
          <div className="rounded-md  w-full h-full  relative group">
            {loadingBanner || pendingBanner ? (
              <div className="skeleton h-60 w-full hover:cursor-wait"></div>
            ) : (
              <>
                <label
                  htmlFor="bannerUpload"
                  className="hover:cursor-pointer group"
                >
                  <RiImageEditLine className="absolute text-center  h-full w-full z-10  bg-zinc-700  group-hover:block group-hover:opacity-30 transition-opacity duration-500 opacity-0 rounded-sm" />
                </label>
                <input
                  type="file"
                  id="bannerUpload"
                  className="hidden"
                  accept="image/*"
                  name="banner"
                  onChange={(e) => handleBannerUpload(e)}
                />
                <img
                  src={authuser.banner}
                  className="select-none  w-full  h-fit opacity-90 -z-10 rounded-lg"
                ></img>
              </>
            )}
          </div>
          <div className=" relative z-50 h-fit w-fit   rounded-full bottom-14 group">
            {loadingPic || pendingPic ? (
              <div className="skeleton h-32 w-32 cursor-wait rounded-full"></div>
            ) : (
              <>
                <label
                  htmlFor="profilePicUpload"
                  className="hover:cursor-pointer"
                >
                  <RiImageEditLine className="absolute text-center h-full w-full p-3 z-30 bg-zinc-700 opacity-0 group-hover:block  group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
                </label>
                <input
                  type="file"
                  id="profilePicUpload"
                  className="hidden"
                  accept="image/*"
                  name="profilePic"
                  onChange={(e) => handleProfileUpload(e)}
                />
                <img
                  src={authuser.profilePic}
                  className=" w-32 h-32  rounded-full select-none object-cover  z-10 "
                ></img>
              </>
            )}
          </div>
        </div>
      </div>
      <div className=" flex flex-col items-center px-2 gap-2">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="m-2 borde-2 p-2 placeholder-black placeholder-opacity-50 w-4/5 sm:w-3/5  md:w-4/5 bg-blue-500 text-white rounded-md focus:outline-none focus:border"
          required
          placeholder="Username"
          id="username"
        />
        <label htmlFor="email">
          Email<span className="text-red-500 font-semibold">*</span>
        </label>
        <input
          type="email"
          className="m-2 borde-2 placeholder-black placeholder-opacity-50 p-2 w-4/5 sm:w-3/5  md:w-4/5 bg-blue-500 text-white rounded-md focus:outline-none focus:border"
          required
          placeholder="Email"
          id="email"
          value={updateInfo.email}
          onChange={(e) =>
            setUpdateInfo({ ...updateInfo, email: e.target.value })
          }
        />
        <label htmlFor="password">
          Password<span className="text-red-500 font-semibold">*</span>
        </label>
        <input
          type="password"
          className="m-2 borde-2 p-2 w-4/5 sm:w-3/5 placeholder-black placeholder-opacity-50 md:w-4/5 bg-blue-500 text-white rounded-md focus:outline-none focus:border"
          required
          placeholder="Current password"
          id="password"
          value={updateInfo.password}
          onChange={(e) =>
            setUpdateInfo({ ...updateInfo, password: e.target.value })
          }
        />
        <label htmlFor="newpass">New password</label>
        <input
          type="password"
          className="m-2 borde-2 p-2 w-4/5 sm:w-3/5  md:w-4/5 bg-blue-500 placeholder-black placeholder-opacity-50 text-white rounded-md focus:outline-none focus:border"
          required
          placeholder="New password"
          id="newpass"
          value={updateInfo.newpass}
          onChange={(e) =>
            setUpdateInfo({ ...updateInfo, newpass: e.target.value })
          }
        />
        <label htmlFor="bio">Bio</label>
        <textarea
          rows={5}
          className="m-2 borde-2 p-2 w-4/5 sm:w-3/5  md:w-4/5 bg-blue-500 text-white rounded-md focus:outline-none focus:border placeholder-black placeholder-opacity-50"
          required
          placeholder="New bio"
          id="bio"
          value={updateInfo.bio}
          onChange={(e) =>
            setUpdateInfo({ ...updateInfo, bio: e.target.value })
          }
        />
        <label htmlFor="socials">Socials</label>
        <textarea
          rows={3}
          className="m-2 borde-2 p-2 w-4/5 sm:w-3/5  md:w-4/5 bg-blue-500 text-white rounded-md focus:outline-none focus:border placeholder-black placeholder-opacity-50"
          required
          placeholder=" Seprate link information using (:) Seprate links using (,). Example--> Instagram : insta.com , X : x.com  "
          id="socials"
          value={updateInfo.links}
          onChange={(e) =>
            setUpdateInfo({ ...updateInfo, links: e.target.value })
          }
        />
        <div className=" m-2 p-2 w-full flex justify-center">
          <button
            className="bg-green-500 p-2 rounded-md w-3/6 h-14 hover:border-2 active:bg-blue-500 hover:bg-yellow-300"
            onClick={(e) => handleSubmit(e)}
          >
            {isLoading || isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
