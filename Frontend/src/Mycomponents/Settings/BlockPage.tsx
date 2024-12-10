import Bar from "@/customComponents/Bar";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import BlockUserDisplayer from "./BlockUserDisplayer";

export interface blockUserType {
  _id: string;
  username: string;
}

const BlockPage = () => {
  const { data: blockedUsers } = useQuery({
    queryKey: ["Blocks"],
    queryFn: async () => {
      const res = await fetch("/api/totalblocks");
      const data = await res.json();
      if ("error" in data) return toast.error(data.error);
      console.log(data);
      return data;
    },
  });
  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0 ">
      <Bar title="Blocked" hideSettings={true} />
      <div className="w-full hover:bg-white/20  flex flex-col justify-center items-center gap-1 border-b border-gray-600/70">
        <div className="p-1 pt-2 font-semibold ">Blocked users</div>
        <div className={`border-2 border-blue-400 w-28 rounded-full `} />
      </div>

      {blockedUsers?.blocked.map((user: blockUserType) => (
        <BlockUserDisplayer user={user} />
      ))}
    </div>
  );
};

export default BlockPage;
