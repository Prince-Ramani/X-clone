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
import Search from "./Mycomponents/Search/Search";
import Connect from "./Mycomponents/Connect/Connect";
import NotFoundPage from "./Mycomponents/NotFound.tsx/NotFoundPage";
import Loading from "./components/ui/Loading";
import Bookmark from "./Mycomponents/Bookmarks/Bookmark";
import YourAccount from "./Mycomponents/Settings/YourAccount";
import BlockPage from "./Mycomponents/Settings/BlockPage";

function App() {
  const { setAuthUser } = useAuthUser();

  const { data, isFetching, isLoading, isPending } = useQuery({
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

  if (isPending || isFetching || isLoading) {
    return (
      <div className="h-screen flex justify-center items-center ">
        <Loading />
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/sign-in"
          element={!isLoggedIn ? <Signin /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-up"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Layout /> : <Navigate to="/sign-up" />}
        >
          <Route
            index
            element={isLoggedIn ? <Home /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="profile/:username/*"
            element={isLoggedIn ? <Profile /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="profile/:username/followers"
            element={
              isLoggedIn ? <FollowersList /> : <Navigate to="/sign-up" />
            }
          />
          <Route
            path="profile/:username/following"
            element={
              isLoggedIn ? <FollowingList /> : <Navigate to="/sign-up" />
            }
          />
          <Route
            path="profile/:username/post/:postId"
            element={isLoggedIn ? <ShowPost /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="notifications"
            element={
              isLoggedIn ? <Notifications /> : <Navigate to="/sign-up" />
            }
          />
          <Route
            path="search"
            element={isLoggedIn ? <Search /> : <Navigate to="/sign-up" />}
          />

          <Route
            path="connect_people"
            element={isLoggedIn ? <Connect /> : <Navigate to="/sign-up" />}
          />

          <Route
            path="bookmarks"
            element={isLoggedIn ? <Bookmark /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="settings"
            element={isLoggedIn ? <YourAccount /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="settings/blocked"
            element={isLoggedIn ? <BlockPage /> : <Navigate to="/sign-up" />}
          />
          <Route
            path="settings/account"
            element={isLoggedIn ? <YourAccount /> : <Navigate to="/sign-up" />}
          />
        </Route>
        <Route path="*" element={isLoggedIn ? <NotFoundPage /> : ""} />
      </Routes>
    </Router>
  );
}

export default App;
