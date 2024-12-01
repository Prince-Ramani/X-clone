import { useNavigate } from "react-router-dom";
import { UploadedByType } from "../Home/ForYou";

const SearchDisplayer = ({ person }: { person: UploadedByType }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex  gap-3 hover:bg-gray-500/20 p-3 cursor-pointer"
      onClick={() => navigate(`/profile/${person.username}`)}
    >
      <img
        src={person.profilePic}
        className="size-11 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="font-bold">{person.username}</span>
        <span className="text-gray-500 text-sm">@{person.username}</span>
      </div>
    </div>
  );
};

export default SearchDisplayer;
