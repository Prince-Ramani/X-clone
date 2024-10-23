import { FaXTwitter } from "react-icons/fa6";
import { BiBell, BiHome, BiUser } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useAuthUserContext } from "../../context/AuthUserContext";

function Noti() {
  const navigate = useNavigate();

  const { authUser } = useAuthUserContext();

  return (
    <div className=" bg-black border  border-white/30   rounded-tl-lg  rounded-bl-lg ml-auto border-gray-600 hidden h-screen lg:block  p-2 text-white sticky top-0 left  w-2/12 ">
      <div className=" p-2 m-1">
        <FaXTwitter className="h-10 w-10 " />
      </div>

      <div className="flex flex-col gap-2 p-1  m-1 h-fit">
        <div
          className=" flex justify-around p-2 hover:text-green-700"
          onClick={() => {
            navigate("/home");
          }}
        >
          <div className="flex  justify-center items-center w-[50%]">
            <BiHome className=" text-xl shrink-0" />
          </div>
          <div className=" w-full  mx-1 p-1">
            <p className="select-none text-lg">Home</p>
          </div>
        </div>
        <div
          className=" flex justify-around p-2 hover:text-green-700"
          onClick={() => navigate("/search")}
        >
          <div className="flex  justify-center items-center w-[50%]">
            <IoIosSearch className=" text-xl shrink-0" />
          </div>
          <div className=" w-full  mx-1 p-1 ">
            <p className="select-none text-lg">Search</p>
          </div>
        </div>
        <div
          className=" flex justify-around p-2 hover:text-green-700"
          onClick={() => navigate("/notifications")}
        >
          <div className="flex  justify-center items-center w-[50%]">
            <BiBell className=" text-xl shrink-0" />
          </div>
          <div className=" w-full  mx-1 p-1 ">
            <p className="select-none text-lg">Notifications</p>
          </div>
        </div>
        <div
          className=" flex justify-around p-2 hover:text-green-700"
          onClick={() => navigate("/profile")}
        >
          <div className="flex  justify-center items-center w-[50%]">
            <BiUser className=" text-xl shrink-0" />
          </div>
          <div className=" w-full  mx-1 p-1">
            <p className="select-none text-lg">Profile</p>
          </div>
        </div>

        <div
          className=" flex justify-around p-2 hover:text-green-700"
          onClick={() => {
            navigate("/addpost");
          }}
        >
          <div className="flex  justify-center items-center w-[50%]">
            <IoAddSharp className=" text-2xl shrink-0" />
          </div>
          <div className=" w-full  mx-1 p-1">
            <p className="select-none text-lg">Add post</p>
          </div>
        </div>
      </div>

      <div
        className=" h-fit min-w-full max-w-full p-2 flex border-2 rounded-md justify-around mt-auto hover:bg-slate-900"
        onClick={() => navigate("/profile")}
      >
        <div className="h-fit w-fit shrink-0">
          <img
            src={authUser.profilePic}
            className=" rounded-full h-10 w-10 border-2 select-none object-cover"
          />
        </div>
        <div className="h-full  w-[60%]">
          <p className="select-none break-words h-full w-full mx-1">
            {authUser.username}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Noti;
