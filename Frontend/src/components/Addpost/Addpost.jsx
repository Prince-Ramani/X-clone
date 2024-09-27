import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Skele from "../skeletons/Skele";
import { CiImageOn } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";
function Addpost() {
  const querclient = useQueryClient();
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [pContent, setpContent] = useState("");
  const [currentFile, setFile] = useState();
  const { data } = useQuery({ queryKey: ["authUser"] });
  const { mutate, isPending, isLoading } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/post/createpost", {
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
      toast.success(`Post created successfully!`);
      navigate("/");
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12  p-2">
        <Skele />
      </div>
    );
  }

  async function handleAddPost(e) {
    e.preventDefault();
    const formData = new FormData();
    const pconTrimed = pContent.trim();
    if (!pconTrimed || pconTrimed.length <= 0)
      return toast.error("A post must have some content");
    formData.append("postContent", pContent);
    if (currentFile) {
      formData.append("uploadedPhoto", currentFile);
    }
    mutate(formData);
  }

  return (
    <div className="w-screen bg-black text-white h-full min-h-screen md:w-5/12  p-2">
      <div className="border-b-2 border-blue-500 m-2 p-2 select-none ">
        Addpost
      </div>

      <div className=" h-fit w-full">
        <div className="p-1 flex items-center">
          <div className="h-10 w-10 border-2 rounded-full select-none">
            <img
              src={data.profilePic}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="mx-2 text-sm ">{data.username}</div>
        </div>

        <div className=" p-1 overflow-y-auto ">
          <textarea
            className="h-full w-full bg-transparent  text-sm p-1"
            rows={20}
            placeholder="Add something..."
            value={pContent}
            onChange={(e) => setpContent(e.target.value)}
          />
        </div>
        <div className=" flex items-center p-2 ">
          <div className="flex gap-2">
            <label htmlFor="fileuploader" className="cursor-pointer">
              <CiImageOn className="h-10 w-10 text-blue-500 hover:text-white " />
            </label>
            {currentFile?.name && (
              <div className=" flex justify-center items-center px-2">
                {currentFile.name}
                <div className="flex justify-center items-center  ml-2 w-7 h-7 ">
                  <CiCircleRemove
                    className=" text-red-500 h-full w-full hover:text-gray-300 active:text-green-500 "
                    onClick={() => setFile(null)}
                  />
                </div>
              </div>
            )}
            {!currentFile && (
              <div className=" flex justify-center items-center px-2 ">
                No file choosen
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className=" hidden"
              id="fileuploader"
            />
          </div>
        </div>
        <div className=" h-fit p-2 flex justify-end">
          <button
            className="border-2 bg-blue-500 p-2 h-12 w-[30%] rounded-md hover:bg-blue-200 active:bg-green-500"
            onClick={(e) => handleAddPost(e)}
            disabled={isPending || isLoading}
          >
            {isPending || isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Addpost;
