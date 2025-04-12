import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";
import { startTransition, useState } from "react";
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
  DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [overId, setOverId] = useState<string | null>(null);
  const [isSubtask, setIsSubtask] = useState<boolean>(false);

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

    const activeTask = {
      ...tasks.find((task) => task.id === active.id),
    } as Task;
    const overTask = { ...tasks.find((task) => task.id === over.id) } as Task;

    if (!activeTask || !overTask || active.id === over.id) return;

    if (
      !isSubtask &&
      activeTask.position === overTask.position &&
      activeTask.parent_task_id === overTask.parent_task_id
    ) {
      return;
    }
    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);
    activeTask.position = newIndex;
    overTask.position = oldIndex;

    if (isSubtask) {
      activeTask.depth = overTask.depth + 1;
      activeTask.parent_task_id = overTask.id;
      activeTask.position = tasks.reduce(
        (count, task) =>
          task.parent_task_id === overTask.id && task.id !== activeTask.id
            ? count + 1
            : count,
        0
      );

      const siblings = tasks.filter(
        (task) =>
          task.parent_task_id === overTask.id && task.id !== activeTask.id
      );

      siblings.forEach((sibling) => {
        if (sibling.position >= activeTask.position) {
          updatedTasks.push({
            ...sibling,
            position: sibling.position + 1,
          });
        }
      });
    } else if (!isSubtask) {
      activeTask.depth = overTask.depth;
      activeTask.parent_task_id = overTask.parent_task_id;
      activeTask.position = overTask.position + 1;
    }
    updatedTasks.push(activeTask, overTask);
    if (updatedTasks.length > 0) {
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
    const { over, delta } = event;
    if (!over) {
      setIsDragOver(false);
      return;
    }

    setIsSubtask(delta.x > spacingTrigger);
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
      <SortableContext items={tasks}>
        <div className="flex flex-col gap-2">
          {tasks.map((task: Task) => (
            <div
              key={task.id}
              data-testid={`${task.id}-sortable-item`}
              style={{
                marginLeft: `${20 * task.depth}px`,
              }}
              className="flex flex-col"
            >
              {task.id !== activeId &&
              !isTaskConnected(tasks, task.id, activeId) ? (
                <SortableItem id={task.id}>
                  <div className="relative w-full flex flex-col">
                    {task.id === overId && isDragOver ? (
                      <div
                        style={{
                          width: `calc(100% - ${
                            isSubtask ? spacingTrigger : 0
                          }px)`,
                        }}
                        className={`absolute bottom-0 right-0  h-1 bg-red-800`}
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
                  </div>
                </SortableItem>
              ) : null}
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
