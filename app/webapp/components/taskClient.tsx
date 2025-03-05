import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/lib/types";
import React, { JSX } from "react";

type Props = { tasks: Task };

export default function TaskClient({ tasks }: Props): JSX.Element {
  return (
    <div className="p-4 flex-1">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2">
          <div className="p-3 rounded-lg flex items-center gap-3">
            <Checkbox
              id={String(task.id)}
              className="border-muted-foreground"
            />
            <label
              htmlFor={String(task.id)}
              className="font-medium cursor-pointer"
            >
              {task.title}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
