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
import React, { useState } from "react";

const Layout = () => {
  const { isCreateDialogOpen, setCreateDialog } = useCreatePostContext();
  const { authUser } = useAuthUser();

  const [textareaValue, setTextareaValue] = useState<string | null>("");

  const HandleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
    console.log(textareaValue?.length);
  };

  return (
    <div className={`flex  h-full w-full  justify-center border `}>
      {isCreateDialogOpen ? (
        <>
          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialog}>
            <DialogContent className="fixed inset-0 flex items-center justify-center z-50 flex-col bg-blue-200/20 bg-opacity-50 ">
              <DialogTitle />
              <div className="bg-black p-3 rounded-3xl max-w-xl w-full">
                <DialogClose asChild>
                  <button className="  text-white  p-2 rounded-full hover:bg-gray-800/50  ">
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
                        className="bg-transparent w-full  text-lg resize-none focus:outline-none mt-2"
                        minRows={5}
                        maxRows={20}
                        value={textareaValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          HandleTextareaInput(e)
                        }
                        placeholder="What is happening?!"
                      />
                    </div>
                    <div className="flex gap-1 p-2 items-center h-full  pb-0 border-t-2 border-gray-800/50 ">
                      <span className="rounded-full p-2 hover:bg-gray-800/70 cursor-pointer ">
                        <ImageIcon className="size-5 text-blue-400" />
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
                      <button className="bg-blue-400 rounded-full w-2/12 p-2 ml-auto hover:opacity-90">
                        Post
                      </button>
                    </div>
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
