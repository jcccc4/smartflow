import { Task, OptimisticValueProp } from "@/lib/types";
import { handleTaskHierarchy } from "@/lib/utils";

export const optimisticTaskHandler = (
  currentState: Task[],
  optimisticValue: OptimisticValueProp
) => {
  switch (optimisticValue.type) {
    // Single Operations
    case "create":
      return handleTaskHierarchy([...currentState, optimisticValue.task]);

    case "update":
      return currentState.map((task) => {
        if (task.id === optimisticValue.task.id) {
          return {
            ...task,
            ...optimisticValue.task,
          };
        }
        return task;
      });

    case "delete":
      return currentState.filter((task) => task.id !== optimisticValue.task.id);

    // Batch Operations
    case "batchCreate":
      return handleTaskHierarchy([...currentState, ...optimisticValue.tasks]);

    case "batchUpdate":
      return handleTaskHierarchy(
        currentState.map((task) => {
          const updatedTask = optimisticValue.tasks.find(
            (t) => t.id === task.id
          );
          if (updatedTask) {
            return {
              ...task,
              ...updatedTask,
            };
          }
          return task;
        })
      );

    case "batchDelete":
      const deleteIds = new Set(optimisticValue.tasks.map((task) => task.id));
      return currentState.filter((task) => !deleteIds.has(task.id));
    default:
      return currentState;
  }
};
