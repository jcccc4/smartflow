import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/lib/types";
import { Plus } from "lucide-react";
import React, { JSX } from "react";

type Props = { tasks: Task };

export default function TaskClient({ tasks }: Props): JSX.Element {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2">
          <Checkbox id={String(task.id)} />
          <label
            htmlFor={String(task.id)}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {task.title}
          </label>
        </div>
      ))}
    </div>
  );
}
