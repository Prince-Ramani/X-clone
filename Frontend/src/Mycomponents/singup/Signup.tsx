import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, User, X } from "lucide-react";

interface signupRequirements {
  username: string;
  email: string;
  password: string;
}

function Signup() {
  const navigate = useNavigate();
  const querclient = useQueryClient();
  const [userInfo, setUserInfo] = useState<signupRequirements>({
    username: "",
    email: "",
    password: "",
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (Info: signupRequirements) => {
      try {
        const res = await fetch("/api/auth/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Info),
        });
        const data = await res.json();
        if ("error" in data) {
          toast.error(data.error);
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return;
      }
      await querclient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
      toast.success(`Welcome to X ${data.username}!`);
    },
  });

  async function handleClick(e: React.SyntheticEvent) {
    e.preventDefault();
    mutate(userInfo);
  }

  return (
    <>
      <div className="w-full h-screen   flex justify-center items-center select-none ">
        <div className="w-8/12 h-5/6  flex ">
          <div className="hidden lg:w-6/12 lg:h-full lg:flex lg:justify-center lg:items-center  ">
            <X className=" hidden h-5/6 w-7/12 lg:block " />
          </div>
          <div className="w-full h-full  lg:w-6/12 flex justify-center items-center flex-col  pb-12">
            <X className="h-20 w-20  lg:hidden " />
            <h1 className="text-5xl font-bold lg:p-3">Join us.</h1>

            <div className="w-full flex  border-2 border-white rounded-xl mt-4 max-w-xl lg:max-w-[75%] hover:border-blue-500  ">
              <User className="relative top-3 ml-2 size-5" />
              <input
                type="text"
                className="lg:w-full bg-transparent p-2 ml-1  focus:outline-none focus:border-none  w-full "
                placeholder="Enter username"
                value={userInfo.username}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, username: e.target.value })
                }
                required
              />
            </div>

            <div className="w-full  flex  border-2 border-white  rounded-xl mt-4 max-w-xl  lg:max-w-[75%] hover:border-blue-500">
              <Mail className="relative top-3 ml-2 size-5 " />
              <input
                type="email"
                className="w-full bg-transparent p-2 ml-1 focus:outline-none focus:border-none  "
                placeholder="Enter email"
                value={userInfo.email}
                required
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>

            <div className="w-full flex  border-2 border-white  rounded-xl mt-4 max-w-xl  lg:max-w-[75%]  hover:border-blue-500  ">
              <Lock className="relative top-3 ml-2 size-5" />
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
              <div className=" p-1 w-fit flex    mt-4 max-w-xl hover:border-blue-500">
                <p className="leading-tight text-sm text-red-500">
                  {data?.error}
                </p>
              </div>
            )}
            <button
              className={` max-w-xl lg:w-9/12 p-3 mt-3 rounded-3xl hover:bg-blue-300 active:bg-green-500 w-full ${
                isPending ? "bg-gray-500" : "bg-blue-600"
              }`}
              type="submit"
              onClick={(e) => handleClick(e)}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Sing up"}
            </button>
            <p className="mt-2 m-2 mb-0">Already have an account?</p>
            <Link
              to="/sign-in"
              className="max-w-xl lg:w-9/12 w-full  mt-3   flex justify-center items-center "
            >
              <button className="bg-blue-600 h-full w-full rounded-3xl p-3 hover:bg-blue-300">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
