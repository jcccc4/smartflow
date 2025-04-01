import { OptimisticValueProp, Task } from "@/lib/types";
import TaskItem from "./taskItem";

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
  const currentLevelTasks = tasks.filter(
    (task) => task.parent_task_id === parentId
  );

  return currentLevelTasks.map((task) => (
    <div key={task.id}>
      <TaskItem
        tasks={tasks}
        task={task}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        setOptimisticTaskState={setOptimisticTaskState}
      />

      <div className="pl-4">
        <TaskItemList
          tasks={tasks}
          parentId={task.id}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setOptimisticTaskState={setOptimisticTaskState}
        />
      </div>
    </div>
  ));
}

export default TaskItemList;
