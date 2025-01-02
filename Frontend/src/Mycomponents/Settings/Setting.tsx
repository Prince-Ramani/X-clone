import Bar from "@/customComponents/Bar";
import SettingDisplayer from "./SettingDisplayer";

const Settings = () => {
  const settingArr = [
    {
      title: "Your account",
      href: "/settings/account",
    },
    {
      title: "Delete account",
      href: "/settings/deleteaccount",
    },
    {
      title: "Blocked users",
      href: "/settings/blocked",
    },
  ];
  return (
    <div className="min-h-full w-full cursor-pointer   border-gray-800 border-r  lg:relative right-6 ">
      <Bar title="Settings" hideSettings={true} />
      <div className=" flex flex-col  mt-4">
        {settingArr.map((setting) => (
          <SettingDisplayer
            key={setting.href}
            title={setting.title}
            href={setting.href}
          />
        ))}
      </div>
    </div>
  );
};

export default Settings;
