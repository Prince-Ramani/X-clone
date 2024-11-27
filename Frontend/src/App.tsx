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
            path="profile/:username"
            element={isLoggedIn ? <Profile /> : <Signup />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
