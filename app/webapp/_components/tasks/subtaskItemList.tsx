import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";
import { SortableItem } from "../sort/sortableItem";
import { Dispatch } from "react";

interface TaskItemListParams {
  activeId: string | null;
  setActiveId: Dispatch<React.SetStateAction<string | null>>;
  optimisticTaskState: Task[];
  selectedTask: Task | null;
  setSelectedTask: Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
}

function SubtaskItemList({
  activeId,
  setActiveId,
  optimisticTaskState,
  selectedTask,
  setSelectedTask,
  setOptimisticTaskState,
}: TaskItemListParams) {
  if (!optimisticTaskState || !Array.isArray(optimisticTaskState)) {
    return null;
  }

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
            activeIdDepth={(selectedTask?.depth ?? 0 )+ 1}
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

export default SubtaskItemList;
