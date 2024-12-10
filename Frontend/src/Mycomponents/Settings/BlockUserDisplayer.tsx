import { useMutation } from "@tanstack/react-query";
import { blockUserType } from "./BlockPage";
import toast from "react-hot-toast";
import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";

const BlockUserDisplayer = memo(({ user }: { user: blockUserType }) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: blockMutation, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/blockuser/${user._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        setIsBlocked((prev) => !prev);
        setIsOpen(false);
        toast.success(data.message);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleClick = () => {
    if (isBlocked) return setIsOpen(true);

    blockMutation();
  };

  return (
    <div className="flex f-1 p-3  items-center gap-4 border-b border-gray-400/20 transition-colors  hover:bg-gray-700/20">
      {isOpen ? (
        <div className="">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="  flex items-center justify-center pb-10 min-w-full h-full    z-50 flex-col bg-blue-200/10 bg-opacity-50 ">
              <DialogTitle />
              <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px]  md:max-w-xs w-full">
                {isPending ? (
                  <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                    <Loading />
                  </div>
                ) : (
                  ""
                )}
                <DialogDescription>
                  <div className=" w-full  flex flex-col p-4 ">
                    <div className="font-bold ">
                      <div className="text-red-700 font-extrabold">Unblock</div>
                      <div className="text-white">@{user.username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      Are you sure you want to unblock {user.username}?!
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 mt-7">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={isPending}
                          onClick={() => blockMutation()}
                        >
                          Unblock
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
                </DialogDescription>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        ""
      )}

      <img
        src="https://res.cloudinary.com/dwxzguawt/image/upload/v1733826887/jws_bkunxd.png"
        className="h-10 w-10 bg-black rounded-full"
      />
      <div className="text-lg">{user.username}</div>
      <button
        className={`border rounded-full p-2 w-20 ml-auto font-semibold  ${
          isBlocked
            ? "hover:border-red-700 hover:text-red-700 hover:bg-red-500/20 transition-colors"
            : "bg-white text-black hover:bg-white/75 font-bold  "
        } group`}
        disabled={isPending}
        onClick={() => handleClick()}
      >
        {isBlocked ? (
          <>
            {" "}
            <div className={`group group-hover:hidden `}>Blocked</div>
            <div className={`hidden group-hover:block`}>Unblock</div>
          </>
        ) : (
          <div className={`${isBlocked ? "hidden" : "block "}`}>Block</div>
        )}
      </button>
    </div>
  );
});

export default BlockUserDisplayer;
