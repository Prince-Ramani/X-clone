import { useMutation, useQuery } from "@tanstack/react-query";
import Display from "./display";
import toast from "react-hot-toast";
import LinesSkele from "../skeletons/LinesSekele";
import { useAuthUserContext } from "../../context/AuthUserContext";

function NotificationDisplayer() {
  const { authUser, setAuthUser } = useAuthUserContext();

  const {
    data: notifications,
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["notificationsKey"],
    queryFn: async () => {
      try {
        const res = await fetch("/user/getnoti");
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    refetchOnWindowFocus: true,
  });

  const { mutate: followPerson, data } = useMutation({
    mutationFn: async (personID) => {
      try {
        const res = await fetch(`/user/follow/${personID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if ("error" in data) {
          toast.error(data.error);
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data, personID) => {
      if ("error" in data) {
        return;
      }
      if (data.message === "unfollowed successfully") {
        await setAuthUser({
          ...authUser,
          following: authUser.following.filter((val) => val !== personID),
        });
      }
      if (data.message === "followed successfully") {
        await setAuthUser({
          ...authUser,
          following: [...authUser.following, personID],
        });
      }
      toast.success(data.message);
    },
  });

  return (
    <div className="w-screen pt-12 lg:p-2 bg-black text-white h-full min-h-screen md:w-5/12 lg:5/12 p-2">
      <div className="border-b m-3 p-1">
        <h1 className="text-xl select-none">Notifications</h1>
      </div>
      {(isPending || isLoading) && <LinesSkele />}
      {notifications?.length > 0 &&
        notifications?.map((noti) => (
          <Display
            key={noti._id}
            noti={noti}
            following={authUser.following.includes(noti.from._id)}
            followPerson={followPerson}
          />
        ))}
      {notifications?.length <= 0 && (
        <h1 className="pl-2">You dont have any new notifications</h1>
      )}
    </div>
  );
}

export default NotificationDisplayer;
