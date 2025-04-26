import { OptimisticValueProp, Task } from "@/lib/types";
import { isTaskConnected } from "@/lib/utils";
import React, { useState } from "react";
import { SortableItem } from "../sort/sortableItem";
import SubtaskSuggestionItem from "./subtaskSuggestionItem";

type Props = {
  subtasksLength:number;
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
};
export default function SubtaskSuggestionList({
  subtasksLength,
  suggestedTasks,
  setSuggestedTasks,
  setOptimisticTaskState,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {suggestedTasks.map((task) => (
        <div
          key={task.id}
          style={{
            marginLeft: `${20 * task.depth}px`,
          }}
          className="flex flex-col"
        >
          {task.id !== activeId &&
          !isTaskConnected(suggestedTasks, task.id, activeId) ? (
            <SortableItem
              task={task}
              optimisticTaskState={suggestedTasks}
              setOptimisticTaskState={setOptimisticTaskState}
              activeId={activeId}
              setActiveId={setActiveId}
            >
              <div className="relative w-full flex flex-col">
                <SubtaskSuggestionItem
                  task={task}
                  setSuggestedTasks={setSuggestedTasks}
                  setOptimisticTaskState={setOptimisticTaskState}
                  subtasksLength={subtasksLength}
                />
              </div>
            </SortableItem>
          ) : null}
        </div>
      ))}
    </div>
  );
}
