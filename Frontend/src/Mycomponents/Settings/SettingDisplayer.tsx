import { ChevronRight } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SettingDisplayerProps {
  title: string;
  href: string;
}

const SettingDisplayer = memo(({ title, href }: SettingDisplayerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentlyOn, setCurrentlyOn] = useState<string | undefined>(undefined);

  useEffect(() => {
  if (!location.pathname.split("/")[2]) return setCurrentlyOn("account");
    setCurrentlyOn(
      location.pathname.split("/")[1] + "/" + location.pathname.split("/")[2]
    );
  }, [location, navigate]);

  return (
    <div
      className={`flex items-center justify-between transition-colors ${
        currentlyOn !== href ? "hover:bg-blue-300/10" : "bg-blue-100/20"
      }`}
      onClick={() => navigate(href)}
    >
      <div className="flex">
        <div
          className={`border rounded-full border-blue-500 h-12  ${
            currentlyOn === href ? "visible" : "invisible"
          }`}
        ></div>
        <div className="  p-3">{title}</div>
      </div>
      <div className="flex h-full gap-2  items-center ">
        <div>
          <ChevronRight className="shrink-0" />
        </div>
      </div>
    </div>
  );
});

export default SettingDisplayer;
