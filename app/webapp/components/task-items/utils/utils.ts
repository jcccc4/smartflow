import { createClient } from "@/utils/supabase/client";
import { addSubtask, addTask, handleUpdate } from "../../../actions/actions";
import { Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";

export const updateTaskTitle = (
  taskDetails: Task,
  debouncedTitle: string,
  setSelectedTask?: (task: Task) => void
) => {
  const updatedTask: Task = {
    ...taskDetails,
    title: debouncedTitle,
  };

  handleUpdate(updatedTask);
  setSelectedTask?.(updatedTask);
};

export const handleKeyDown = async (
  e: React.KeyboardEvent<HTMLInputElement>,
  {
    editedTitle,
    taskDetails,
    setSelectedTask,
  }: {
    editedTitle: string;
    taskDetails: Task;
    setSelectedTask?: (task: Task) => void;
  }
) => {
  switch (e.key) {
    case "Enter":
      e.preventDefault();
      if (editedTitle.trim()) {
        const {
          data: { user },
        } = await createClient().auth.getUser();

        if (!user?.id) {
          console.error("No user found");
          return;
        }
        updateTaskTitle(taskDetails, editedTitle, setSelectedTask);
        addTask("", taskDetails.parent_task_id);
      }
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

export async function handleAddSubtask(tasks: Task[], parentTaskId: number) {
  if (!canAddTaskAtLevel(tasks, parentTaskId)) {
    alert("Cannot add subtask: Maximum nesting depth reached");
    return;
  }
  addSubtask(parentTaskId);
}
