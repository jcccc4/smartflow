"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { OptimisticValueProp, Task } from "@/lib/types";
import { Ellipsis, Eraser, GripVertical, ListTree } from "lucide-react";
import React, { startTransition, useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { deleteTask } from "../../_actions/tasks";
import { handleKeyDown } from "./handlers/keyboardEvents";
import { handleAddSubtask } from "./handlers/subtaskHandler";
import { debouncedTaskTitle } from "./handlers/debouncedTaskTitle";

type Props = {
  tasks: Task[];
  task: Task;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
};
export default function TaskItem({
  tasks,
  task,
  selectedTask,
  setSelectedTask,
  setOptimisticTaskState,
}: Props) {
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

  return (
    <div className="w-full flex items-center gap-2 group">
      <GripVertical
        className="invisible cursor-pointer group-hover:visible"
        size={16}
      />

      <div
        key={task.id}
        data-testid={`${task.id}-task-item`}
        className={`flex flex-1 items-center gap-2 
              transition-all duration-200 ease-in-out
              ${selectedTask?.id === task.id ? "rounded-sm bg-[#E7F0FE]" : ""}`}
        onClick={() => setSelectedTask(task)}
      >
        <div className="px-3 rounded-lg flex flex-1 items-center gap-3">
          <Checkbox id={String(task.id)} className="border-muted-foreground" />

          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => {
              const newText = e.target.value;
              const updatedTask: Task = {
                ...task,
                title: newText.trim(),
              };
              startTransition(() => {
                setOptimisticTaskState({
                  type: "update",
                  task: updatedTask,
                });
              });

              setSelectedTask(updatedTask);
              setEditedTitle(newText);
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
              const updatedTask: Task = {
                ...task,
                title: newText,
              };
              setSelectedTask(updatedTask);
              setEditedTitle(newText);
            }}
            className="outline-none bg-transparent flex-1 h-full p-3 border-0"
          />
        </div>
      </div>

      <DropdownMenu data-testid={`${task.id}-dropdown-menu`}>
        <DropdownMenuTrigger
          className="outline-none"
          data-testid={`${task.id}-dropdown-trigger`}
       
        >
          <Ellipsis
            size={16}

            // className="invisible cursor-pointer group-hover:visible "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          data-testid={`${task.id}-dropdown-menu`}
        >
          <DropdownMenuItem onClick={() => handleAddSubtask(tasks, task.id)}>
            <ListTree size={16} />
            <span>Add Subtask</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              startTransition(() => {
                setOptimisticTaskState({ type: "delete", task: task });
              });
              deleteTask(task);
            }}
          >
            <Eraser size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
