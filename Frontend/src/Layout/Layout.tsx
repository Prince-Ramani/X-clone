import { useCreatePostContext } from "@/context/createPostContext";
import Sidebar from "@/Mycomponents/Sidebar/Sidebar";
import Suggestions from "@/Mycomponents/Suggestions/Suggestions";
import { Outlet } from "react-router-dom";
import CreatePostDialog from "./createPostDialog";

import MdSidebar from "@/Mycomponents/Sidebar/SmSidebar";

const Layout = () => {
  const { isCreateDialogOpen } = useCreatePostContext();

  return (
    <div className={`flex  h-full w-full  justify-center `}>
      {isCreateDialogOpen ? <CreatePostDialog /> : ""}

      <Sidebar />
      <MdSidebar />
      <main
        className={` lg:w-5/12 min-h-screen pb-14 sm:pb-0    no-scrollbar  w-full  md:w-3/5  `}
      >
        <Outlet />
      </main>
      <Suggestions />
    </div>
  );
};

export default Layout;
