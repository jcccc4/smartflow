import { Task } from "@/lib/types";
import { updateTask } from "@/app/webapp/_actions/tasks";

export const debouncedTaskTitle = (updatedTask: Task) => {
  updateTask(updatedTask);
};
