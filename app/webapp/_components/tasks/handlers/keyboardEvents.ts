import { createClient } from "@/utils/supabase/client";

import { createTasks, deleteTask } from "@/app/webapp/_actions/tasks";
import { OptimisticValueProp, Task } from "@/lib/types";
import { startTransition } from "react";
import { v4 as uuidv4 } from "uuid";

export const handleKeyDown = async (
  e: React.KeyboardEvent<HTMLInputElement>,

  {
    editedTitle,
    task,
    setOptimisticTaskState,
  }: {
    editedTitle: string;
    task: Task;
    setOptimisticTaskState: (action: OptimisticValueProp) => void;
  }
) => {
  switch (e.key) {
    case "Enter":
      e.preventDefault();

      const {
        data: { user },
      } = await createClient().auth.getUser();

      if (!user?.id) {
        console.error("No user found");
        return;
      }
      const newtask = {
        ...task,
        id: uuidv4(),
        title: "",
        user_id: user.id,
      };
      startTransition(() => {
        setOptimisticTaskState({
          type: "create",
          task: newtask,
        });
      });

      createTasks(task);

      break;

    case "Backspace":
      if (!editedTitle) {
        startTransition(() => {
          setOptimisticTaskState({
            type: "delete",
            task: task,
          });
        });
        deleteTask(task);
      }
      break;

    case "Escape":
      return task.title;
  }
};
