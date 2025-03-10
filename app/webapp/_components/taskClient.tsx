"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/lib/types";
import { WandSparkles } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import AddTask from "./tasks/addTask";
import { createClient } from "@/utils/supabase/client";
import TaskItem from "./tasks/taskItem";
import SubtaskItem from "./tasks/subTaskItem";

type Props = { taskList: Task[] };

export default function TaskClient({ taskList }: Props): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(taskList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select()
          .order("created_at", { ascending: true });
        console.log("data", data);
        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    const channelA = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        () => {
          console.log("test");
          fetchTasks();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channelA);
    };
  }, []);

  function renderTaskHierarchy(tasks: Task[], parentId: number | null = null) {
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
        />

        <div className="pl-4">{renderTaskHierarchy(tasks, task.id)}</div>
      </div>
    ));
  }

  function renderSubtask() {
    return tasks
      .filter((task) => task.parent_task_id === selectedTask?.id)
      .map((task) => (
        <SubtaskItem
          key={task.id}
          tasks={tasks}
          taskDetails={task}
     
        />
      ));
  }
  return (
    <div className="flex h-full">
      <div className="p-4 flex-1 flex flex-col gap-0">
        {renderTaskHierarchy(tasks)}
        <div className="px-6">
          <AddTask />
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