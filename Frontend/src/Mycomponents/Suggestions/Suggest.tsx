import ShowUser from "@/customComponents/ShowUser";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UploadedByType } from "../Home/ForYou";
import { useNavigate } from "react-router-dom";

const Suggest = () => {
  const navigate = useNavigate();
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const res = await fetch("/api/suggestion");
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);
      return data;
    },
  });

  return (
    <div className="border border-gray-700/80 rounded-lg p-2 m-1 cursor-pointer flex flex-col gap-3">
      <div className="font-bold text-lg pl-2">Who to follow</div>
      <div>
        {suggestions?.map((suggestion: UploadedByType) => (
          <ShowUser suggestion={suggestion} key={suggestion._id} />
        ))}
      </div>
      <div>
        <p
          className="text-blue-400 text-sm hover:underline  "
          onClick={() => navigate(`/connect_people`)}
        >
          Show more
        </p>
      </div>
    </div>
  );
};

export default Suggest;
