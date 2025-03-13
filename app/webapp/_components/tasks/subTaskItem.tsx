"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { Ellipsis, Eraser, GripVertical, ListTree } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import useDebounce from "@/hooks/use-debounce";
import { createTasks, deleteTask } from "../../_actions/tasks";
import { handleKeyDown } from "./handlers/keyboardEvents";
import { OptimisticValueProp, Task } from "@/lib/types";
import { debouncedTaskTitle } from "./handlers/debouncedTaskTitle";
import { Button } from "@/components/ui/button";

interface SubtaskItemProps {
  task: Task;
  setSuggestedTasks: Dispatch<SetStateAction<Task[]>>;
  setOptimisticTaskState: (value: OptimisticValueProp) => void;
  isSuggested?: boolean;
}

export default function SubtaskItem({
  task,
  setSuggestedTasks,
  setOptimisticTaskState,
}: SubtaskItemProps) {
  const [editedTitle, setEditedTitle] = useState(task.title);
  const debouncedTitle = useDebounce(editedTitle, 500); // 500ms delay

  // Add useEffect to handle debounced updates
  useEffect(() => {
    if (debouncedTitle !== task.title && debouncedTitle.trim()) {
      const updatedTask: Task = {
        ...task,
        title: debouncedTitle,
      };
      debouncedTaskTitle(updatedTask);
    }
  }, [debouncedTitle]);

  const onAccept = () => {
    setSuggestedTasks((prev) => prev.filter((t) => t.id !== task.id));
    console.log(task);
    startTransition(() => {
      setOptimisticTaskState({ type: "create", task });
    });

    createTasks(task);
  };

  return (
    <div className="w-full flex items-center gap-2 group">
      <GripVertical
        className="invisible cursor-pointer group-hover:visible"
        size={16}
      />

      <div
        key={task.id}
        className={`flex flex-1 items-center gap-2 
              transition-all duration-200 ease-in-out`}
      >
        <div className="px-3 rounded-lg flex flex-1 items-center gap-3">
          <Checkbox id={String(task.id)} className="border-muted-foreground" />

          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
            }}
            onKeyDown={(e) =>
              handleKeyDown(e, {
                editedTitle,
                task,
                setOptimisticTaskState,
              })
            }
            onBlur={(e) => {
              const newText = e.target.value.trim();
              if (newText === task.title) {
                return;
              }

              setEditedTitle(newText);
            }}
            className="outline-none bg-transparent flex-1 h-full p-3 border-0"
          />
        </div>
        {
          <Button size="sm" variant="outline" onClick={onAccept}>
            Accept
          </Button>
        }
      </div>
    </div>
  );
}
