import { ArrowLeft, Settings } from "lucide-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

interface BarProps {
  title: string;
  href?: string;
}

const Bar = memo(({ title, href }: BarProps) => {
  const navigate = useNavigate();
  const handlBackButtonClick = () => {
    if (href) {
      return navigate(`${href}`);
    }
    navigate(-1);
  };
  return (
    <div className="h-12  flex items-center  backdrop-blur-lg z-20   bg-black/70  sticky top-0 px-2 gap-4 ">
      <div>
        <button
          className=" rounded-full p-1 hover:bg-gray-500/20 transition-colors "
          onClick={() => handlBackButtonClick()}
        >
          <ArrowLeft className="size-5" />
        </button>
      </div>
      <div className="font-bold text-lg tracking-wide">{title}</div>
      <div className="ml-auto h-fit w-fit  rounded-full p-2 hover:bg-white/10">
        <Settings className="size-5" />
      </div>
    </div>
  );
});

export default Bar;
