import { addSubtask } from "@/app/webapp/_actions/tasks";
import { Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";

export async function handleAddSubtask(tasks: Task[], parentTaskId: number) {
  if (!canAddTaskAtLevel(tasks, parentTaskId)) {
    alert("Cannot add subtask: Maximum nesting depth reached");
    return;
  }
  addSubtask(parentTaskId);
}
