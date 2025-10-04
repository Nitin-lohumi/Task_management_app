import React, { useState } from "react";
import { toast } from "react-toastify";

export const Tags = React.memo(
  ({ tags, setTags }: { tags: string[]; setTags: (t: string[]) => void }) => {
    const [input, setInput] = useState("");
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && input.trim() !== "") {
        if (tags?.length > 2) {
          toast.info("Cannot use more then 3 tags");
          return;
        }
        if (input.length > 12) {
          return toast.info("tag should not to longer keep in max 12 letter");
        }
        e.preventDefault();
        if (!tags.includes(input.trim())) {
          setTags([...tags, input.trim()]);
        }
        setInput("");
      }
    };
    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div className="border  border-gray-300 rounded-md p-2 flex  flex-row flex-wrap gap-2 mt-2 mb-2">
        {tags?.length
          ? tags.map((tag, i) => (
              <div
                key={i}
                className="bg-green-400/80 w-fit flex text-white px-3 py-1 rounded-full 
          items-center justify-evenly gap-1"
              >
                <div>
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-white font-bold hover:text-gray-200 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          : ""}
        <div className="flex w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter tag & press Enter"
            className="flex-1 border-none outline-none p-1 min-w-[120px]"
          />
        </div>
      </div>
    );
  }
);
