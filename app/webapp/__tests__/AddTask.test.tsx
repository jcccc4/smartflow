import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTask from '../_components/tasks/addTask';
import * as taskActions from '../_actions/tasks';


// Mock the UUID generation to have consistent IDs in tests
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

// Mock the server action
jest.mock('../_actions/tasks', () => ({
  createTasks: jest.fn()
}));

describe('AddTask Component', () => {
  const mockSetOptimisticTaskState = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders add task input with placeholder', () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    expect(screen.getByText('Add task')).toBeInTheDocument();
  });

  it('shows buttons when input is focused', () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('hides buttons when cancel is clicked', () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    // Show buttons
    fireEvent.focus(input);
    
    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));
    
    // Verify buttons are hidden
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
  });

  it('creates a new task when Add Task is clicked', async () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'New Test Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Check if optimistic update was called
    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: 'create',
      task: expect.objectContaining({
        id: 'test-uuid',
        title: 'New Test Task',
        parent_task_id: null,
        done: false
      })
    });

    // Check if server action was called
    expect(taskActions.createTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid',
        title: 'New Test Task',
        parent_task_id: null,
        done: false
      })
    );

    // Verify input is cleared
    expect(input).toHaveValue('');
  });

  it('creates a new task when Enter is pressed', async () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'New Test Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSetOptimisticTaskState).toHaveBeenCalledWith({
      type: 'create',
      task: expect.objectContaining({
        title: 'New Test Task'
      })
    });
  });

  it('does not create task when input is empty', () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Add Task'));

    expect(mockSetOptimisticTaskState).not.toHaveBeenCalled();
    expect(taskActions.createTasks).not.toHaveBeenCalled();
  });

  it('Add Task button is disabled when input is empty', () => {
    render(<AddTask setOptimisticTaskState={mockSetOptimisticTaskState} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    
    const addButton = screen.getByText('Add Task');
    expect(addButton).toBeDisabled();
  });
});