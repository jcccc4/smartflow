import { handleTaskDragAndDrop } from "@/app/webapp/_components/sort/sort-items";
import { Task } from "@/lib/types";
import { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/tree-item";
jest.mock("../../_actions/tasks", () => ({
  updateBatchTasks: jest.fn().mockResolvedValue({ data: "success" }),
}));

describe("Sort items", () => {
  // Mock data setup
  const mockTasks: Task[] = [
    { id: "1", position: 0, parent_task_id: null, depth: 0, title: "Task 1" },
    { id: "2", position: 1, parent_task_id: null, depth: 0, title: "Task 2" },
    { id: "3", position: 2, parent_task_id: null, depth: 0, title: "Task 3" },
    { id: "4", position: 0, parent_task_id: "1", depth: 1, title: "Subtask 1" },
  ] as Task[];

  const mockSetOptimisticTaskState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleTaskDragAndDrop function", () => {
    test("should handle reparent instruction", async () => {
      const instruction: Instruction = {
        type: "reparent",
        currentLevel: 1,
        desiredLevel: 0,
        indentPerLevel: 1,
      };
      const activeTask = mockTasks[3]; // Subtask 1
      const overTask = mockTasks[0]; // Task 1

      await handleTaskDragAndDrop(
        instruction,
        mockTasks,
        mockSetOptimisticTaskState,
        activeTask,
        overTask
      );

      expect(mockSetOptimisticTaskState).toHaveBeenCalled();
    });

    test("should handle reorder-above instruction", async () => {
      const instruction: Instruction = {
        type: "reorder-above",
        currentLevel: 1,
        indentPerLevel: 1,
      };
      const activeTask = mockTasks[1]; // Task 2
      const overTask = mockTasks[0]; // Task 1

      await handleTaskDragAndDrop(
        instruction,
        mockTasks,
        mockSetOptimisticTaskState,
        activeTask,
        overTask
      );

      expect(mockSetOptimisticTaskState).toHaveBeenCalled();
    });

    test("should handle reorder-below instruction", async () => {
      const instruction: Instruction = {
        type: "reorder-below",
        currentLevel: 1,
        indentPerLevel: 1,
      };
      const activeTask = mockTasks[1]; // Task 2
      const overTask = mockTasks[0]; // Task 1

      await handleTaskDragAndDrop(
        instruction,
        mockTasks,
        mockSetOptimisticTaskState,
        activeTask,
        overTask
      );

      expect(mockSetOptimisticTaskState).toHaveBeenCalled();
    });

    test("should handle instruction-blocked", async () => {
      const blockedInstruction: Instruction = {
        type: "instruction-blocked",
        desired: {
          type: "reorder-below",
          currentLevel: 1,
          indentPerLevel: 1,
        } as Exclude<
          Instruction,
          {
            type: "instruction-blocked";
          }
        >,
      };
      const activeTask = mockTasks[1];
      const overTask = mockTasks[0];

      await handleTaskDragAndDrop(
        blockedInstruction,
        mockTasks,
        mockSetOptimisticTaskState,
        activeTask,
        overTask
      );

      expect(mockSetOptimisticTaskState).not.toHaveBeenCalled();
    });
    test("should handle error during task update", async () => {
      const instruction: Instruction = {
        type: "reorder-below",
        currentLevel: 1,
        indentPerLevel: 1,
      };
      const activeTask = mockTasks[1]; // Task 2
      const overTask = mockTasks[0]; // Task 1
      const tasksModule = require("../../_actions/tasks");
      tasksModule.updateBatchTasks.mockRejectedValueOnce(
        new Error("Update failed")
      );
      const result = handleTaskDragAndDrop(
        instruction,
        mockTasks,
        mockSetOptimisticTaskState,
        activeTask,
        overTask
      );
      // Assert that the function throws an error
      await expect(result).rejects.toThrow("Update failed");
    });
  });
});
