"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OptimisticValueProp, Task } from "@/lib/types";
import { WandSparkles } from "lucide-react";
import React, { JSX, useOptimistic, useState } from "react";
import AddTask from "./tasks/addTask";
import TaskItem from "./tasks/taskItem";
import { suggestSubtasks } from "../_actions/ai-tasks";
import { v4 as uuidv4 } from "uuid";

import SubtaskSuggestionCard from "./tasks/subtaskSuggestionCard";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import TestDropdown from "./tasks/testDropdown";

type Props = { taskList: Task[]; children?: React.ReactNode };
interface Suggestion {
  title: string;
  description: string;
}

const testSample: Task[] = [
  {
    id: "testId",
    parent_task_id: null,
    title: "Sample Task",
    description: "Sample Description",
    due_date: null,
    done: false,
    user_id: "pending",
    created_at: new Date().toISOString(),
  },

  {
    id: "testId2",
    parent_task_id: null,
    title: "Sample Task 2",
    description: "Sample Description",
    due_date: null,
    done: false,
    user_id: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "testId3",
    parent_task_id: null,
    title: "Sample Subtask",
    description: "Sample Description",
    due_date: null,
    done: false,
    user_id: "pending",
    created_at: new Date().toISOString(),
  },
];
export default function TaskClient({ taskList }: Props): JSX.Element {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>(testSample);
  const [optimisticTaskState, setOptimisticTaskState] = useOptimistic(
    taskList,
    (currentState: Task[], optimisticValue: OptimisticValueProp) => {
      switch (optimisticValue.type) {
        case "create":
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
        throw new Error(error.toString()); // Convert error to string
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

  return (
    <ResizablePanelGroup className="flex h-full" direction="horizontal">
      <ResizablePanel defaultSize={60} minSize={30}>
        <div className="p-4 flex-1 flex flex-col gap-0">
          {renderTaskHierarchy(optimisticTaskState)}
          <div className="px-6">
            <AddTask setOptimisticTaskState={setOptimisticTaskState} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={30}>
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

            <div className="flex flex-col p-4">
              <h3 className="font-semibold mb-4">Subtask</h3>
              <div>
                {renderTaskHierarchy(optimisticTaskState, selectedTask.id)}
              </div>
              {suggestedTasks.length !== 0 ? (
                <SubtaskSuggestionCard
                  suggestedTasks={suggestedTasks}
                  setSuggestedTasks={setSuggestedTasks}
                  setOptimisticTaskState={setOptimisticTaskState}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
