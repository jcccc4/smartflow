import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleTaskHierarchy = (
  tasks: Task[],
  parentTaskId: string | null = null
) => {
  const childTasks = tasks
    .filter((task) => task.parent_task_id === parentTaskId)
    .sort((taskA, taskB) => taskA.position - taskB.position);

  if (childTasks.length === 0) {
    return [];
  }

  return childTasks.reduce<Task[]>((acc, task) => {
    acc.push(task);
    acc.push(...handleTaskHierarchy(tasks, task.id));
    return acc;
  }, []);
};

export const isTaskConnected = (
  tasks: Task[],
  taskId: string,
  activeId: string | null
): boolean => {
  if (taskId === null || activeId === null) {
    return false;
  }
  // Check if the task is a descendant of activeId
  const findParentChain = (currentId: string): boolean => {
    const task = tasks.find((t) => t.id === currentId);
    if (!task) return false;
    if (task.parent_task_id === activeId) return true;
    if (task.parent_task_id === null) return false;
    return findParentChain(task.parent_task_id);
  };

  return findParentChain(taskId);
};

export function getTaskDepth(tasks: Task[], taskId: string | null): number {
  // Base case: if no parent, we're at the root (depth 0)
  if (taskId === null) {
    return 0;
  }

  // Find the parent task
  const parentTask = tasks.find((task) => task.id === taskId);

  // If no parent found, something's wrong (shouldn't happen)
  if (!parentTask) {
    return 0;
  }

  // Recursively get parent's depth and add 1
  return 1 + getTaskDepth(tasks, parentTask.parent_task_id);
}

export function canAddTaskAtLevel(
  tasks: Task[],
  parentTaskId: string | null
): boolean {
  return getTaskDepth(tasks, parentTaskId) < 4;
}
