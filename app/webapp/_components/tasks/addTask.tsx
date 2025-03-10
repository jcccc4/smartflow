"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { createTask } from "../../_actions/tasks";

export default function AddTask() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      createTask(inputValue);
      setInputValue("");
    }
  };

  return (
    <div
      className={`relative rounded-md flex-1  ${
        isFocused
          ? "outline outline-1 outline-[#EBEBEB] focus-within:outline-slate-500"
          : ""
      }`}
    >
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        className={`
            w-full px-3 h-12 
            outline-none
            border-none
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
      <div
        className={`w-full h-10 p-2 flex items-center justify-end gap-2 ${
          isFocused ? "border-t border-sideline" : null
        }`}
      >
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
              onClick={() => {
                console.log("test");
                createTask(inputValue);
                setInputValue("");
                setIsFocused(false);
              }}
            >
              Add Task
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
