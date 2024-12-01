import { UploadedByType } from "@/Mycomponents/Home/ForYou";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

const ShowUser = ({
  suggestion,
  showBio = false,
}: {
  suggestion: UploadedByType;
  showBio: boolean;
}) => {
  const navigate = useNavigate();
  const handleDivClick = (e: any) => {
    if (e.target.tagName === "DIV" && showBio) {
      navigate(`/profile/${suggestion.username}`);
    }

    e.stopPropogation();
  };
  return (
    <div
      className={`flex  gap-1 md:gap-2 p-2 select-none   ${
        showBio ? "p-4 hover:bg-white/5 transition-colors " : "p-2 "
      }
          `}
      onClick={(e: any) => handleDivClick(e)}
    >
      <img
        src={suggestion.profilePic}
        className="size-10 rounded-full object-cover "
        onClick={() => navigate(`/profile/${suggestion.username}`)}
      />
      <div className="flex flex-col w-full">
        <div className="text-sm flex w-full items-center ">
          <div className="flex flex-col ">
            <span
              className="font-bold hover:underline "
              onClick={() => navigate(`/profile/${suggestion.username}`)}
            >
              {suggestion.username}
            </span>
            <span className="text-gray-400/90 ">@{suggestion.username}</span>
          </div>
          <FollowButton
            personId={suggestion._id}
            username={suggestion.username}
            className="ml-auto text-sm font-semibold  "
          />
        </div>
        {showBio ? (
          <div className=" text-sm ">
            {suggestion.bio} Host of Lex Fridman Podcast. Interested in robots
            and humans.
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ShowUser;
