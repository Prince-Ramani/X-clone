import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/Loading";
import { Switch } from "@/components/ui/switch";
import { useAuthUser } from "@/context/userContext";
import Bar from "@/customComponents/Bar";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const YourAccount = memo(() => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState<boolean>(
    authUser?.accountType === "private"
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/setprivate", {
        method: "PATCH",
      });

      const data = await res.json();
      if ("error" in data) {
        toast.error(data.error);
        return null;
      }

      setIsPrivate((prev) => !prev);
      setIsOpen(false);

      return data;
    },
  });

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
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
                      <div className="text-red-700 tracking-wide text-lg  font-extrabold">
                        Hey
                      </div>
                      <div className="">@{authUser?.username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      {isPrivate
                        ? "Are you sure you want to make your account PUBLIC?! Your posts will be visible to everyone!"
                        : "Are you sure you want to make your account PRIVATE?! Your posts will only be visible to people who follows you!"}
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 mt-7">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={isPending}
                          onClick={() => mutate()}
                        >
                          {isPrivate ? "Public" : "Private"}
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

      <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0 ">
        <Bar title="Your account" hideSettings={true} />
        <div className="border-b border-gray-400/30"></div>
        <div
          className=" rounded-full m-2 bg-gray-500/20 flex group  items-center justify-between p-2 hover:bg-white/15 transition-colors "
          onClick={() => navigate(`/profile/${authUser?.username}`)}
        >
          <div className="flex gap-3 items-center  rounded-full pr-2 ">
            <img
              src={authUser?.profilePic}
              className="size-14 object-cover rounded-full "
            ></img>
            <div className="font-bold tracking-wide text-lg">
              {authUser?.username}
            </div>
          </div>
          <div className="group-hover:text-blue-500 transition-colors ">
            <ChevronRight />
          </div>
        </div>
        <div className="mt-2  ">
          <Label htmlFor="accountType" className="cursor-pointer">
            <div className=" px-4  flex justify-between items-center hover:bg-white/15  transition-colors p-2 ">
              {" "}
              <div className="text-lg p-1 font-semibold tracking-wide bg-transparent">
                Private account
              </div>{" "}
              <Switch
                id="accountType"
                className=""
                checked={isPrivate}
                onCheckedChange={() => handleClick()}
                disabled={isPending}
              />
            </div>
          </Label>
        </div>
      </div>
    </>
  );
});

export default YourAccount;
