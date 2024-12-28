import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import NotificationDisplayer from "./NotificationDisplayer";
import { NotificationsType } from "@/lib/Types";
import FollowRequest from "./FollowRequest";

const Notifications = () => {
  const { data: notifcationsArray } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(`/api/getnoti`);
      const data = await res.json();

      if ("error" in data) toast.error(data.error);
      return data;
    },
    refetchOnWindowFocus: true,
  });

  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0    ">
      <div className="font-bold text-lg p-3">Notifications</div>
      <div className="w-full hover:bg-white/20  flex flex-col justify-center items-center gap-1 border-b border-gray-600/70">
        <div className="p-1 pt-2 font-semibold ">All</div>
        <div className={`border-2 border-blue-400 w-16 rounded-full `} />
      </div>

      {notifcationsArray?.map((notification: NotificationsType) =>
        notification.topic === "followRequest" ? (
          <FollowRequest notification={notification} />
        ) : (
          <NotificationDisplayer
            notification={notification}
            key={notification._id}
          />
        )
      )}
    </div>
  );
};

export default Notifications;
