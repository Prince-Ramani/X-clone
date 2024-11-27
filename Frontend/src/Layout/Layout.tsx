import Sidebar from "@/Mycomponents/Sidebar/Sidebar";
import Suggestions from "@/Mycomponents/Suggestions/Suggestions";
import { Outlet } from "react-router-dom";

import TextareaAutosize from "react-textarea-autosize";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useCreatePostContext } from "@/context/createPostContext";
import { ArrowUpDown, ImageIcon, Smile, VideoIcon, X } from "lucide-react";
import { useAuthUser } from "@/context/userContext";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Layout = () => {
  const { isCreateDialogOpen, setCreateDialog } = useCreatePostContext();
  const { authUser } = useAuthUser();

  const [textareaValue, setTextareaValue] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  //post

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/post/createpost", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      else {
        setCreateDialog(false);
        return toast.success("Post created successfully!");
      }
    },
  });

  useEffect(() => {
    if (isCreateDialogOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreateDialogOpen]);

  const handlePostSubmit = () => {
    if (textareaValue) {
      if (textareaValue.length >= 280)
        return toast.error("Post length must be less than 280 characters!");

      const formData = new FormData();

      formData.append("postContent", textareaValue);
      if (file) formData.append("uploadedPhoto", file);

      createPost(formData);
    } else {
      toast.error("Post content required!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileExists = e.target.files?.[0];
    if (fileExists) setFile(fileExists);
  };

  return (
    <div
      className={`flex  h-full w-full ${
        isCreateDialogOpen ? "fixed" : ""
      }  justify-center border  `}
    >
      {isCreateDialogOpen ? (
        <>
          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialog}>
            <DialogContent className="fixed inset-0 flex items-center pt-9 z-50 flex-col bg-blue-200/20 bg-opacity-50 ">
              <DialogTitle />
              <div className="bg-black p-3 rounded-3xl max-w-xl w-full">
                <DialogClose asChild>
                  <button
                    className="  text-white  p-2 rounded-full hover:bg-gray-800/50  "
                    onClick={() => {
                      setTextareaValue("");
                      setFile(null);
                    }}
                  >
                    <X />
                  </button>
                </DialogClose>
                <DialogDescription>
                  <div className=" w-full  flex flex-col ">
                    <div className="w-full flex gap-3 p-1">
                      <img
                        src={authUser?.profilePic}
                        className="size-10 object-cover rounded-full "
                      />
                      <TextareaAutosize
                        className="bg-transparent w-full  text-lg resize-none focus:outline-none mt-2 scro"
                        minRows={5}
                        maxRows={17}
                        value={textareaValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setTextareaValue(e.target.value)
                        }
                        ref={textareaRef}
                        placeholder="What is happening?!"
                      />
                    </div>
                    <div className="flex gap-1 p-2 items-center h-full  pb-0 border-t-2 border-gray-800/50 ">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <span className="rounded-full p-2 hover:bg-gray-800/70   cursor-pointer  ">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <ImageIcon className="size-5 text-blue-400" />
                        </label>
                      </span>
                      <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                        <VideoIcon className="size-5 text-blue-400" />
                      </span>
                      <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                        <ArrowUpDown className="size-5 text-blue-400" />
                      </span>
                      <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer">
                        <Smile className="size-5 text-blue-400" />
                      </span>
                      <div
                        className={`ml-auto lg:size-8 size-5 md:size-6 text-sm flex justify-center items-center bg-green-600 rounded-full ${
                          textareaValue && textareaValue.length >= 280
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                      >
                        {textareaValue?.length}
                      </div>
                      <button
                        className="bg-blue-400 rounded-full  w-2/12 p-2 ml-auto hover:opacity-90 active:bg-green-500"
                        onClick={() => handlePostSubmit()}
                        disabled={isPending}
                      >
                        {isPending ? "Posting..." : "Post"}
                      </button>
                    </div>
                    {file ? (
                      <div className="text-xs ml-5  w-fit p-2 flex gap-3 items-center ">
                        {file?.name}
                        <X
                          className="size-5  rounded-full  text-center cursor-pointer hover:opacity-70"
                          onClick={() => setFile(null)}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </DialogDescription>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : null}

      <Sidebar />
      <main className=" lg:w-5/12 min-h-screen overflow-y-auto w-full  md:w-3/5">
        <Outlet />
      </main>
      <Suggestions />
    </div>
  );
};

export default Layout;
