import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { IoIosSearch, IoMdNotifications } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

function Nav() {
  const [current, setCurrent] = useState("/home");
  const { data: authuser } = useQuery({ queryKey: ["authUser"] });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const handleClick = (val) => {
    navigate(`${val}`);
    setCurrent(val);
  };
  return (
    <div className="block lg:hidden border-t  border-blue-400 border-2   fixed   w-screen left-0 right-0 md:mx-auto z-20 md:w-5/12 bg-gray-900  h-12">
      <div className=" flex justify-center items-center gap-5 h-full  rounded-tl-lg rounded-tr-lg  ">
        <div className=" px-3   rounded-md ">
          <FaHome
            className={`h-7 w-7 hover:text-blue-500 border-blue-400 active:text-green-500 ${
              current === "/home" ? "border-b" : ""
            }`}
            onClick={() => handleClick("/home")}
          />
        </div>
        <div className=" px-2  rounded-md ">
          <IoMdNotifications
            className={`h-7 w-7 hover:text-blue-500 border-blue-400 active:text-green-500 ${
              current === "/notifications" ? "border-b" : ""
            }`}
            onClick={() => handleClick("/notifications")}
          />
        </div>
        <div className=" px-2  rounded-md ">
          <IoAddSharp
            className={`h-7 w-7 hover:text-blue-500 border-blue-400 active:text-green-500 ${
              current === "/addpost" ? "border-b" : ""
            }`}
            onClick={() => handleClick("/addpost")}
          />
        </div>
        <div className=" px-2  rounded-md ">
          <IoIosSearch
            className={`h-7 w-7 hover:text-blue-500 border-blue-400 active:text-green-500 ${
              current === "/search" ? "border-b" : ""
            }`}
            onClick={() => handleClick("/search")}
          />
        </div>
        <div
          className={`h-fit w-fit  ${current === "/profile" ? "border-b" : ""}`}
          onClick={() => handleClick("/profile")}
        >
          <img
            src={authuser?.profilePic}
            className="h-8 w-8 rounded-full object-cover select-none "
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Nav;
