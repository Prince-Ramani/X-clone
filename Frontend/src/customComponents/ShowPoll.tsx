import { PostType } from "@/Mycomponents/Home/ForYou";
import { useMutation, useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomTooltip from "./ToolTip";
import { ChevronDown } from "lucide-react";

const ShowPoll = memo(
  ({
    post,
    authUserId,
  }: {
    post: PostType;
    authUserId: string | undefined | null;
  }) => {
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | undefined>(
      undefined
    );
    const [isCollpased, setIsCollapsed] = useState<boolean>(false);

    const { mutate: answerPoll } = useMutation({
      mutationFn: async (answerNumber: number) => {
        const res = await fetch(`/api/post/answerpoll/${post._id}`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answerNumber }),
        });
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        setSelectedOption(answerNumber);
        setHasAnswered(true);

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return;
        toast.success(data.message);
      },
    });

    const { data: pollResultCount } = useQuery({
      queryKey: [post._id, "PollResult"],
      queryFn: async () => {
        const res = await fetch(`/api/post/getpollresult/${post._id}`);
        const data = await res.json();
        if ("error" in data) return toast.error(data.error);
        return data;
      },
      enabled: hasAnswered && post.type === "poll",
    });

    const submitPollAnswer = (answerNumber: number) => {
      if (hasAnswered) return toast.error("Aleardy answered!");

      answerPoll(answerNumber);
    };

    useEffect(() => {
      if (post?.answeredBy && authUserId) {
        const userHasAnswered = post.answeredBy.filter(
          (entry) => entry.userAnswered === authUserId
        );

        if (userHasAnswered.length > 0) {
          setHasAnswered(true);
          setSelectedOption(userHasAnswered[0].optionSelected);
        }
      }
    }, [post, authUserId]);

    return (
      <div className="w-full   rounded-xl mt-2 ">
        <div
          className={`text-xs  text-gray-400/70 pl-3 ${
            pollResultCount ? "block" : "hidden"
          } `}
        >
          Total votes : {pollResultCount?.totalVotes || 0}
        </div>
        <div className="p-2 flex rounded-xl  ">
          <div className="flex flex-col gap-2 w-full">
            {post.options?.map((option, index) => (
              <span
                className={`relative rounded-lg    flex bg-slate-100/10 ${
                  hasAnswered ? "" : "hover:bg-white/20"
                }  `}
                onClick={() => submitPollAnswer(index)}
                key={index + 1}
              >
                <span
                  className={`h-10 rounded-lg animate-in transition-all animate-out  duration-700    ${
                    selectedOption === index ? "bg-blue-500  " : "bg-red-500"
                  }`}
                  style={{
                    width: `${pollResultCount?.arr[index] || 0}%`,
                  }}
                ></span>

                <span
                  className={`absolute left-2  top-2.5 sm:top-3  text-sm sm:text-base   bg-transparent  text-white ${
                    hasAnswered && selectedOption && selectedOption === index
                      ? "font-semibold break-all"
                      : ""
                  }`}
                >
                  {pollResultCount?.arr ? (
                    <span className="font-bold pr-3  ">
                      {Math.round(pollResultCount?.arr[index])}%
                    </span>
                  ) : (
                    ""
                  )}
                  {option}
                </span>
              </span>
            ))}
          </div>
        </div>
        {hasAnswered && (!!post.explanation || !!post.explanationImage) ? (
          <div className="  rounded-md mt-4  p-2 ease-in-out transition-all duration-700 animate-in animate-out   bg-slate-800 text-slate-300 flex flex-col gap-2   ">
            <div className=" flex items-center">
              <div className="font-bold sm:tracking-wide underline underline-offset-2 ">
                Explanation:
              </div>
              <CustomTooltip title={isCollpased ? "Expland" : "Collapse"}>
                <div
                  className="ml-auto "
                  onClick={() => setIsCollapsed((prev) => !prev)}
                >
                  <ChevronDown
                    className={`hover:bg-white/20 rounded-full p-1 size-7 animate-in animate-out transition-all duration-300 active:text-blue-700 ${
                      isCollpased ? "" : "rotate-180"
                    } `}
                  />
                </div>
              </CustomTooltip>
            </div>
            {post.explanation && isCollpased ? (
              ""
            ) : (
              <p className="text-xs sm:text-sm tracking-wide  ">
                {post.explanation}
              </p>
            )}
            {post.explanationImage && !isCollpased ? (
              <a
                className="w-full rounded-md  "
                href={post.explanationImage}
                target="_blank"
              >
                <img
                  src={post.explanationImage}
                  className=" border border-gray-400/20 rounded-md max-h-[500px] w-full object-cover"
                  loading="lazy"
                />
              </a>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default ShowPoll;
