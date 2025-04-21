import { OptimisticValueProp, Task } from "@/lib/types";
import { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/tree-item";
import { updateBatchTasks } from "../../_actions/tasks";
import { startTransition } from "react";
import { getTaskChildren } from "@/lib/utils";
function reorder(
  tasks: Task[],
  updatedTasks: Task[],
  activeTask: Task,
  parentTask: Task
) {
  if (
    activeTask.parent_task_id === parentTask.parent_task_id &&
    activeTask.position === parentTask.position
  ) {
    return;
  }

  if (activeTask.parent_task_id === parentTask.parent_task_id) {
    if (activeTask.position === parentTask.position) return;

    const minPosition = Math.min(activeTask.position, parentTask.position);
    const maxPosition = Math.max(activeTask.position, parentTask.position);

    const itemsToBeSort = tasks
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

    updatedTasks.push(...itemsToBeSort);
  } else {
    const updatedActiveTask = {
      ...activeTask,
      parent_task_id: parentTask.parent_task_id,
      depth: parentTask.depth,
      position: parentTask.position + 1,
    };
    const activeTaskChildren = getTaskChildren(tasks, activeTask.id).map(
      (task) => ({
        ...task,
        depth: task.depth + (parentTask.depth - activeTask.depth),
      })
    );

    const taskArrayFrom = tasks
      .filter(
        (task) =>
          task.parent_task_id === activeTask.parent_task_id &&
          task.id !== updatedActiveTask.id &&
          task.position > activeTask.position
      )
      .map((task) => ({
        ...task,
        position: task.position - 1,
      }));
    const taskArrayTo = tasks
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
export async function handleTaskDragAndDrop(
  instruction: Instruction,
  tasks: Task[],
  setOptimisticTaskState: (action: OptimisticValueProp) => void,
  activeTask: Task,
  overTask: Task
) {
  const updatedTasks: Task[] = [];
  if (!overTask) return;
  switch (instruction.type) {
    case "reparent":
      let parentTask: Task = overTask;
      for (
        let i = instruction.currentLevel;
        i > instruction.desiredLevel;
        i--
      ) {
        const foundParent = tasks.find(
          (task) => task.id === parentTask?.parent_task_id
        );

        if (!foundParent) {
          return;
        }
        parentTask = foundParent;
      }

      reorder(tasks, updatedTasks, activeTask, parentTask);
      break;
    case "reorder-above":
      // code block

      break;
    case "reorder-below":
      reorder(tasks, updatedTasks, activeTask, overTask);
      break;
    case "make-child":
      // code block
      break;
    case "instruction-blocked":
      return;
  }

  // if (instruction.type === "reorder-above") {
  // }

  // if (instruction.type === "reorder-below") {
  // }

  // if (instruction.type === "make-child") {
  //   const childItems = removeById(tasks, activeTask.id);
  //   const updatedActiveTask = {
  //     ...activeTask,
  //     parent_task_id: overTask.id,
  //     depth: overTask.depth + 1,
  //     position: overTask.position + 1,
  //   };
  //   const reparentItems = updateTaskPositions(
  //     tasks,
  //     overTask.id,
  //     overTask.position,
  //     activeTask.id
  //   );
  //   consoe.log([...childItems, updatedActiveTask, ...reparentItems]);
  //   updatedTasks.push(...childItems, updatedActiveTask, ...reparentItems);
  // }

  console.log(updatedTasks);
  console.log("End of Sorting");
  if (updatedTasks.length > 0) {
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
