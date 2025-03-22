import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskClient from "../_components/taskClient";
import userEvent from "@testing-library/user-event";
import * as taskActions from "../_actions/tasks";

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
  {
    id: "search-task",
    title: "Searchable Task",
    description: "This is a searchable task",
    parent_task_id: null,
    done: false,
    due_date: null,
    user_id: "test-user",
    created_at: new Date().toISOString(),
  },
];

// const mockSetOptimisticTaskState = jest.fn();

// // 3. Then set up your mock
// jest.mock("react", () => ({
//   ...jest.requireActual("react"),
//   useOptimistic: () => [mockTasks, mockSetOptimisticTaskState],
// }));
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

  it("should handle task deletion", async () => {
    const user = userEvent.setup();

    const mockDeleteTask = jest
      .spyOn(taskActions, "deleteTask")
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      );
    render(<TaskClient taskList={mockTasks} />);

    // Trigger mouseEnter on the task item
    fireEvent.mouseEnter(screen.getByTestId("parent-task-1-task-item"));

    // Get the dropdown trigger and fire pointer events
    const dropdownTrigger = screen.getByTestId(
      "parent-task-1-dropdown-trigger"
    );

    fireEvent(
      dropdownTrigger,
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
    // Wait for the dropdown menu to appear and click delete
    const deleteButton = await screen.findByRole("menuitem", {
      name: /delete/i,
    });
    fireEvent(
      deleteButton,
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
    await user.click(deleteButton);
    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith(mockTasks[0]);
    });
    screen.debug();
  });
});
