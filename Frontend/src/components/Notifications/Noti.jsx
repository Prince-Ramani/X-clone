import { FaXTwitter } from "react-icons/fa6";
import { BiBell, BiHome, BiUser } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import toast from "react-hot-toast";
import Skele from "../skeletons/Skele";

function Noti() {
  const navigate = useNavigate();
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });
        const data = await res.json();
        if ("error" in data) toast.error(data.error);
        return data;
      } catch (err) {
        throw Error(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      toast.success(`Logout successfull!`);
      navigate("/signup");
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  if (isPending) {
    return <div className="skeleton h-screen w-screen"></div>;
  }

  async function logoutUser() {
    mutate();
  }

  return (
    <div className=" bg-black border-2 border-gray-600 hidden h-screen lg:block p-2 text-white sticky top-0 left  w-2/12 ">
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

      <div className=" h-fit min-w-full max-w-full mt-44 p-2 flex border-2 rounded-md justify-around   ">
        <div className="h-fit w-fit shrink-0">
          <img
            src={authuser.profilePic}
            className=" rounded-full h-10 w-10 border-2 select-none object-cover"
          />
        </div>
        <div className="h-full  w-[60%]">
          <p className="select-none break-words h-full w-full mx-1">
            {authuser.username}
          </p>
        </div>
        <div
          className=" hover:text-gray-600 shrink-0  flex justify-center items-center w-[20%]   h-fit p-2 active:text-white active:bg-green-500"
          onClick={logoutUser}
        >
          <IoIosLogOut className="h-full w-full scale-150" />
        </div>
      </div>
    </div>
  );
}

export default Noti;
