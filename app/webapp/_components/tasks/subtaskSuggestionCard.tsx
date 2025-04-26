import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OptimisticValueProp, Task } from "@/lib/types";
import React, { startTransition } from "react";

import { createBatchTasks } from "../../_actions/tasks";
import SubtaskSuggestionList from "./subtaskSuggestionList";
type SubtaskSuggestionCardProps = {
  tasks: Task[];
  selectedTask: Task;
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
  setSuggestingForTaskId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function SubtaskSuggestionCard({
  tasks,
  selectedTask,
  suggestedTasks,
  setSuggestedTasks,
  setOptimisticTaskState,
  setSuggestingForTaskId,
}: SubtaskSuggestionCardProps) {
  const subtasksLength = tasks.filter(
    (task) => task.parent_task_id === selectedTask.id
  ).length;
  const onCancelAll = () => {
    setSuggestedTasks(() => []);
    setSuggestingForTaskId(null);
  };
  const onAcceptAll = async () => {
    try {
      // Create tasks array from suggestions
      const tasksToCreate = suggestedTasks.map((task, index) => ({
        id: task.id,
        title: task.title,
        description: task.description || null,
        parent_task_id: task.parent_task_id,
        due_date: task.due_date || null,
        created_at: new Date().toISOString(),
        done: false,
        user_id: "pending",
        depth: selectedTask.depth + 1,
        position: subtasksLength + index,
      }));

      // Optimistic update
      startTransition(() => {
          setOptimisticTaskState({
          type: "batchCreate",
          tasks: tasksToCreate,
        });
      });
      setSuggestedTasks([]);
      // Create all tasks in database
      await createBatchTasks(tasksToCreate);

      // Clear suggestions after successful creation
    } catch (error) {
      console.error("Error accepting all tasks:", error);
    }
  };
  return (
    <Card className="w-full flex-1">
      <CardContent className="px-2">
        <SubtaskSuggestionList
          subtasksLength={subtasksLength}
          suggestedTasks={suggestedTasks}
          setSuggestedTasks={setSuggestedTasks}
          setOptimisticTaskState={setOptimisticTaskState}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onCancelAll} variant="outline">
          Cancel
        </Button>
        <Button onClick={onAcceptAll}>Accept All</Button>
      </CardFooter>
    </Card>
  );
}
