import Bar from "@/customComponents/Bar";

const YourAccount = () => {
  return (
    <div className="min-h-full w-full cursor-pointer  border border-gray-800 border-b-0 border-t-0 ">
      <Bar title="Your account" hideSettings={true} />
    </div>
  );
};

export default YourAccount;
