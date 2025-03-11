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
import SubtaskItem from "./tasks/subTaskItem";

type Props = { taskList: Task[] };

export default function TaskClient({ taskList }: Props): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  function renderTaskHierarchy(tasks: Task[], parentId: string | null = null) {
    // Get tasks that belong to current parent
    const currentLevelTasks = tasks.filter(
      (task) => task.parent_task_id === parentId
    );

    return currentLevelTasks.map((task) => (
      <div key={task.id}>
        <TaskItem
          tasks={tasks}
          taskDetails={task}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setOptimisticTaskState={setOptimisticTaskState}
        />

        <div className="pl-4">{renderTaskHierarchy(tasks, task.id)}</div>
      </div>
    ));
  }

  function renderSubtask() {
    return optimisticTaskState
      .filter((task) => task.parent_task_id === selectedTask?.id)
      .map((task) => (
        <SubtaskItem
          key={task.id}
          taskDetails={task}
          setOptimisticTaskState={setOptimisticTaskState}
        />
      ));
  }
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
                    Improve issue
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="w-[296px]">
                    <WandSparkles size={16} />
                    <span>Breakdown Item</span>
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

              {renderSubtask()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
