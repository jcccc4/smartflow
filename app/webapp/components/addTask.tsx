import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function AddTask() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`mt-4 relative rounded-md ${
        isFocused ? "outline outline-1 outline-[#EBEBEB] " : ""
      }`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className={`
            w-full px-3 h-12 
            outline-none
            ${isFocused ? "border-b  border-sidebar " : ""}
          `}
      />
      <div
        className={`
            absolute left-3 top-0 h-12
            flex items-center gap-2 text-muted-foreground 
            pointer-events-none 
            ${inputValue ? "opacity-0" : "opacity-100"}
          `}
      >
        <Plus className="w-4 h-4" />
        <span>Add task</span>
      </div>
      <div className="w-full h-10 p-2 flex items-center justify-end gap-2 ">
        {isFocused ? (
          <>
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => setIsFocused(false)}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              className={"transition-all duration-200 ease-in-out"}
              disabled={inputValue.length === 0}
            >
              Add Task
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
