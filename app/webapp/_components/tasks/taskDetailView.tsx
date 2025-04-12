import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import React, { useState } from "react";
import { OptimisticValueProp, Task } from "@/lib/types";
import SubtaskSuggestionCard from "./subtaskSuggestionCard";
import TaskItemList from "./taskItemList";
import { handleTaskHierarchy } from "@/lib/utils";
import { suggestSubtasks } from "../../_actions/ai-tasks";
import { v4 as uuidv4 } from "uuid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubtaskItemList from "./subtaskItemList";
// Add proper type for props
interface TaskDetailViewProps {
  selectedTask: Task; // Define Task type based on your data structure
  optimisticTaskState: Task[];
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (state: OptimisticValueProp) => void; // Replace 'any' with proper type
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}
interface Suggestion {
  title: string;
  description: string;
}
export default function TaskDetailView({
  selectedTask,
  optimisticTaskState,
  setSelectedTask,
  setOptimisticTaskState,
  suggestedTasks,
  setSuggestedTasks,
}: TaskDetailViewProps) {
  const [suggestingForTaskId, setSuggestingForTaskId] = useState<string | null>(
    null
  );

  if (!selectedTask) {
    return null;
  }

  const handleGenerateSubtasks = async () => {
    if (!selectedTask) return;
    setSuggestingForTaskId(selectedTask.id);

    try {
      const { suggestions, error } = await suggestSubtasks(
        selectedTask.title,
        selectedTask.description
      );

      if (error) {
        throw new Error(error.toString()); // Convert error to string
      }
      if (suggestions) {
        const suggestedTaskByAi = suggestions.map(
          (suggestion: Suggestion, position) => {
            return {
              id: uuidv4(),
              title: suggestion.title,
              description: suggestion.description,
              parent_task_id: selectedTask.id,
              created_at: new Date().toISOString(),
              done: false,
              due_date: null,
              user_id: "pending", // Inherit from parent task
              depth: selectedTask.depth,
              position,
            } as Task;
          }
        );

        setSuggestedTasks(suggestedTaskByAi);
      }
    } catch (error) {
      console.error("Error generating subtasks:", error);
    }
  };
  return (
    <div className="p-0">
      <header className="p-4 flex justify-between items-center border-b border-[#ebebeb]">
        <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Improve Issue
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="w-[296px]"
              onClick={handleGenerateSubtasks}
            >
              <WandSparkles size={16} className="mr-2" />
              <span>Suggest subtasks</span>
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

      <div className="flex flex-col p-4">
        <h3 className="font-semibold mb-4">Subtask</h3>
        <div>
          <SubtaskItemList
            tasks={handleTaskHierarchy(optimisticTaskState, selectedTask.id)}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setOptimisticTaskState={setOptimisticTaskState}
          />
        </div>
        {suggestedTasks.length > 0 &&
          suggestingForTaskId === selectedTask.id && (
            <SubtaskSuggestionCard
              tasks={optimisticTaskState}
              selectedTask={selectedTask}
              suggestedTasks={suggestedTasks}
              setSuggestedTasks={setSuggestedTasks}
              setOptimisticTaskState={setOptimisticTaskState}
              setSuggestingForTaskId={setSuggestingForTaskId}
            />
          )}
      </div>
    </div>
  );
}
