import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../../context/ProfileContex";

function SuggestionDisplayer({ suggestion, following, follow }) {
  const navigate = useNavigate();
  const { setCurrentProfile, currentProfile } = useProfileContext();
  const travel = () => {
    setCurrentProfile(suggestion._id);
    navigate("/searchuser");
  };
  return (
    <div className="my-2 p-2 border bg-slate-500  rounded-lg">
      <div className="flex items-center overflow-y-visible">
        <div className="   h-fit w-fit rounded-full select-none shrink-0">
          <img
            src={suggestion.profilePic}
            className="h-10 w-10 rounded-full border object-cover"
          ></img>
        </div>
        <div
          className="mx-1  font-semibold  tracking-wide cursor-pointer w-full  break-words text-xs h-10 flex  items-center  "
          onClick={travel}
        >
          {suggestion.username}
        </div>
      </div>
      <div className=" flex justify-center">
        {" "}
        {!following && (
          <button
            className="bg-blue-500 p-2 text-xs tracking-wide rounded-md   active:bg-green-500 hover:bg-blue-300"
            onClick={() => follow(suggestion._id)}
          >
            Follow
          </button>
        )}
        {following && (
          <button
            className="bg-red-500 p-2 text-xs tracking-wide rounded-md  active:bg-green-500 hover:bg-blue-300"
            onClick={() => follow(suggestion._id)}
          >
            Unfollow
          </button>
        )}
      </div>
    </div>
  );
}

export default SuggestionDisplayer;
