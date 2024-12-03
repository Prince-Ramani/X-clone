import { CustomButton } from "@/customComponents/customButton";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col gap-8">
      <div className="flex gap-5 text-xl md:text-2xl lg:text-3xl ">
        <div>404</div>
        <div className="border" />
        <div>Not found</div>
      </div>
      <div>The page you’re looking for doesn’t exist or has been moved.</div>
      <CustomButton className="p-2 px-10 hover:bg-purple-500/30  " href="/">
        Home
      </CustomButton>
    </div>
  );
};

export default NotFoundPage;
