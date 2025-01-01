import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";
import { useAuthUser } from "@/context/userContext";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
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
    isProfilePage?: boolean;
  }) => {
    const queryClient = useQueryClient();
    const { authUser } = useAuthUser();

    const isHimself = authUser?._id === personId;
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data, isPending: pendingFetch } = useQuery({
      queryKey: [username, "followers"],
      queryFn: async () => {
        const res = await fetch(
          `/api/getfollowersnumbers?username=${username}`
        );
        const data = await res.json();
        if ("error" in data) toast.error(data.error);

        return data;
      },
      staleTime: 2000,

      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

    useEffect(() => {
      if (data && authUser) {
        setIsFollowing(data.includes(authUser._id));

        const includesPendingRequest = data.filter((d: any) => {
          return typeof d === "object";
        });

        if (includesPendingRequest.length > 0) {
          setRequestSent(
            includesPendingRequest[0].pendingRequest.includes(authUser._id)
          );
        } else {
          if (requestSent === true) setRequestSent(false);
        }
      }
    }, [data, authUser]);

    const { mutate: follow, isPending: pendingFollow } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/follow/${personId}`, {
          method: "POST",
        });
        const data = await res.json();

        if ("error" in data) toast.error(data.error);
        return data;
      },
      onSuccess: async (data) => {
        if ("error" in data) return;

        queryClient.invalidateQueries({
          queryKey: [username, "followers"],
        });

        setIsOpen(false);

        toast.success(data.message);
      },
    });

    const handleClick = () => {
      if (isFollowing || requestSent) return setIsOpen(true);

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
                <DialogDescription />
                <div className=" w-full  flex flex-col p-4 ">
                  <div className="font-bold">
                    <div>
                      {requestSent ? "Cancle follow request?" : "Unfollow"}
                    </div>
                    <div className="">@{username}?</div>
                  </div>
                  <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                    {requestSent
                      ? `Are you sure you want to cancle follow request sent to ${username} `
                      : "Their posts will no longer show up in your Following section. You can still view their profile, unless their posts are protected."}
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
                        {requestSent ? "Cancle Request!" : "Unfollow"}
                      </button>

                      <button
                        className={`bg-transparent  ring-1 ring-white/50 font-semibold rounded-full p-2 text-sm ${
                          pendingFollow ? "opacity-75" : "hover:bg-white/10"
                        } 
                      `}
                        disabled={pendingFollow || pendingFetch}
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

        <button
          className={`font-bold relative flex justify-center  items-center   text-black z-10 group ${
            isHimself ? "hidden" : "flex"
          }  
            
          ${
            isFollowing
              ? "bg-transparent  border w-24 text-white    xl:text-base  hover:bg-red-500/30 hover:text-red-700 hover:border-red-800"
              : requestSent
              ? "bg-blue-600 text-white font-semibold  w-28   hover:font-bold hover:border hover:text-red-600 hover:bg-transparent"
              : "bg-white text-black hover:opacity-90  "
          } text-black w-16       xl:w-24 h-8 ${className}    rounded-full`}
          disabled={pendingFollow}
          onClick={() => handleClick()}
        >
          <>
            <span
              className={`absolute opacity-100  group-hover:opacity-0 ${
                isFollowing ? " text-xs md:text-sm" : ""
              }`}
            >
              {isFollowing ? "Following" : requestSent ? "Requested" : "Follow"}
            </span>

            <span
              className={`absolute opacity-0   group-hover:opacity-100  ${
                isFollowing ? " text-base" : ""
              }
              `}
            >
              {isFollowing ? "Unfollow" : requestSent ? "Cancle" : "Follow"}
            </span>
          </>
        </button>
      </>
    );
  }
);

export default FollowButton;
