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
    <button
      className="absolute h-[300px] -left-[140px] sm:-left-0 z-10  w-fit overflow-y-scroll no-scrollbar top-10"
      onClick={(e) => e.stopPropagation()}
    >
      <Picker data={data} onEmojiSelect={onSelect} />
    </button>
  );
};

export default EmojiPicker;
