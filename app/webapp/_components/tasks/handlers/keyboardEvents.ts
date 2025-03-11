import { createClient } from "@/utils/supabase/client";

import { createTask, deleteTask } from "@/app/webapp/_actions/tasks";
import { OptimisticValueProp, Task } from "@/lib/types";
import { startTransition } from "react";

export const handleKeyDown = async (
  e: React.KeyboardEvent<HTMLInputElement>,

  {
    editedTitle,
    taskDetails,
    setOptimisticTaskState,
  }: {
    editedTitle: string;
    taskDetails: Task;
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
      startTransition(() => {
        setOptimisticTaskState({
          type: "create",
          task: {
            ...taskDetails,
            id: Math.random(),
            title: "",
            user_id: user.id,
          },
        });
      });

      createTask("");

      break;

    case "Backspace":
      if (!editedTitle) {
        startTransition(() => {
          setOptimisticTaskState({
            type: "delete",
            task: taskDetails,
          });
        });
        deleteTask(taskDetails);
      }
      break;

    case "Escape":
      return taskDetails.title;
  }
};
