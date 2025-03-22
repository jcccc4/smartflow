import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskClient from "../_components/taskClient";
import userEvent from "@testing-library/user-event";
import * as taskActions from "../_actions/tasks";

// Mock the tasks actions
jest.mock("../_actions/tasks", () => ({
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
  createTasks: jest.fn(),
}));

// Mock UUID generation
jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

describe("TaskClient Component", () => {
  const mockTasks = [
    {
      id: "parent-task-1",
      title: "Parent Task 1",
      description: null,
      parent_task_id: null,
      done: false,
      due_date: null,
      user_id: "test-user",
      created_at: new Date().toISOString(),
    },
    {
      id: "subtask-1",
      title: "Subtask 1",
      description: null,
      parent_task_id: "parent-task-1",
      done: false,
      due_date: null,
      user_id: "test-user",
      created_at: new Date().toISOString(),
    },
    {
      id: "parent-task-2",
      title: "Parent Task 2",
      description: null,
      parent_task_id: null,
      done: false,
      due_date: null,
      user_id: "test-user",
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task list correctly", () => {
    render(<TaskClient taskList={mockTasks} />);

    expect(screen.getByDisplayValue("Parent Task 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Parent Task 2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Subtask 1")).toBeInTheDocument();
  });

  it("renders task hierarchy correctly", () => {
    render(<TaskClient taskList={mockTasks} />);

    const parentTask = screen
      .getByDisplayValue("Parent Task 1")
      .closest('div[class*="flex"]');
    const subtask = screen
      .getByDisplayValue("Subtask 1")
      .closest('div[class*="pl-4"]');

    expect(parentTask).toBeInTheDocument();
    expect(subtask).toBeInTheDocument();
  });

  it("selects task and shows details in sidebar", async () => {
    const user = userEvent.setup();
    render(<TaskClient taskList={mockTasks} />);

    const taskElement = screen.getByTestId("parent-task-1-task-item");
    await user.click(taskElement);

    expect(screen.getByText("Parent Task 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /improve issue/i })
    ).toBeInTheDocument();
  });
});
