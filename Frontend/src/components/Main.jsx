import React, { useEffect, useState } from "react";
import Noti from "./Notifications/Noti";
import Home from "./home/Home";
import Suggestion from "./Suggestions/Suggestion";

import Addpost from "./Addpost/Addpost";

import Search from "./search/Search";
import ShowProfile from "./profile/ShowProfile";
import UserProfile from "./profile/UserProfile";
import NotificationDisplayer from "./list/NotificationDisplayer";
import ShowComment from "./Comments/ShowComment";
import UpdateProfile from "./Update Profile/UpdateProfile";

function Main(props) {
  const [currentPage, setCurrentPage] = useState();

  const set = async () => {
    setTimeout(() => {
      setCurrentPage(props.name);
    }, 0);
  };
  set();

  return (
    <div className="flex flex-row justify-center  min-w-screen">
      <Noti />
      {currentPage === "Home" ? <Home /> : ""}
      {currentPage === "Addpost" ? <Addpost /> : ""}
      {currentPage === "Notifications" ? <NotificationDisplayer /> : ""}
      {currentPage === "Profile" ? <ShowProfile /> : ""}
      {currentPage === "Searcheduser" ? <UserProfile /> : ""}
      {currentPage === "Search" ? <Search /> : ""}
      {currentPage === "Post" ? <ShowComment /> : ""}
      {currentPage === "Update" ? <UpdateProfile /> : ""}
      <Suggestion />
    </div>
  );
}

export default Main;
