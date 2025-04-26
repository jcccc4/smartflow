import { Input } from "@/components/ui/input";
import { OptimisticValueProp, Task } from "@/lib/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import React, { startTransition, useState } from "react";
import { createTask } from "../../_actions/tasks";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
type Props = {
  subtasksLength: number;
  task: Task;
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
};

export default function SubtaskSuggestionItem({
  subtasksLength,
  task,
  setSuggestedTasks,
  setOptimisticTaskState,
}: Props) {
  const handleAccept = async () => {
    const subtaskToCreate = {
      ...task,
      depth: task.depth + 1,
      position: subtasksLength,
    };
    setSuggestedTasks((tasks) => tasks.filter((t) => t.id !== task.id));
    startTransition(() => {
      // Wrap optimistic update in startTransition
      setOptimisticTaskState({
        type: "create",
        task: subtaskToCreate,
      });
    });

    try {
      await createTask(subtaskToCreate);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleCancel = () => {
    setSuggestedTasks((tasks) => tasks.filter((t) => t.id !== task.id));
  };
  return (
    <div className="w-full flex items-center gap-2 group">
      <div
        key={task.id}
        data-testid={`${task.id}-task-item`}
        className={`flex flex-1 items-center gap-2 
              transition-all duration-200 ease-in-out
          `}
      >
        <div className="px-3 rounded-lg flex flex-1 items-center gap-3">
          <Checkbox id={String(task.id)} className="border-muted-foreground" />

          <Input
            type="text"
            value={task.title}
            onChange={(e) => {
              setSuggestedTasks((tasks) =>
                tasks.map((t) => {
                  if (t.id === task.id) {
                    t.title = e.target.value;
                  }
                  return t;
                })
              );
            }}
            onBlur={(e) => {
              const newText = e.target.value.trim();
              if (newText === task.title) {
                return;
              }
            }}
            className="outline-none bg-transparent flex-1 h-full p-3 pl-0 border-0"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              aria-label="Accept task"
              variant="outline"
            >
              <Check />
            </Button>
            <Button
              onClick={handleCancel}
              aria-label="Cancel task"
              variant="outline"
            >
              <X />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
