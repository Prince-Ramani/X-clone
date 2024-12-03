import Bar from "@/customComponents/Bar";
import ShowUser from "@/customComponents/ShowUser";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UploadedByType } from "../Home/ForYou";
import Loading from "@/components/ui/Loading";

const Connect = () => {
  const { data: suggestions, isPending } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const res = await fetch("/api/suggestion?limit=50");
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-600/60 border-b-0 border-t-0">
      <Bar title="Connect" />
      <div className="border-b flex justify-center items-center border-gray-600/60">
        <div
          className={`w-full hover:bg-white/10  flex flex-col justify-center items-center gap-1 text-white`}
        >
          <div className="p-1 pt-2 font-bold tracking-tight">Who to follow</div>
          <div className={`border-2 border-blue-400 w-32 rounded-full `} />
        </div>
      </div>
      <div className="font-bold text-lg p-3">Suggested for you</div>
      {isPending ? (
        <div className=" min-h-52  w-full flex  justify-center items-center">
          <Loading />
        </div>
      ) : (
        ""
      )}

      {suggestions?.map((suggestion: UploadedByType) => (
        <ShowUser suggestion={suggestion} key={suggestion._id} showBio={true} />
      ))}
    </div>
  );
};

export default Connect;
