import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import React, { useState, useEffect, startTransition } from "react";
import { OptimisticValueProp, Task } from "@/lib/types";
import SubtaskSuggestionCard from "./subtaskSuggestionCard";
import SubtaskItemList from "./subtaskItemList";
import { handleTaskHierarchy } from "@/lib/utils";
import { suggestSubtasks } from "../../_actions/ai-tasks";
import { updateTaskDescription } from "../../_actions/tasks";
import { v4 as uuidv4 } from "uuid";
import useDebounce from "@/hooks/use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskDetailViewProps {
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTask: Task;
  optimisticTaskState: Task[];
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOptimisticTaskState: (state: OptimisticValueProp) => void;
  suggestedTasks: Task[];
  setSuggestedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}
interface Suggestion {
  title: string;
  description: string;
}
export default function TaskDetailView({
  activeId,
  setActiveId,
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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    selectedTask?.description || ""
  );
  const debouncedDescription = useDebounce<string>(description, 500);
  
  useEffect(() => {
    // When selectedTask changes, turn off editing mode
    setIsEditingDescription(false);
  }, [selectedTask]);
  
  useEffect(() => {
    // Update description in database when debounced value changes, but only if editing
    const updateDescription = async () => {
      if (
        isEditingDescription &&
        selectedTask &&
        debouncedDescription !== selectedTask.description
      ) {
        await updateTaskDescription(selectedTask.id, debouncedDescription);

        // Update optimistic state
        const updatedTask = {
          ...selectedTask,
          description: debouncedDescription,
        };
        startTransition(() => {
          setOptimisticTaskState({
            type: "update",
            task: updatedTask,
          });
        });
        setSelectedTask(updatedTask);
      }
    };

    updateDescription();
  }, [debouncedDescription, isEditingDescription, selectedTask]);

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
        <div
          className="flex flex-col gap-2"
          onClick={() => setIsEditingDescription(true)}
        >
          {isEditingDescription ? (
            <>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDescription(false);
                    setDescription(selectedTask.description || "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDescription(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">≡</span>
                {selectedTask.description ? (
                  <span className="text-sm text-foreground">
                    {selectedTask.description}
                  </span>
                ) : (
                  <span className="text-sm">Add Description...</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col p-4">
        <h3 className="font-semibold mb-4">Subtask</h3>
        <div>
          <SubtaskItemList
            activeId={activeId}
            setActiveId={setActiveId}
            optimisticTaskState={handleTaskHierarchy(
              optimisticTaskState,
              selectedTask.id
            )}
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
