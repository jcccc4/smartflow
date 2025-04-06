import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OptimisticValueProp, Task } from "@/lib/types";
import React, { startTransition } from "react";
// import SubtaskItem from "./subTaskItem";
import { createBatchTasks, createTask } from "../../_actions/tasks";
type SubtaskSuggestionCardProps = {
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
};

export default function SubtaskSuggestionCard({
  suggestedTasks,
  setSuggestedTasks,
  setOptimisticTaskState,
}: SubtaskSuggestionCardProps) {
  function renderSuggestedSubtask(suggestions: Task[]) {
    return suggestions.map((task) => (
      <div key={task.id}>fix this</div>
      // <SubtaskItem
      //   key={task.id}
      //   task={task}
      //   setSuggestedTasks={setSuggestedTasks}
      //   setOptimisticTaskState={setOptimisticTaskState}
      // />
    ));
  }

  const onCancelAll = () => {
    setSuggestedTasks(() => []);
  };
  const onAcceptAll = async () => {
    try {
      // Create tasks array from suggestions
      const tasksToCreate = suggestedTasks.map((task, position) => ({
        id: task.id,
        title: task.title,
        description: task.description || null,
        parent_task_id: task.parent_task_id,
        due_date: task.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        done: false,
        user_id: "pending",
        position,
      }));

      // Optimistic update
      startTransition(() => {
        tasksToCreate.forEach((task) => {
          setOptimisticTaskState({
            type: "create",
            task: task,
          });
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
        {renderSuggestedSubtask(suggestedTasks)}
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
