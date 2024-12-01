import { useLocation } from "react-router-dom";
import OOP from "./OOP";

const Suggestions = () => {
  const location = useLocation();
  const currentlyOn = location.pathname.split("/")[1].toLowerCase();
  return (
    <div className="  w-[23%]  hidden lg:block sticky top-0 max-h-screen p-1  ml-5  ">
      {currentlyOn !== "search" ? <OOP /> : ""}
    </div>
  );
};

export default Suggestions;
