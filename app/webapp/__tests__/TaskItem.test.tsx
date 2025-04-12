import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "../_components/tasks/taskItem";
import * as taskActions from "../_actions/tasks";
import userEvent from "@testing-library/user-event";
import { Task } from "@/lib/types";

jest.mock("../_components/handlers/keyboardEvents", () => ({
  handleKeyDown: jest.fn(),
}));

jest.mock("../_actions/tasks", () => ({
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
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
    depth: 0,
    position: 0,
  } as Task;

  const mockTasks = [mockTask];
  const mockSetSelectedTask = jest.fn();
  const mockSetOptimisticTaskState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task with correct title and checkbox", () => {
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
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
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

  it("updates task title when input changes", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    const input = screen.getByDisplayValue("Test Task");
    await user.clear(input);
    await user.type(input, "Updated Task");

    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: "update",
      task: expect.objectContaining({
        title: "Updated Task",
      }),
    });
  });

  it("deletes task when delete option is clicked", async () => {
    const user = userEvent.setup();
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

    user.hover(screen.getByTestId(`${mockTask.id}-task-item`));
    const dropdownTrigger = screen.getByTestId("test-id-1-dropdown-trigger");
    await user.click(dropdownTrigger);

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
  });

  it("handles add subtask option", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    user.hover(screen.getByTestId(`${mockTask.id}-task-item`));
    const dropdownTrigger = screen.getByTestId("test-id-1-dropdown-trigger");
    await user.click(dropdownTrigger);

    const addSubtaskMenuItem = await screen.findByRole("menuitem", {
      name: /add subtask/i,
    });
    expect(addSubtaskMenuItem).toBeInTheDocument();
  });

  it("selects task when clicked", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    const taskElement = screen.getByTestId(`${mockTask.id}-task-item`);
    await user.click(taskElement);

    expect(mockSetSelectedTask).toHaveBeenCalledWith(mockTask);
  });

  it("handles keyboard events for task input", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        tasks={mockTasks}
        task={mockTask}
        selectedTask={null}
        setSelectedTask={mockSetSelectedTask}
        setOptimisticTaskState={mockSetOptimisticTaskState}
      />
    );

    const input = screen.getByDisplayValue("Test Task");
    await user.type(input, "{enter}");
    await user.type(input, "{esc}");

    // Verify input remains in document after keyboard events
    expect(input).toBeInTheDocument();
  });
});
