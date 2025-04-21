import { OptimisticValueProp, Task } from "@/lib/types";
import { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/tree-item";
import { updateBatchTasks } from "../../_actions/tasks";
import { startTransition } from "react";
import { getTaskChildren } from "@/lib/utils";
function reorder(
  optimisticTaskState: Task[],
  updatedTasks: Task[],
  activeTask: Task,
  parentTask: Task
) {
  console.log(activeTask);
  console.log(parentTask);
  if (
    activeTask.parent_task_id === parentTask.parent_task_id &&
    activeTask.position === parentTask.position + 1
  ) {
    return;
  }

  if (activeTask.parent_task_id === parentTask.parent_task_id) {
    if (activeTask.position === parentTask.position) return;

    const minPosition = Math.min(activeTask.position, parentTask.position);
    const maxPosition = Math.max(activeTask.position, parentTask.position);

    const itemsToBeSort = optimisticTaskState
      .filter(
        (task) =>
          task.parent_task_id === parentTask.parent_task_id &&
          task.position >= minPosition &&
          task.position <= maxPosition &&
          task.id !== parentTask.id
      )
      .map((task) => {
        if (task.id === activeTask.id)
          return {
            ...activeTask,
            position: parentTask.position + 1,
          };
        return {
          ...task,
          position:
            activeTask.position > parentTask.position
              ? task.position + 1
              : task.position - 1,
        };
      });
    console.log(itemsToBeSort);
    updatedTasks.push(...itemsToBeSort);
  } else {
    const updatedActiveTask = {
      ...activeTask,
      parent_task_id: parentTask.parent_task_id,
      depth: parentTask.depth,
      position: parentTask.position + 1,
    };
    const activeTaskChildren = getTaskChildren(
      optimisticTaskState,
      activeTask.id
    ).map((task) => ({
      ...task,
      depth: task.depth + (parentTask.depth - activeTask.depth),
    }));

    const taskArrayFrom = optimisticTaskState
      .filter(
        (task) =>
          task.parent_task_id === activeTask.parent_task_id &&
          task.position > activeTask.position
      )
      .map((task) => ({
        ...task,
        position: task.position - 1,
      }));
    const taskArrayTo = optimisticTaskState
      .filter(
        (task) =>
          task.parent_task_id === parentTask.parent_task_id &&
          task.position > parentTask.position
      )
      .map((task) => ({
        ...task,
        position: task.position + 1,
      }));
    updatedTasks.push(
      updatedActiveTask,
      ...activeTaskChildren,
      ...taskArrayFrom,
      ...taskArrayTo
    );
  }
}

function addSubtask(
  optimisticTaskState: Task[],
  updatedTasks: Task[],
  activeTask: Task,
  parentTask: Task
) {
  const updatedActiveTask = {
    ...activeTask,
    parent_task_id: parentTask.id,
    depth: parentTask.depth + 1,
    position: 0,
  };
  const activeTaskChildren = getTaskChildren(
    optimisticTaskState,
    activeTask.id
  ).map((task) => ({
    ...task,
    depth: task.depth + (parentTask.depth - activeTask.depth) + 1,
  }));

  const taskArrayFrom = optimisticTaskState
    .filter(
      (task) =>
        task.parent_task_id === activeTask.parent_task_id &&
        task.position > activeTask.position
    )
    .map((task) => ({
      ...task,
      position: task.position - 1,
    }));
  const taskArrayTo = optimisticTaskState
    .filter((task) => task.parent_task_id === parentTask.id)
    .map((task) => ({
      ...task,
      position: task.position + 1,
    }));
  updatedTasks.push(
    updatedActiveTask,
    ...activeTaskChildren,
    ...taskArrayFrom,
    ...taskArrayTo
  );
}
export async function handleTaskDragAndDrop(
  instruction: Instruction,
  optimisticTaskState: Task[],
  setOptimisticTaskState: (action: OptimisticValueProp) => void,
  activeTask: Task,
  overTask: Task
) {
  const updatedTasks: Task[] = [];
  if (!overTask) return;

  switch (instruction.type) {
    case "reparent":
      let parentTask: Task = { ...overTask };
      for (
        let i = instruction.currentLevel - 1;
        i > instruction.desiredLevel;
        i--
      ) {
        const foundParent = optimisticTaskState.find(
          (task) => task.id === parentTask?.parent_task_id
        );

        if (!foundParent) {
          return;
        }
        parentTask = foundParent;
      }

      reorder(optimisticTaskState, updatedTasks, activeTask, parentTask);
      break;
    case "reorder-above":
      // code block

      break;
    case "reorder-below":
      addSubtask(optimisticTaskState, updatedTasks, activeTask, overTask);
      break;
    case "make-child":
      // code block
      break;
    case "instruction-blocked":
      return;
  }

  console.log(updatedTasks);
  console.log("End of Sorting");
  if (updatedTasks.length > 0) {
    console.log("State before update:", [...optimisticTaskState]);
    startTransition(() => {
      setOptimisticTaskState({
        type: "batchUpdate",
        tasks: updatedTasks,
      });
    });

    // Server update using updateBatchTasks
    try {
      const { error } = await updateBatchTasks(updatedTasks);
      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error updating task positions:", error);
    }
  }
}
