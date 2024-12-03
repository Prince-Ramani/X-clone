import Loading from "@/components/ui/Loading";
import { useUnfollowContext } from "@/context/UnfollowContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const UnfollowDialog = () => {
  const {
    isUnfollowContextOpen,
    personInfo,
    setPersonInfo,
    setUnfollowContext,
  } = useUnfollowContext();

  const queryClient = useQueryClient();

  const { mutate: follow, isPending: pendingFollow } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/follow/${personInfo.personId}`, {
        method: "POST",
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;

      queryClient.invalidateQueries({
        queryKey: [personInfo.username, "followers"],
      });
      setPersonInfo(undefined);
      setUnfollowContext(false);
      queryClient.invalidateQueries({
        queryKey: [personInfo.username, "followers"],
      });

      toast.success(data.message);
    },
  });

  return (
    <Dialog open={isUnfollowContextOpen} onOpenChange={setUnfollowContext}>
      <DialogContent className="fixed inset-0 flex items-center justify-center pb-10   z-50 flex-col bg-blue-200/20 bg-opacity-50 ">
        <DialogTitle />
        <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px] md:max-w-xs w-full">
          {pendingFollow ? (
            <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
              <Loading />
            </div>
          ) : (
            ""
          )}
          <DialogDescription>
            <div className=" w-full  flex flex-col p-4 ">
              <div className="font-bold">
                <div>Unfollow</div>
                <div className="">@{personInfo.username}?</div>
              </div>
              <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                Their posts will no longer show up in your For You timeline. You
                can still view their profile, unless their posts are protected.
              </div>
              <div>
                <div className="flex flex-col gap-2 mt-7">
                  <button
                    className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                      pendingFollow ? "opacity-75" : "hover:opacity-90"
                    }  `}
                    disabled={pendingFollow}
                    onClick={() => follow()}
                  >
                    Unfollow
                  </button>

                  <button
                    className={`bg-transparent  ring-1 ring-white/50 font-semibold rounded-full p-2 text-sm ${
                      pendingFollow ? "opacity-75" : "hover:bg-white/10"
                    } 
                      `}
                    disabled={pendingFollow}
                    onClick={() => {
                      setPersonInfo(undefined);
                      setUnfollowContext(false);
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
  );
};

export default UnfollowDialog;
