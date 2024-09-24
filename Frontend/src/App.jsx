import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Signup from "./components/singup/Signup";
import Signin from "./components/signin/Signin";
import Main from "./components/Main";

import Skele from "./components/skeletons/Skele";

function App() {
  const { data, isPending, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      return data;
    },
  });

  var isLoggedIn = data ? true : false;

  if (isLoading || isPending) {
    return (
      <div className="flex flex-row justify-center  min-w-full p-2">
        <Skele />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Home" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="/addpost"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Addpost" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Notifications" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="/profile"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Profile" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="/search"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Search" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="/searchuser"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Searcheduser" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="/post"
          element={
            !data?.error && isLoggedIn ? (
              <Main name="Post" />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        ></Route>
        <Route
          path="*"
          element={
            !data?.error && isLoggedIn ? (
              <Navigate to={"/home"} />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
