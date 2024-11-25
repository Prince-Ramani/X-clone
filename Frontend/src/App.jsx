import { useQuery } from "@tanstack/react-query";

import Signup from "./components/singup/Signup";
import Signin from "./components/signin/Signin";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
function App() {
  const { data, isPending, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if ("error" in data) {
        return data;
      }
      await setAuthUser(data);
      return data;
    },
  });

  var isLoggedIn = data && !data.error;

  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={!isLoggedIn ? <Signin /> : null} />
        <Route path="/sign-up" element={!isLoggedIn ? <Signup /> : null} />
      </Routes>
    </Router>
  );
}

export default App;
