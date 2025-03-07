import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTaskDepth(tasks: Task[], taskId: number | null): number {
  // Base case: if no parent, we're at the root (depth 0)
  if (taskId === null) {
    return 0;
  }

  // Find the parent task
  const parentTask = tasks.find(task => task.id === taskId);
  
  // If no parent found, something's wrong (shouldn't happen)
  if (!parentTask) {
    return 0;
  }

  // Recursively get parent's depth and add 1
  return 1 + getTaskDepth(tasks, parentTask.parent_task_id);
}

export function canAddTaskAtLevel(tasks: Task[], parentTaskId: number | null): boolean {
  return getTaskDepth(tasks, parentTaskId) < 4;
}