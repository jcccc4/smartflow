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
import { Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Ellipsis, Eraser, GripVertical, ListTree } from "lucide-react";
import React, { useState } from "react";

import { addSubtask, addTask, handleUpdate } from "../actions/actions";

type Props = {
  tasks: Task[];
  taskDetails: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};
export default function SubtaskItem({ tasks, taskDetails, setTasks }: Props) {
  const [editedTitle, setEditedTitle] = useState(taskDetails.title);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editedTitle.trim()) {
        const {
          data: { user },
        } = await createClient().auth.getUser();

        if (!user?.id) {
          console.error("No user found");
          return;
        }
        // Create optimistic task with use

        handleUpdate(editedTitle, taskDetails.id);
        // Create the task in database immediately instead of optimistic update
        addTask("", taskDetails.parent_task_id);
      }
    } else if (e.key === "Backspace" && !editedTitle) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskDetails.id);

        if (error) throw error;
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    } else if (e.key === "Escape") {
      setEditedTitle(taskDetails.title);
    }
  };

  async function handleAddSubtask(parentTaskId: number) {
    if (!canAddTaskAtLevel(tasks, parentTaskId)) {
      alert("Cannot add subtask: Maximum nesting depth reached");
      return;
    }
    addSubtask(parentTaskId);
  }

  const handleBlur = () => {
    if (editedTitle.trim() && editedTitle !== taskDetails.title) {
      handleUpdate(editedTitle, taskDetails.id);
    } else {
      setEditedTitle(taskDetails.title);
    }
  };
  const deleteTask = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskDetails.id);

      if (error) throw error;

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskDetails.id)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };
  return (
    <div className="w-full flex items-center gap-2 group">
      <GripVertical
        className="invisible cursor-pointer group-hover:visible"
        size={16}
      />

      <div
        key={taskDetails.id}
        className={`flex flex-1 items-center gap-2 
              transition-all duration-200 ease-in-out`}
      >
        <div className="px-3 rounded-lg flex flex-1 items-center gap-3">
          <Checkbox
            id={String(taskDetails.id)}
            className="border-muted-foreground"
          />

          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="outline-none bg-transparent flex-1 h-full p-3 border-0"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Ellipsis
            size={16}
            className="invisible cursor-pointer group-hover:visible data-[state=open]:visible"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleAddSubtask(taskDetails.id)}>
            <ListTree size={16} />
            <span>Add Subtask</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={deleteTask}>
            <Eraser size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
