import { addSubtask } from "@/app/webapp/_actions/tasks";
import { Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function handleAddSubtask(tasks: Task[], parentTaskId: string) {
  if (!canAddTaskAtLevel(tasks, parentTaskId)) {
    alert("Cannot add subtask: Maximum nesting depth reached");
    return;
  }

  addSubtask({
    id: uuidv4(),
    parentTaskId, // Note the property name change
  });
}
