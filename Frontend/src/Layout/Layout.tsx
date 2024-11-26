import Sidebar from "@/Mycomponents/Sidebar/Sidebar";
import Suggestions from "@/Mycomponents/Suggestions/Suggestions";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex  h-full w-full justify-center   ">
      <Sidebar />
      <main className="w-full min-h-screen overflow-y-auto  md:w-2/5">
        <Outlet />
      </main>
      <Suggestions />
    </div>
  );
};

export default Layout;
