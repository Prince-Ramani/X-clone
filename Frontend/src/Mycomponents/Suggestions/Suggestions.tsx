import { Search, X } from "lucide-react";
import { useState } from "react";

const Suggestions = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="  w-[23%]  hidden lg:block sticky top-0 max-h-screen p-1  ml-5  ">
      <div
        className="flex items-center rounded-full focus-within:border group focus-within:border-blue-600 focus-within:bg-transparent   p-2 py-3 bg-gray-700/50 "
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
      >
        <Search className="size-5 mx-3 mr-4 text-gray-500 group-focus-within:text-blue-400 shrink-0" />
        <input
          className="border-white w-full border bg-transparent focus:outline-none  group border-none text-sm tracking-wide placeholder-gray-400/80"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue ? (
          <div
            className=" mx-3 w-fit h-fit shrink-0 rounded-full p-1 bg-blue-500 cursor-pointer"
            onClick={() => setSearchValue("")}
          >
            <X className="size-3  shrink-0 fill-blue-600 border-none text-black" />
          </div>
        ) : null}
      </div>
      {isSearching ? (
        <div className=" border  border-gray-800 rounded-lg min-h-[100px] shadow-sm shadow-gray-400/90 ">
          {!searchValue ? (
            <div className=" pt-5 flex justify-center items-start select-none  h-[80px] text-gray-300/90 font-thin tracking-wide   ">
              Try searching for people, lists, or keywords
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Suggestions;
