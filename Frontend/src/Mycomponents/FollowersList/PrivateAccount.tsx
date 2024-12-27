import { Lock } from "lucide-react";
import { memo } from "react";

const PrivateAccount = memo(() => {
  return (
    <div className=" text-gray-400  flex flex-col justify-center items-center h-[617px] gap-4 ">
      <div>
        <Lock className="size-20" />
      </div>
      <div className="text-lg">Account is private!</div>
    </div>
  );
});

export default PrivateAccount;
