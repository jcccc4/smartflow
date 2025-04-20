import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";
import { startTransition, useState } from "react";

import { SortableItem } from "../sort/sortableItem";
import { updateBatchTasks } from "../../_actions/tasks";
import { isTaskConnected } from "@/lib/utils";
interface TaskItemListParams {
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
}

export const spacingTrigger = 50;

function TaskItemList({
  tasks,
  selectedTask,
  setSelectedTask,
  setOptimisticTaskState,
}: TaskItemListParams) {
  return (
    <div className="flex flex-col ">
      {tasks.map((task: Task) => {
        return (
          <SortableItem
            data-testid={`${task.id}-sortable-item`}
            key={task.id}
            task={task}
            tasks={tasks}
            setOptimisticTaskState={setOptimisticTaskState}
          >
            <div className="relative w-full flex flex-col ">
              <TaskItem
                tasks={tasks}
                task={task}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                setOptimisticTaskState={setOptimisticTaskState}
              />
            </div>
          </SortableItem>
        );
      })}
    </div>
  );
}

export default TaskItemList;
