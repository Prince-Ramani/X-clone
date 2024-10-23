import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../../context/ProfileContex";

function Display({ noti, following, followPerson }) {
  const { currentProfile, setCurrentProfile } = useProfileContext();
  const navigate = useNavigate();
  const { from } = noti;

  const showProfile = async () => {
    setCurrentProfile(from._id);
    navigate(`/searchuser`);
  };

  return (
    <div className="border-b m-2 p-2 h-fit ">
      <div className=" flex items-center">
        <div className="select-none shrink-0 ">
          <img
            src={from.profilePic}
            className="h-10 w-10 rounded-full border shrink-0 object-cover"
          />
        </div>
        {noti.topic == "follow" && (
          <div className="flex justify-between  w-full mx-2">
            <div
              className="mx-1 select-none  flex-1 p-1  cursor-pointer hover:text-slate-700 active:text-green-400"
              onClick={showProfile}
            >
              <span className="font-bold text-blue-500 ">{from.username} </span>
              started following you!
            </div>
            {!following && (
              <button
                className="bg-blue-500 text-sm md:h-fit p-1 px-2 md:w-fit rounded-sm hover:bg-blue-300 active:bg-green-500"
                onClick={() => followPerson(from._id)}
              >
                Follow back
              </button>
            )}
            {following && (
              <button
                className="bg-red-500 h-fit p-1 px-2 w-fit rounded-sm hover:bg-gray-500  active:bg-green-500"
                onClick={() => followPerson(from._id)}
              >
                unfollow
              </button>
            )}
          </div>
        )}
        {noti.topic == "like" && (
          <div
            className="mx-2 select-none cursor-pointer flex-1 hover:text-slate-700 "
            onClick={showProfile}
          >
            <span className="font-bold text-pink-600 "> {from.username} </span>
            liked your post!
          </div>
        )}
      </div>
    </div>
  );
}

export default Display;
