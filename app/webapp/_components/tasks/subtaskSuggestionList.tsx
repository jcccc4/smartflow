import { OptimisticValueProp, Task } from "@/lib/types";
import { isTaskConnected } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
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
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const updatedTasks: Task[] = [];
    if (!over) return;
    setActiveId(null);
    setOverId("");
    setIsDragOver(false);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event;
    if (!over) {
      setIsDragOver(false);
      return;
    }
    if (active.id === over.id) {
      setIsDragOver(false);
      return;
    }
    setOverId(over.id as string);
    setIsDragOver(true);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { over } = event;
    if (!over) {
      setIsDragOver(false);
      return;
    }
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext items={suggestedTasks}>
        <div className="flex flex-col gap-2">
          {suggestedTasks.map((task) => (
            <div key={task.id} className="flex flex-col">
              {task.id !== activeId &&
              !isTaskConnected(suggestedTasks, task.id, activeId) ? (
                <SortableItem id={task.id}>
                  <div className="relative w-full flex flex-col">
                    {task.id === overId && isDragOver ? (
                      <div
                        className={`absolute bottom-0 right-0 w-full h-1 bg-red-800`}
                      ></div>
                    ) : (
                      ""
                    )}
                    <SubtaskSuggestionItem
                      subtasksLength={subtasksLength}
                      task={task}
                      setSuggestedTasks={setSuggestedTasks}
                      setOptimisticTaskState={setOptimisticTaskState}
                    />
                  </div>
                </SortableItem>
              ) : null}
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? <div className="w-full opacity-50">Task</div> : null}
      </DragOverlay>
    </DndContext>
  );
}
