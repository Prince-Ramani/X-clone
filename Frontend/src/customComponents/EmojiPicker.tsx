import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
const EmojiPicker = ({
  onSelect,
  isOpen,
}: {
  onSelect: any;
  isOpen: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="absolute h-[300px] -left-[140px] sm:-left-0  w-fit overflow-y-scroll no-scrollbar top-10"
      onClick={(e) => e.stopPropagation()}
    >
      <Picker data={data} onEmojiSelect={onSelect} />
    </div>
  );
};

export default EmojiPicker;
