import { addSubtask } from "@/app/webapp/_actions/tasks";
import { OptimisticValueProp, Task } from "@/lib/types";
import { canAddTaskAtLevel } from "@/lib/utils";

export async function handleAddSubtask(
  optimisticTaskState: Task[],
  parentTaskId: string,
  setOptimisticTaskState: (action: OptimisticValueProp) => void
) {
  if (!canAddTaskAtLevel(optimisticTaskState, parentTaskId)) {
    alert("Cannot add subtask: Maximum nesting depth reached");
    return;
  }

  addSubtask(parentTaskId);
}
