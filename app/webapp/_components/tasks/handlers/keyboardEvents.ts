import { createClient } from "@/utils/supabase/client";

import { createTask, deleteTask } from "@/app/webapp/_actions/tasks";
import { Task } from "@/lib/types";

export const handleKeyDown = async (
  e: React.KeyboardEvent<HTMLInputElement>,

  {
    editedTitle,
    taskDetails,
  }: {
    editedTitle: string;
    taskDetails: Task;
    setSelectedTask?: React.Dispatch<React.SetStateAction<Task | null>>;
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

      createTask("");

      break;

    case "Backspace":
      if (!editedTitle) {
        try {
          const { error } = await createClient()
            .from("tasks")
            .delete()
            .eq("id", taskDetails.id);

          if (error) throw error;
        } catch (err) {
          console.error("Error deleting task:", err);
        }
      }
      break;

    case "Escape":
      return taskDetails.title;
  }
};
