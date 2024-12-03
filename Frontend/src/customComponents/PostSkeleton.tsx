const PostSkeleton = ({
  className,
  imageHeightClassname,
}: {
  className?: string;
  imageHeightClassname?: string;
}) => {
  return (
    <div
      className={`border-b border-gray-600/60   max-w-screen w-full h-fit  p-2 pt-3 pb-1 pr-5 flex   relative bottom-10 gap-2 ${className}`}
    >
      <div className="size-10  shrink-0  rounded-full  animate-pulse bg-white/10 " />
      <div className="flex flex-col gap-2  h-fit  w-full">
        <div className="flex gap-2">
          <div className=" w-20 sm:w-24  md:w-28 lg:w-32 xl:w-36 h-5  rounded-full animate-pulse bg-white/10 " />
          <div className=" w-20 sm:w-24  md:w-28 lg:w-32 xl:w-36 h-5  rounded-full animate-pulse bg-white/10 " />
          <div className=" w-20 sm:w-24  md:w-28 lg:w-32 xl:w-36 h-5  rounded-full animate-pulse bg-white/10 " />
        </div>
        <div
          className={` w-full animate-pulse rounded-md  h-32 bg-white/10 ${imageHeightClassname} `}
        />
        <div className="flex justify-between">
          <div className="w-20 h-5  rounded-full animate-pulse bg-white/10 " />
          <div className="w-20 h-5  rounded-full animate-pulse bg-white/10 " />

          <div className="flex gap-1 p-1">
            <div className="w-7 h-5  rounded-full animate-pulse bg-white/10 " />
            <div className="w-7 h-5  rounded-full animate-pulse bg-white/10 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
