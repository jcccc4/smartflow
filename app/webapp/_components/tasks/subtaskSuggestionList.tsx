import { OptimisticValueProp, Task } from "@/lib/types";
import { isTaskConnected } from "@/lib/utils";
import React, { useState } from "react";
import { SortableItem } from "../sort/sortableItem";
import SubtaskSuggestionItem from "./subtaskSuggestionItem";

type Props = {
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
};
export default function SubtaskSuggestionList({
  suggestedTasks,
  setSuggestedTasks,
  setOptimisticTaskState,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [overId, setOverId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {/* {suggestedTasks.map((task) => (
        <div
          key={task.id}
          style={{
            marginLeft: `${20 * task.depth}px`,
          }}
          className="flex flex-col"
        >
          {task.id !== activeId &&
          !isTaskConnected(suggestedTasks, task.id, activeId) ? (
            <SortableItem task={task} tasks={suggestedTasks} >
              <div className="relative w-full flex flex-col">
                {task.id === overId && isDragOver ? (
                  <div
                    className={`absolute bottom-0 right-0 w-full h-1 bg-red-800`}
                  ></div>
                ) : (
                  ""
                )}
                <SubtaskSuggestionItem
                  task={task}
                  setSuggestedTasks={setSuggestedTasks}
                  setOptimisticTaskState={setOptimisticTaskState}
                />
              </div>
            </SortableItem>
          ) : null}
        </div>
      ))} */}
    </div>
  );
}
