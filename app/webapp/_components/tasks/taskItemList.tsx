import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";
import { startTransition, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../sort/sortableItem";
import { updateBatchTasks } from "../../_actions/tasks";
interface TaskItemListParams {
  tasks: Task[];
  parentId?: string | null;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (action: OptimisticValueProp) => void;
}

function TaskItemList({
  tasks,
  parentId = null,
  selectedTask,
  setSelectedTask,
  setOptimisticTaskState,
}: TaskItemListParams) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [overId, setOverId] = useState<string | null>(null);
  const currentLevelTasks = tasks
    .filter((task) => task.parent_task_id === parentId)
    .sort((a, b) => a.position - (b.position ?? 0));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    setOverId("");
    setIsDragOver(false);
    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask || !overTask || active.id === over.id) return;

    const sourceLevelTasks = tasks
      .filter((task) => task.parent_task_id === activeTask.parent_task_id)
      .sort((a, b) => a.position - (b.position ?? 0));

    const targetLevelTasks = tasks
      .filter((task) => task.parent_task_id === overTask.parent_task_id)
      .sort((a, b) => a.position - (b.position ?? 0));

    const updatedTasks = calculateNewPositions(
      activeTask,
      overTask,
      sourceLevelTasks,
      targetLevelTasks
    );
    console.log(updatedTasks);
    // Optimistic update
    startTransition(() => {
      setOptimisticTaskState({
        type: "batchUpdate",
        tasks: updatedTasks,
      });
    });

    // Server update using updateBatchTasks
    try {
      const { error } = await updateBatchTasks(updatedTasks);
      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error updating task positions:", error);
    }
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

    // Don't show indicator if dragging over itself
    if (active.id === over.id) {
      setIsDragOver(false);
      return;
    }
    setOverId(over.id as string);
    setIsDragOver(true);
  }

  function calculateNewPositions(
    activeTask: Task,
    overTask: Task,
    sourceLevelTasks: Task[],
    targetLevelTasks: Task[]
  ): Task[] {
    const updatedTasks: Task[] = [];
    const isSameLevel = activeTask.parent_task_id === overTask.parent_task_id;

    if (isSameLevel) {
      const oldIndex = sourceLevelTasks.findIndex(
        (t) => t.id === activeTask.id
      );
      const newIndex = sourceLevelTasks.findIndex((t) => t.id === overTask.id);
      const reorderedTasks = arrayMove(sourceLevelTasks, oldIndex, newIndex);

      // Ensure position is always a number, defaulting to index if position is null
      reorderedTasks.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          position: index, // This will always be a number (0 or greater)
        });
      });
    } else {
      // Source level updates
      const sourceWithoutActive = sourceLevelTasks.filter(
        (t) => t.id !== activeTask.id
      );
      sourceWithoutActive.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          position: index, // This will always be a number
        });
      });

      // Target level updates
      const targetIndex = targetLevelTasks.findIndex(
        (t) => t.id === overTask.id
      );
      const targetWithActive = [...targetLevelTasks];
      targetWithActive.splice(targetIndex, 0, {
        ...activeTask,
        parent_task_id: overTask.parent_task_id,
      });

      targetWithActive.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          position: index, // This will always be a number
          parent_task_id: overTask.parent_task_id,
        });
      });
    }

    // Ensure no null positions in final result
    return updatedTasks.map((task) => ({
      ...task,
      position: task.position ?? 0, // Fallback to 0 if position is somehow null
    }));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <SortableContext items={currentLevelTasks}>
        <div className="flex flex-col gap-2">
          {currentLevelTasks.map((task) => (
            <div key={task.id} className="flex flex-col">
              {/* Wrapper for task and its subtasks */}
              <SortableItem id={task.id}>
                <div className="relative w-full flex flex-col">
                  {task.id === overId && isDragOver ? (
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-red-800`}
                    ></div>
                  ) : (
                    ""
                  )}
                  <TaskItem
                    tasks={tasks}
                    task={task}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    setOptimisticTaskState={setOptimisticTaskState}
                  />

                  {/* Subtasks container */}
                  <div className="ml-8 mt-2">
                    <TaskItemList
                      tasks={tasks}
                      parentId={task.id}
                      selectedTask={selectedTask}
                      setSelectedTask={setSelectedTask}
                      setOptimisticTaskState={setOptimisticTaskState}
                    />
                  </div>
                </div>
              </SortableItem>
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="w-full opacity-50">
            <TaskItem
              tasks={tasks}
              task={tasks.find((task) => task.id === activeId)!}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              setOptimisticTaskState={setOptimisticTaskState}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskItemList;
