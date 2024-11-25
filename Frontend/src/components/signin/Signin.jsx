import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiLock } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const querclient = useQueryClient();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { mutate, isPending, data } = useMutation({
    mutationFn: async (Info) => {
      try {
        const res = await fetch("api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Info),
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
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
      toast.success(`Welcom back ${data?.username}!`);
    },
  });
  function handleMutate(e) {
    e.preventDefault();
    mutate(userInfo);
  }
  return (
    <div className="w-full  h-full  text-white  flex justify-center items-center">
      <div className="w-8/12 h-5/6  flex ">
        <div className="hidden lg:w-6/12 lg:h-full lg:flex lg:justify-center lg:items-center  ">
          <FaXTwitter className="h-5/6 w-7/12 " />
        </div>
        <div className="w-full h-full lg:w-6/12 flex justify-center items-center flex-col  pb-12 ">
          <FaXTwitter className="h-20 w-32 lg:hidden" />
          <h1 className="md:text-4xl  text-3xl font-bold lg:p-3">
            Welcome back.
          </h1>
          <div className="w-full  flex  border-2 border-white opacity-75 rounded-xl mt-4 max-w-xl select-none hover:border-blue-500">
            <MdEmail className="relative top-3 ml-1 min-w-5 " />
            <input
              type="email"
              className="w-full bg-transparent p-2 ml-1 focus:outline-none focus:border-none "
              placeholder="Enter email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </div>

          <div className="w-full flex  border-2 border-white opacity-75 rounded-xl mt-4 max-w-xl select-none hover:border-blue-500  ">
            <CiLock className="relative top-3 ml-1 min-w-5" />
            <input
              type="password"
              className="w-full bg-transparent p-2 ml-1 focus:outline-none focus:border-none "
              placeholder="Enter password"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
          </div>
          {data?.error && (
            <div className="w-9/12 pl-1 flex  mt-4 max-w-xl ">
              <p className="text-sm text-red-500 leading-tight">{data.error}</p>
            </div>
          )}

          <button
            className={`bg-blue-600 max-w-xl lg:w-9/12 p-3 mt-3 rounded-3xl hover:bg-blue-300 w-full ${
              isPending ? "bg-gray-500" : "bg-blue-600"
            }`}
            onClick={(e) => {
              handleMutate(e);
            }}
            disabled={isPending}
          >
            {isPending ? "Loading" : "Sign in"}
          </button>
          <p className="mt-2 m-2 mb-0">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="max-w-xl lg:w-9/12   mt-3   flex justify-center items-center w-full"
          >
            <button className="bg-blue-600 h-full w-full rounded-3xl p-3 hover:bg-blue-300">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
