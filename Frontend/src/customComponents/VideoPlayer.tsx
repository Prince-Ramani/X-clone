import { memo } from "react";
import Plyr from "react-plyr";
import "plyr/dist/plyr.css";

const VideoPlayer = memo(({ source }: { source: string }) => {
  return (
    <div className="mt-2 w-full h-full  border-white/10 border  rounded-md overflow-hidden  ">
      <Plyr
        type="video"
        className=" w-full h-fit object-contain    "
        url={source}
        //@ts-ignore
        options={{
          autoplay: false,
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
          loop: false,
          keyboard: { focused: true, global: true },
          settings: ["quality", "speed", "loop"],
        }}
      />
    </div>
  );
});

export default VideoPlayer;
