import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, ListTree, Eraser } from "lucide-react";
import React, { startTransition } from "react";
import { deleteTask } from "../../_actions/tasks";
import { handleAddSubtask } from "./handlers/subtaskHandler";
import { OptimisticValueProp, Task } from "@/lib/types";

export default function TestDropdown({
  task,
  setOptimisticTaskState,
}: {
  task: Task;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
}) {
  return (
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
        {/* <DropdownMenuItem onClick={() => handleAddSubtask(tasks, task.id)}>
            <ListTree size={16} />
            <span>Add Subtask</span>
          </DropdownMenuItem> */}
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
  );
}
