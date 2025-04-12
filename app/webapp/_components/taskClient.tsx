"use client";

import { Task } from "@/lib/types";
import { Loader2 } from "lucide-react";
import React, { JSX, useEffect, useOptimistic, useState } from "react";
import AddTask from "./tasks/addTask";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import TaskItemList from "./tasks/taskItemList";
// import SubtaskSuggestionCard from "./tasks/subtaskSuggestionCard";
import { optimisticTaskHandler } from "./handlers/optimisticStateHandler";
import { handleTaskHierarchy } from "@/lib/utils";
import TaskDetailView from "./tasks/taskDetailView";

type Props = { tasks: Task[]; children?: React.ReactNode };

export default function TaskClient({ tasks }: Props): JSX.Element {
  const [isClient, setIsClient] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const [optimisticTaskState, setOptimisticTaskState] = useOptimistic(
    handleTaskHierarchy(tasks),
    optimisticTaskHandler
  );
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
              tasksLength={
                tasks.filter((task) => task.parent_task_id === null).length
              }
              setOptimisticTaskState={setOptimisticTaskState}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={30}>
        {selectedTask ? (
          <TaskDetailView
            selectedTask={selectedTask}
            optimisticTaskState={optimisticTaskState}
            setSelectedTask={setSelectedTask}
            setOptimisticTaskState={setOptimisticTaskState}
            suggestedTasks={suggestedTasks}
            setSuggestedTasks={setSuggestedTasks}
          />
        ) : null}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
