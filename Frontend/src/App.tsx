import { useQuery } from "@tanstack/react-query";

import Signin from "./Mycomponents/signin/Signin";
import Signup from "./Mycomponents/singup/Signup";
import Layout from "./Layout/Layout";
import Home from "./Mycomponents/Home/Home";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuthUser } from "./context/userContext";
import Profile from "./Mycomponents/Profile/Profile";
import FollowersList from "./Mycomponents/FollowersList/FollowersList";
import FollowingList from "./Mycomponents/FollowersList/FollowingList";
import ShowPost from "./Mycomponents/ShowPost/Post";
import Notifications from "./Mycomponents/Notifications/Notifications";

function App() {
  const { setAuthUser } = useAuthUser();

  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if ("error" in data) {
        return data;
      }
      setAuthUser(data);

      return data;
    },
    refetchOnMount: true,
  });

  const isLoggedIn = data && !data.error;

  return (
    <Router>
      <Routes>
        <Route
          path="/sign-in"
          element={!isLoggedIn ? <Signin /> : <Navigate to="/home" />}
        />
        <Route
          path="/sign-up"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />}
        />
        <Route path="/" element={<Layout />}>
          <Route index element={isLoggedIn ? <Home /> : null} />
          <Route
            path="profile/:username/*"
            element={isLoggedIn ? <Profile /> : <Signup />}
          />
          <Route
            path="profile/:username/followers"
            element={isLoggedIn ? <FollowersList /> : <Signup />}
          />
          <Route
            path="profile/:username/following"
            element={isLoggedIn ? <FollowingList /> : <Signup />}
          />
          <Route
            path="profile/:username/post/:postId"
            element={isLoggedIn ? <ShowPost /> : <Signup />}
          />
          <Route
            path="notifications"
            element={isLoggedIn ? <Notifications /> : <Signup />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
