"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OptimisticValueProp, Task } from "@/lib/types";
import { Loader2, WandSparkles } from "lucide-react";
import React, { JSX, startTransition, useOptimistic, useState } from "react";
import AddTask from "./tasks/addTask";
import TaskItem from "./tasks/taskItem";
import SubtaskItem from "./tasks/subTaskItem";
import { suggestSubtasks } from "../_actions/ai-tasks";
import { addSubtask, createTasks } from "../_actions/tasks";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = { taskList: Task[] };
interface Suggestion {
  title: string;
  description: string;
}
export default function TaskClient({ taskList }: Props): JSX.Element {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [optimisticTaskState, setOptimisticTaskState] = useOptimistic(
    taskList,
    (currentState: Task[], optimisticValue: OptimisticValueProp) => {
      switch (optimisticValue.type) {
        case "create":
          return [...currentState, optimisticValue.task];
        case "suggest-subtasks":
          return [...currentState, optimisticValue.task];
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
          return currentState.filter(
            (task) => task.id !== optimisticValue.task.id
          );
        default:
          return currentState;
      }
    }
  );

  const handleGenerateSubtasks = async () => {
    if (!selectedTask) return;

    try {
      const { suggestions, error } = await suggestSubtasks(
        selectedTask.title,
        selectedTask.description
      );

      if (error) {
        throw new Error(error);
      }
      if (suggestions) {
        const suggestedTaskByAi = suggestions.map((suggestion: Suggestion) => {
          return {
            id: uuidv4(),
            title: suggestion.title,
            description: suggestion.description,
            parent_task_id: selectedTask.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            done: false,
            due_date: null,
            user_id: "pending", // Inherit from parent task
          } as Task;
        });
        console.log(suggestedTaskByAi);
        setSuggestedTasks(suggestedTaskByAi);
      }
    } catch (error) {
      console.error("Error generating subtasks:", error);
    }
  };

  function renderTaskHierarchy(tasks: Task[], parentId: string | null = null) {
    // Get tasks that belong to current parent
    const currentLevelTasks = tasks.filter(
      (task) => task.parent_task_id === parentId
    );

    return currentLevelTasks.map((task) => (
      <div key={task.id}>
        <TaskItem
          tasks={tasks}
          task={task}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setOptimisticTaskState={setOptimisticTaskState}
        />

        <div className="pl-4">{renderTaskHierarchy(tasks, task.id)}</div>
      </div>
    ));
  }

  function renderSuggestedSubtask(suggestions: Task[]) {
    return suggestions
      .filter((task) => task.parent_task_id === selectedTask?.id)
      .map((task) => (
        <SubtaskItem
          key={task.id}
          task={task}
          setSuggestedTasks={setSuggestedTasks}
          setOptimisticTaskState={setOptimisticTaskState}
        />
      ));
  }

  const onAcceptAll = async () => {
    try {
      // Create tasks array from suggestions
      const tasksToCreate = suggestedTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || null,
        parent_task_id: task.parent_task_id,
        due_date: task.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        done: false,
        user_id: "pending",
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
      await createTasks(tasksToCreate);

      // Clear suggestions after successful creation
    } catch (error) {
      console.error("Error accepting all tasks:", error);
    }
  };
  return (
    <div className="flex h-full">
      <div className="p-4 flex-1 flex flex-col gap-0">
        {renderTaskHierarchy(optimisticTaskState)}
        <div className="px-6">
          <AddTask setOptimisticTaskState={setOptimisticTaskState} />
        </div>
      </div>
      {/* Right Sidebar - Task Details */}
      <div className="border-l border-solid w-1/3 ">
        {selectedTask ? (
          <div className="p-0">
            <header className="p-4 flex justify-between items-center border-b border-[#ebebeb]">
              <h2 className="text-xl font-semibold">{selectedTask?.title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Improve Issue
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="w-[296px]"
                    onClick={handleGenerateSubtasks}
                  >
                    <WandSparkles size={16} className="mr-2" />
                    <span>Suggest subtasks</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            <div className="p-4 border-b border-[#ebebeb]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">≡</span>
                <span className="text-sm">Add Description...</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-4">Subtask</h3>
              <div>
                {renderTaskHierarchy(optimisticTaskState, selectedTask.id)}
              </div>
              <Card className="w-[350px]">
                <CardContent>
                  {suggestedTasks
                    ? renderSuggestedSubtask(suggestedTasks)
                    : null}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={onAcceptAll}>Accept All</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
