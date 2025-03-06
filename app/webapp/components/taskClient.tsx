"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/lib/types";
import { Plus, WandSparkles } from "lucide-react";
import React, { JSX, useState } from "react";
import AddTask from "./addTask";

type Props = { tasks: Task[] };

export default function TaskClient({ tasks }: Props): JSX.Element {
  const [selectedTask, setSelectedTask] = useState<Task>();

  return (
    <div className="flex h-full">
      <div className="p-4 flex-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2 
              transition-all duration-200 ease-in-out
              ${selectedTask?.id === task.id ? "rounded-sm bg-[#b4d1fb]" : ""}`}
            onClick={() => setSelectedTask(task)}
          >
            <div className="p-3 rounded-lg flex items-center gap-3">
              <Checkbox
                id={String(task.id)}
                className="border-muted-foreground"
              />
              <label
                htmlFor={String(task.id)}
                className="font-medium cursor-pointer"
              >
                {task.title}
              </label>
            </div>
          </div>
        ))}
        <AddTask />
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

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="subtask-1"
                    className="border-muted-foreground"
                  />
                  <label htmlFor="subtask-1" className="cursor-pointer">
                    Preparation
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="subtask-2"
                    className="border-muted-foreground"
                  />
                  <label htmlFor="subtask-2" className="cursor-pointer">
                    Getting the Dog Ready
                  </label>
                </div>
              </div>

              <AddTask />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
