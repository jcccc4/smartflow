import { addSubtask } from "@/app/webapp/_actions/tasks";
import { OptimisticValueProp, Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";
import { startTransition } from "react";
import { v4 as uuidv4 } from "uuid";

export async function handleAddSubtask(
  optimisticTaskState: Task[],
  parentTaskId: string,
  setOptimisticTaskState: (action: OptimisticValueProp) => void
) {
  if (!canAddTaskAtLevel(optimisticTaskState, parentTaskId)) {
    alert("Cannot add subtask: Maximum nesting depth reached");
    return;
  }

  // Find the parent task to get its depth
  const parentTask = tasks.find((task) => task.id === parentTaskId);
  if (!parentTask) return;

  // Create the new subtask
  const newSubtask: Task = {
    id: uuidv4(),
    title: "",
    description: null,
    parent_task_id: parentTaskId,
    due_date: null,
    done: false,
    user_id: "pending",
    created_at: new Date().toISOString(),
    position: tasks.filter((task) => task.parent_task_id === parentTaskId)
      .length,
    depth: (parentTask.depth ?? 0) + 1,
  };

  // Update optimistic state
  startTransition(() => {
    setOptimisticTaskState({
      type: "create",
      task: newSubtask,
    });
  });
  try {
    // Make the actual API call
    await addSubtask(parentTaskId);
  } catch (error) {
    console.error("Failed to add subtask:", error);
    // You might want to add error handling here, such as rolling back the optimistic update
  }
}
