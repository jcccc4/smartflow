import {
  render,
  screen,
  fireEvent,
  act,
  within,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "../_components/tasks/taskItem";
import * as taskActions from "../_actions/tasks";
import userEvent from "@testing-library/user-event";
jest.mock("../_actions/tasks", () => ({
  deleteTask: jest.fn(),
}));
// Mock the handlers
jest.mock("../_components/tasks/handlers/debouncedTaskTitle", () => ({
  debouncedTaskTitle: jest.fn(),
}));

describe("TaskItem Component", () => {
  const mockTask = {
    id: "test-id-1",
    title: "Test Task",
    description: null,
    parent_task_id: null,
    done: false,
    due_date: null,
    user_id: "test-user",
    created_at: new Date().toISOString(),
  };

  const mockTasks = [mockTask];
  const mockSetSelectedTask = jest.fn();
  const mockSetOptimisticTaskState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task with correct title", () => {
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("highlights when selected", () => {
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={mockTask}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    const taskElement = screen
      .getByDisplayValue("Test Task")
      .closest('div[class*="bg-[#E7F0FE]"]');
    expect(taskElement).toBeInTheDocument();
  });

  it("deletes task when delete option is clicked", async () => {
    const user = userEvent.setup();
    // Mock the deleteTask to return a resolved promise
    (taskActions.deleteTask as jest.Mock).mockResolvedValue({ error: null });

    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    // Get the dropdown menu trigger

    user.hover(screen.getByTestId(`${mockTask.id}-task-item`));
    const dropdownTrigger = screen.getByTestId("test-id-1-dropdown-trigger");
    user.click(dropdownTrigger);
    const dropdown = await screen.findByTestId("test-id-1-dropdown-menu");
    expect(dropdown).toBeVisible();

    const deleteMenuItem = await screen.findByRole("menuitem", {
      name: /delete/i,
    });

    await user.click(deleteMenuItem);

    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: "delete",
      task: mockTask,
    });

    await waitFor(() => {
      expect(taskActions.deleteTask).toHaveBeenCalledWith(mockTask);
    });
    // Verify the promise was resolved
    const deleteResult = await (taskActions.deleteTask as jest.Mock).mock
      .results[0].value;
    expect(deleteResult).toEqual({ error: null });
  });
});
