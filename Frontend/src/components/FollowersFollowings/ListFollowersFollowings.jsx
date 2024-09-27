import { useCallback } from "react";
import { useProfileContext } from "../../context/ProfileContex";
import { useNavigate } from "react-router-dom";

function ListFollowersFollowings({
  person,
  follow: followFunc,
  personFollowing,
  isPerson,
}) {
  const navigate = useNavigate();
  const { setCurrentProfile } = useProfileContext();

  const showProfile = useCallback(() => {
    setCurrentProfile(person._id);
    navigate(`/searchuser`);
  }, [setCurrentProfile, person._id, navigate]);

  {
    return (
      <div className="h-fit w-full  p-2 my-1 border-b select-none ">
        <div className="flex items-center">
          <div className="h-fit w-fit m-1 rounded-full border-2 shrink-0 ">
            <img
              src={person.profilePic}
              className="h-20 w-20 rounded-full select-none object-cover shrink-0"
            ></img>
          </div>
          <div
            className="h-full p-2 text-lg tracking-wide  cursor-pointer hover:text-blue-500 "
            onClick={() => {
              showProfile();
            }}
          >
            {person.username}
          </div>
          {!isPerson && (
            <button
              className={` ml-auto p-3 rounded-md mx-2 ${
                personFollowing
                  ? "bg-red-500 active:bg-red-950 hover:bg-gray-500 "
                  : "bg-blue-500 active:bg-green-500 hover:bg-blue-300  "
              }  `}
              onClick={() => followFunc(person._id)}
            >
              {!personFollowing ? "Follow" : "Unfollow"}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default ListFollowersFollowings;
