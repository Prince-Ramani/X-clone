import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadedByType } from "../Home/ForYou";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/ui/Loading";
const ListItem = ({
  follower,
  isUserAlreadyFollowing,
  isUserHimself,
}: {
  follower: UploadedByType;
  isUserAlreadyFollowing: boolean;
  isUserHimself: boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(isUserAlreadyFollowing);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: follow, isPending: pendingFollow } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/follow/${follower._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return;
      queryClient.invalidateQueries({
        queryKey: [follower.username, "followers"],
      });
      setIsOpen(false);

      setIsFollowing((prev) => !prev);

      toast.success(data.message);
    },
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFollowing) return setIsOpen(true);

    follow();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigate(`/profile/${follower.username}`);
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
                    <div className="">@{follower.username}?</div>
                  </div>
                  <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                    Their posts will no longer show up in your Following
                    section. You can still view their profile, unless their
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

      <div
        className="flex gap-2 break-all active:bg-gray-500/20 p-2 py-4 "
        onClick={() => navigate(`/profile/${follower.username}`)}
      >
        <img
          src={follower.profilePic}
          className="size-12 shrink-0 object-cover rounded-full"
        />
        <div className=" leading-snug">
          <div
            className="font-semibold tracking-wide hover:underline decoration-white/90 decoration-[1px]"
            onClick={handleProfileClick}
          >
            {follower.username}
          </div>
          <div className="text-gray-400/70 tracking-tighter ">
            @{follower.username}
          </div>
          <div className="text-sm pt-1 ">
            {follower.bio ||
              "HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello"}
          </div>
        </div>
        <div className="ml-auto pr-2 self-center">
          {!isUserHimself ? (
            <button
              className={` font-bold relative flex justify-center items-center group  ${
                isFollowing
                  ? "bg-transparent  border w-24 text-sm text-white hover:bg-red-900/50 hover:text-red-700 hover:border-red-800"
                  : "bg-white text-black"
              } text-black w-20 h-8    rounded-full`}
              disabled={pendingFollow}
              onClick={handleButtonClick}
            >
              {" "}
              <span className={`absolute opacity-100 group-hover:opacity-0   `}>
                {isFollowing ? "Following" : "Follow"}
              </span>
              <span
                className={`absolute opacity-0  group-hover:opacity-100   `}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </span>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ListItem;
