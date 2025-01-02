import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";
import Bar from "@/customComponents/Bar";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertOctagon, CircleAlert } from "lucide-react";
import { memo, useState } from "react";
import toast from "react-hot-toast";

const DeleteAccount = memo(() => {
  const querClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/deleteaccount`, {
          method: "POST",
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <>
      {isOpen ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="min-w-full h-full flex items-center justify-center pb-10    z-50  flex-col bg-blue-200/10 bg-opacity-50 ">
            <DialogTitle />
            <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px] md:max-w-xs w-full">
              {isPending ? (
                <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                  <Loading />
                </div>
              ) : (
                ""
              )}
              <DialogDescription />

              <div className=" w-full  flex flex-col p-4 gap-2 ">
                <div className="font-bold tracking-tight text-red-600 flex gap-2  items-center ">
                  <div>
                    <AlertOctagon className="size-6" />
                  </div>
                  <div className="text-xl">Delete Post</div>
                </div>
                <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                  When you delete a account, it will be permanently removed from
                  server and cannot be retrieved.
                </div>

                <div>
                  <div className="flex flex-col gap-2 mt-7">
                    <button
                      className={`bg-red-600 text-white  font-semibold rounded-full p-2 text-sm ${
                        isPending ? "opacity-75" : "hover:opacity-90"
                      }  `}
                      disabled={isPending}
                      onClick={() => mutate()}
                    >
                      Delete Account
                    </button>

                    <button
                      className={`bg-transparent  ring-1 ring-white/50 font-semibold rounded-full p-2 text-sm ${
                        isPending ? "opacity-75" : "hover:bg-white/10"
                      } 
                      `}
                      disabled={isPending}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Cancle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
      <div className="min-h-full w-full cursor-pointer   border border-gray-800 border-b-0 border-t-0 ">
        <Bar title="Delete account" hideSettings={true} />
        <div className="border-t border-gray-400/30 p-2 flex flex-col gap-10">
          <p className="text-red-600 tracking-wide leading-relaxed">
            <span className="underline underline-offset-4">Warning:</span> Once
            you delete your account, it will be permanently removed and cannot
            be recovered. Please ensure you have saved any important information
            before proceeding. All posts , bookmarks, followings , followers
            will be removed permanently!
          </p>
          <div className=" p-2 items-center justify-center flex ">
            <button
              className="p-3 bg-red-600 rounded-md flex gap-3 font-bold hover:opacity-90 active:bg-white/20 "
              onClick={() => setIsOpen(true)}
            >
              <CircleAlert />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

export default DeleteAccount;
