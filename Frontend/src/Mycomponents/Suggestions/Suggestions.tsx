import { useLocation } from "react-router-dom";
import OOP from "./OOP";
import Suggest from "./Suggest";
import Settings from "../Settings/Setting";

const Suggestions = () => {
  const location = useLocation();
  const currentlyOn = location.pathname.split("/")[1].toLowerCase();
  return (
    <div className="  w-[23%]  hidden xl:block sticky top-0 max-h-screen p-1  ml-5  ">
      {currentlyOn === "search" ? <OOP /> : ""}
      {currentlyOn === "settings" ? <Settings /> : ""}
      {currentlyOn !== "search" && currentlyOn !== "settings" ? (
        <Suggest />
      ) : (
        ""
      )}
    </div>
  );
};

export default Suggestions;
