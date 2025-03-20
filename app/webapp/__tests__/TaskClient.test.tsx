import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskClient from "../_components/taskClient";
import * as taskActions from "../_actions/tasks";
import * as aiActions from "../_actions/ai-tasks";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
// Mock the UUID generation for consistent testing
jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

// Mock the task actions
jest.mock("../_actions/tasks", () => ({
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
  createTasks: jest.fn(),
}));

// Mock AI actions
jest.mock("../_actions/ai-tasks", () => ({
  suggestSubtasks: jest.fn(),
}));

describe("TaskClient Component", () => {
  const mockTasks = [
    {
      id: "task-1",
      title: "Parent Task",
      description: null,
      parent_task_id: null,
      done: false,
      due_date: null,
      user_id: "test-user",
      created_at: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "Child Task",
      description: null,
      parent_task_id: "task-1",
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
    expect(screen.getByDisplayValue("Parent Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Child Task")).toBeInTheDocument();
  });

  it("handles task selection", () => {
    render(<TaskClient taskList={mockTasks} />);

    const parentTask = screen.getByDisplayValue("Parent Task");
    fireEvent.click(parentTask.closest("div")!);

    // Check if task details are shown in the right panel
    expect(screen.getByText("Improve Issue")).toBeInTheDocument();
    expect(screen.getByText("Add Description...")).toBeInTheDocument();
  });

  it("handles optimistic updates for task creation", async () => {
    render(<TaskClient taskList={mockTasks} />);

    // Add a new task

    const input = screen.getByTestId("add-task-input");
    fireEvent.focus(input); // or fireEvent.click(input)

    // Now the button should be visible
    const addButton = screen.getByTestId("add-task-button");

    fireEvent.change(input, { target: { value: "New Task" } });

    user.click(addButton);

    // Add a small delay if needed
    // await new Promise(resolve => setTimeout(resolve, 0));

    screen.debug();
    expect(screen.getByDisplayValue("New Task")).toBeInTheDocument();
  });

  // it('handles optimistic updates for task deletion', () => {
  //   render(<TaskClient taskList={mockTasks} />);

  //   // Find and click the delete button for the parent task
  //   const parentTask = screen.getByDisplayValue('Parent Task');
  //   const dropdownTrigger = parentTask.closest('div')!.querySelector('[aria-label="Open"]');
  //   fireEvent.click(dropdownTrigger!);
  //   fireEvent.click(screen.getByText('Delete'));

  //   // Check if the task is removed from the list
  //   expect(screen.queryByDisplayValue('Parent Task')).not.toBeInTheDocument();
  // });

  // it('generates AI suggestions for subtasks', async () => {
  //   const mockSuggestions = [
  //     { title: 'Suggested Task 1', description: 'Description 1' },
  //     { title: 'Suggested Task 2', description: 'Description 2' }
  //   ];

  //   (aiActions.suggestSubtasks as jest.Mock).mockResolvedValue({
  //     suggestions: mockSuggestions,
  //     error: null
  //   });

  //   render(<TaskClient taskList={mockTasks} />);

  //   // Select a task and click the suggest subtasks button
  //   const parentTask = screen.getByDisplayValue('Parent Task');
  //   fireEvent.click(parentTask.closest('div')!);

  //   const improveButton = screen.getByText('Improve Issue');
  //   fireEvent.click(improveButton);
  //   fireEvent.click(screen.getByText('Suggest subtasks'));

  //   // Wait for suggestions to be loaded
  //   await screen.findByText('Suggested Task 1');

  //   expect(screen.getByText('Suggested Task 1')).toBeInTheDocument();
  //   expect(screen.getByText('Suggested Task 2')).toBeInTheDocument();
  // });

  // it('maintains task hierarchy in the UI', () => {
  //   render(<TaskClient taskList={mockTasks} />);

  //   const parentTaskElement = screen.getByDisplayValue('Parent Task');
  //   const childTaskElement = screen.getByDisplayValue('Child Task');

  //   // Check if child task is rendered within parent's container
  //   const parentContainer = parentTaskElement.closest('div');
  //   const childContainer = childTaskElement.closest('div');

  //   expect(parentContainer).toContainElement(childContainer);
  // });

  // it('handles failed task operations gracefully', async () => {
  //   // Mock a failed task creation
  //   (taskActions.createTasks as jest.Mock).mockRejectedValue(new Error('Failed to create task'));

  //   const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  //   render(<TaskClient taskList={mockTasks} />);

  //   // Try to create a new task
  //   const input = screen.getByPlaceholderText('Add task') || screen.getByRole('textbox');
  //   fireEvent.change(input, { target: { value: 'New Task' } });
  //   fireEvent.keyDown(input, { key: 'Enter' });

  //   // Verify error was logged
  //   expect(consoleSpy).toHaveBeenCalled();

  //   consoleSpy.mockRestore();
  // });

  // it('updates task display when optimistic state changes', () => {
  //   render(<TaskClient taskList={mockTasks} />);

  //   // Update task title
  //   const taskInput = screen.getByDisplayValue('Parent Task');
  //   fireEvent.change(taskInput, { target: { value: 'Updated Task Title' } });

  //   // Check if the UI immediately reflects the change
  //   expect(screen.getByDisplayValue('Updated Task Title')).toBeInTheDocument();
  // });
});
