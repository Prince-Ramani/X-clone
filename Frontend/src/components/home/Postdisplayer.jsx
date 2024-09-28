import { MdDelete } from "react-icons/md";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useProfileContext } from "../../context/ProfileContex";

function Postdisplayer({ post, isFollowing, followFunc, userID, isOn }) {
  //
  const { setCurrentProfile } = useProfileContext();

  var { createdAt, uploadedBy, likes, comments, uploadedPhoto } = post;
  const [isLiked, setLiked] = useState([...likes]);

  const navigate = useNavigate();
  const queryclient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  var isCreatedByUser;
  if (uploadedBy._id == userID) {
    isCreatedByUser = true;
  }
  const {
    mutate: deletePost,
    data,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/deletepost/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) return;
      toast.success(data.message);
      await queryclient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  const { mutate: likePost, data: liked } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/likepost/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) return;
      if (data.message === "Post unliked successfully!") {
        setLiked((prev) => prev.filter((per) => per != authUser._id));
      }
      if (data.message === "Post liked successfully!") {
        setLiked((prev) => [...prev, authUser._id]);
      }
      toast.success(data.message);
    },
  });

  const year = createdAt?.slice(0, 4);
  const mm = createdAt?.slice(5, 7);
  const dd = createdAt.slice(8, 10);

  function followPerson() {
    followFunc(uploadedBy._id);
  }

  async function comme() {
    navigate("/post", { state: post._id });
  }

  const ShowProfile = () => {
    setCurrentProfile(uploadedBy._id);
    navigate(`/searchuser`);
  };

  if (isPending) {
    return (
      <div className=" bg-black text-white flex flex-col gap-4  h-fit  w-full p-2 ">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
      </div>
    );
  }
  return (
    <>
      <div className=" h-fit w-full p-2 flex flex-col border-b">
        <div className="flex flex-row ">
          <div className="max-w-fit max-h-fit shirnk-0">
            <img
              src={uploadedBy.profilePic}
              className="h-12 w-12 select-none rounded-full object-cover  shrink-0  border border-gray-300"
            />
          </div>
          <div
            className="  h-fit w-fit m-1 p-2 font-bold : active:text-green-400"
            onClick={() => ShowProfile()}
          >
            <p className="select-none">{uploadedBy.username}</p>
          </div>
          <div className="px-2 pt-4 mb-1  text-xs h-fit w-fit font-bold opacity-90">
            <p className="leading-tight ">
              {dd} {mm} {year}
            </p>
          </div>
          {!isFollowing && !isCreatedByUser && followFunc && (
            <div
              className="bg-blue-600 select-none flex justify-center items-center mx-2 h-fit w-fit p-2 text-sm rounded-md cursor-pointer hover:bg-blue-400 active:bg-green-500"
              onClick={followPerson}
            >
              Follow
            </div>
          )}
          {isFollowing && !isCreatedByUser && followFunc && (
            <div
              className="bg-red-600 select-none flex justify-center items-center mx-2 h-fit w-fit p-2 text-sm rounded-md cursor-pointer hover:bg-gray-400 active:bg-orange-400"
              onClick={followPerson}
            >
              Unfollow
            </div>
          )}
          {isCreatedByUser && (
            <div
              className="ml-auto mx-1 h-fit w-10 flex justify-center items-center self-center hover:text-gray-500 text-red-500 active:text-green-500 "
              onClick={deletePost}
            >
              <MdDelete className="h-10 w-5" />
            </div>
          )}
        </div>
        <div className="max-h-fit w-full leading-tight font-light text-sm p-1 m-1 select-text opacity-90 break-words ">
          <p>{post.postContent}</p>
        </div>
        {uploadedPhoto && (
          <div className="h-fit flex flex-col w-full mt-1">
            <a href={uploadedPhoto} target="_blank">
              <img
                src={uploadedPhoto}
                className="h-full rounded-lg w-full fill select-none object-cover "
              ></img>
            </a>
          </div>
        )}

        <div className="w-full h-fit p-2 m-1 flex justify-around">
          <div
            className={` w-3/12 flex justify-center items-center opacity-80 ${
              isOn &&
              isOn == "comments" &&
              "bg-blue-700 border-2 opacity-100 rounded-md p-1"
            } hover:text-blue-500 `}
            onClick={comme}
          >
            <FaComment className=" shrink-0 " />
            <p className={`text-xs mx-1 select-none `}>{comments.length}</p>
          </div>
          <div
            className=" w-3/12 flex justify-center items-center opacity-80 "
            onClick={likePost}
          >
            <FaHeart
              className={` shrink-0 ${
                isLiked.includes(authUser._id) ? "text-pink-700" : ""
              }  `}
            />
            <p className="text-xs mx-1 select-none">{isLiked.length}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Postdisplayer;
