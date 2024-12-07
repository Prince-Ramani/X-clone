import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";
import { useAuthUser } from "@/context/userContext";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import toast from "react-hot-toast";

const FollowButton = memo(
  ({
    className,
    personId,
    username,
  }: {
    className?: string;
    personId: string;
    username: string;
  }) => {
    const queryClient = useQueryClient();
    const { authUser } = useAuthUser();

    const isHimself = authUser?._id === personId;
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {} = useQuery({
      queryKey: [username, "followers"],
      queryFn: async () => {
        const res = await fetch(
          `/api/getfollowersnumbers?username=${username}`
        );
        const data = await res.json();
        if ("error" in data) toast.error(data.error);
        setIsFollowing(data.includes(authUser?._id));
        return data;
      },

      refetchOnWindowFocus: false,
    });

    const { mutate: follow, isPending: pendingFollow } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/follow/${personId}`, {
          method: "POST",
        });
        const data = await res.json();

        if ("error" in data) toast.error(data.error);
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;

        queryClient.invalidateQueries({
          queryKey: [username, "followers"],
        });

        setIsOpen(false);

        toast.success(data.message);
      },
    });

    const handleClick = () => {
      if (isFollowing) return setIsOpen(true);

      follow();
    };

    return (
      <>
        {isOpen ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="  flex items-center justify-center pb-10 min-w-full h-full    z-50 flex-col bg-white/10 bg-opacity-50 ">
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
                      <div className="">@{username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      Their posts will no longer show up in your For You
                      timeline. You can still view their profile, unless their
                      posts are protected.
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
        ) : (
          ""
        )}

        <button
          className={`font-bold relative flex justify-center items-center z-10 group ${
            isHimself ? "hidden" : "flex"
          }  ${
            isFollowing
              ? "bg-transparent  border w-24    xl:text-base text-white hover:bg-red-500/30 hover:text-red-700 hover:border-red-800"
              : "bg-white text-black"
          } text-black w-16 sm:w-20     xl:w-24 h-8 ${className}    rounded-full`}
          disabled={pendingFollow}
          onClick={() => handleClick()}
        >
          <span
            className={`absolute opacity-100 group-hover:opacity-0 ${
              isFollowing ? " text-xs md:text-sm" : ""
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </span>
          <span
            className={`absolute opacity-0   group-hover:opacity-100  ${
              isFollowing ? " text-base" : ""
            }
              `}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </span>
        </button>
      </>
    );
  }
);

export default FollowButton;
