import { useCreatePostContext } from "@/context/createPostContext";
import Sidebar from "@/Mycomponents/Sidebar/Sidebar";
import Suggestions from "@/Mycomponents/Suggestions/Suggestions";
import { Outlet } from "react-router-dom";
import CreatePostDialog from "./createPostDialog";
import { useReplyDialogContext } from "@/context/ReplyPostContext";
import ReplyDialog from "./CommentDialog";
import { useEditProfileContext } from "@/context/EditProfileContext";
import EditProfileDialog from "@/Layout/EditProfileDialog";
import { useUnfollowContext } from "@/context/UnfollowContext";
import UnfollowDialog from "./UnfollowDialog";
import { useDeletePostContext } from "@/context/DeletePostContext";
import DeleteDialog from "./DeleteDialog";

const Layout = () => {
  const { isCreateDialogOpen } = useCreatePostContext();
  const { isReplyDialogOpen } = useReplyDialogContext();
  const { isEditProfileDialogOpen } = useEditProfileContext();
  const { isUnfollowContextOpen } = useUnfollowContext();
  const { isDeleteContextOpen } = useDeletePostContext();

  return (
    <div className={`flex  h-full w-full  justify-center `}>
      {isCreateDialogOpen ? <CreatePostDialog /> : ""}
      {isReplyDialogOpen ? <ReplyDialog /> : ""}
      {isEditProfileDialogOpen ? <EditProfileDialog /> : ""}
      {isUnfollowContextOpen ? <UnfollowDialog /> : ""}
      {isDeleteContextOpen ? <DeleteDialog /> : ""}

      <Sidebar />
      <main
        className={` lg:w-5/12 min-h-screen    no-scrollbar  w-full  md:w-3/5  `}
      >
        <Outlet />
      </main>
      <Suggestions />
    </div>
  );
};

export default Layout;
