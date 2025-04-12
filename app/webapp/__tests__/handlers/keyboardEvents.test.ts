import { handleKeyDown } from "../../_components/handlers/keyboardEvents";
import { createClient } from "@/utils/supabase/client";
import { createTask, deleteTask } from "@/app/webapp/_actions/tasks";
import { Task } from "@/lib/types";

// Mock dependencies
jest.mock("@/utils/supabase/client");
jest.mock("@/app/webapp/_actions/tasks");
jest.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

describe("handleKeyDown", () => {
  const mockSetOptimisticTaskState = jest.fn();

  const mockTask = {
    id: "123",
    title: "Test Task",
    user_id: "user123",
    created_at: null,
    description: null,
    done: false,
    due_date: null,
    parent_task_id: null,
    position: 0,
    depth: 0,
  } as Task;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles Enter key press", async () => {
    // Mock Supabase user
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "user123" } },
        }),
      },
    });

    const mockEvent = {
      key: "Enter",
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    await handleKeyDown(mockEvent, {
      editedTitle: "Test",
      task: mockTask,
      setOptimisticTaskState: mockSetOptimisticTaskState,
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: "create",
      task: {
        ...mockTask,
        id: "mocked-uuid",
        title: "",
        user_id: "user123",
      },
    });
    expect(createTask).toHaveBeenCalledWith({
      ...mockTask,
      id: "mocked-uuid",
      title: "",
      user_id: "user123",
    });
  });

  test("handles Backspace key press with empty title", async () => {
    const mockEvent = {
      key: "Backspace",
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    await handleKeyDown(mockEvent, {
      editedTitle: "",
      task: mockTask,
      setOptimisticTaskState: mockSetOptimisticTaskState,
    });

    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: "delete",
      task: mockTask,
    });
    expect(deleteTask).toHaveBeenCalledWith(mockTask);
  });

  test("does not delete task on Backspace with non-empty title", async () => {
    const mockEvent = {
      key: "Backspace",
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    await handleKeyDown(mockEvent, {
      editedTitle: "Non-empty title",
      task: mockTask,
      setOptimisticTaskState: mockSetOptimisticTaskState,
    });

    expect(mockSetOptimisticTaskState).not.toHaveBeenCalled();
    expect(deleteTask).not.toHaveBeenCalled();
  });

  test("handles Escape key press", async () => {
    const mockEvent = {
      key: "Escape",
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    const result = await handleKeyDown(mockEvent, {
      editedTitle: "Test",
      task: mockTask,
      setOptimisticTaskState: mockSetOptimisticTaskState,
    });

    expect(result).toBe(mockTask.title);
  });

  test("handles no user found on Enter key press", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    });

    const mockEvent = {
      key: "Enter",
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    await handleKeyDown(mockEvent, {
      editedTitle: "Test",
      task: mockTask,
      setOptimisticTaskState: mockSetOptimisticTaskState,
    });

    expect(consoleSpy).toHaveBeenCalledWith("No user found");
    expect(mockSetOptimisticTaskState).not.toHaveBeenCalled();
    expect(createTask).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
