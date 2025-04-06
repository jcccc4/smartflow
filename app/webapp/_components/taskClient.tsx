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
import React, { JSX, useEffect, useOptimistic, useState } from "react";
import AddTask from "./tasks/addTask";
import { suggestSubtasks } from "../_actions/ai-tasks";
import { v4 as uuidv4 } from "uuid";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import TaskItemList from "./tasks/taskItemList";
import SubtaskSuggestionCard from "./tasks/subtaskSuggestionCard";
import { optimisticTaskHandler } from "./tasks/handlers/optimisticStateHandler";

type Props = { tasks: Task[]; children?: React.ReactNode };
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
    position: 0,
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
    position: 1,
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
    position: 2,
  },
];
export default function TaskClient({ tasks }: Props): JSX.Element {
  const [isClient, setIsClient] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>(testSample);

  const [optimisticTaskState, setOptimisticTaskState] = useOptimistic(
    tasks,
    optimisticTaskHandler
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
        const suggestedTaskByAi = suggestions.map(
          (suggestion: Suggestion, position) => {
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
              position,
            } as Task;
          }
        );

        setSuggestedTasks(suggestedTaskByAi);
      }
    } catch (error) {
      console.error("Error generating subtasks:", error);
    }
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }
  return (
    <ResizablePanelGroup className="flex h-full" direction="horizontal">
      <ResizablePanel defaultSize={60} minSize={30}>
        <div className="p-4 flex-1 flex flex-col gap-0">
          <TaskItemList
            tasks={optimisticTaskState}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setOptimisticTaskState={setOptimisticTaskState}
          />

          <div className="px-6">
            <AddTask
              tasks={optimisticTaskState}
              setOptimisticTaskState={setOptimisticTaskState}
            />
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
                <TaskItemList
                  tasks={optimisticTaskState}
                  parentId={selectedTask.id}
                  selectedTask={selectedTask}
                  setSelectedTask={setSelectedTask}
                  setOptimisticTaskState={setOptimisticTaskState}
                />
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
