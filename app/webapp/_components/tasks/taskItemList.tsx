import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";
import { SortableItem } from "../sort/sortableItem";
import { useState } from "react";
import { isTaskConnected } from "@/lib/utils";

interface TaskItemListParams {
  optimisticTaskState: Task[];
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
}

export const spacingTrigger = 50;

function TaskItemList({
  optimisticTaskState,
  selectedTask,
  setSelectedTask,
  setOptimisticTaskState,
}: TaskItemListParams) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col ">
      {optimisticTaskState.map((task: Task) => {
        return (
          <SortableItem
            data-testid={`${task.id}-sortable-item`}
            key={task.id}
            task={task}
            optimisticTaskState={optimisticTaskState}
            setOptimisticTaskState={setOptimisticTaskState}
            activeId={activeId}
            setActiveId={setActiveId}
          >
            <div className="relative w-full flex flex-col ">
              <TaskItem
                optimisticTaskState={optimisticTaskState}
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
