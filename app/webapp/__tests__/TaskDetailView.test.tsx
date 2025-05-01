import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskDetailView from '../_components/tasks/taskDetailView';
import { Task } from '@/lib/types';

import '@testing-library/jest-dom';

// Mock the hooks
jest.mock('@/hooks/use-debounce', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((value) => value),
}));

// Mock the server actions
jest.mock('../_actions/tasks', () => ({
  updateTaskDescription: jest.fn().mockResolvedValue({ data: {}, error: null }),
}));

jest.mock('../_actions/ai-tasks', () => ({
  suggestSubtasks: jest.fn(),
}));

describe('TaskDetailView', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Initial description',
    done: false,
    user_id: 'user1',
    created_at: '2023-01-01',
    due_date: null,
    parent_task_id: null,
    position: 0,
    depth: 0,
  };

  const mockProps = {
    activeId: '1',
    setActiveId: jest.fn(),
    selectedTask: mockTask,
    optimisticTaskState: [mockTask],
    setSelectedTask: jest.fn(),
    setOptimisticTaskState: jest.fn(),
    suggestedTasks: [],
    setSuggestedTasks: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the task title and description', () => {
    render(<TaskDetailView {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Initial description')).toBeInTheDocument();
  });

  it('allows editing description with debounced updates', async () => {
    render(<TaskDetailView {...mockProps} />);
    
    // Click on the description area to start editing
    fireEvent.click(screen.getByText('Initial description'));
    
    // Find the textarea and change its value
    const textarea = screen.getByPlaceholderText('Add a description...');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });
    
    // Wait for the debounced update to be called
    await waitFor(() => {
      expect(mockProps.setOptimisticTaskState).toHaveBeenCalledWith({
        type: 'update',
        task: {
          ...mockTask,
          description: 'Updated description',
        },
      });
    });
  });

  it('cancels editing and reverts to original description', () => {
    render(<TaskDetailView {...mockProps} />);
    
    // Click on the description area to start editing
    fireEvent.click(screen.getByText('Initial description'));
    
    // Find the textarea and change its value
    const textarea = screen.getByPlaceholderText('Add a description...');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check that we're back to view mode with original description
    expect(screen.getByText('Initial description')).toBeInTheDocument();
    expect(textarea).not.toBeInTheDocument;
  });

  it('completes editing when clicking Done button', async () => {
    render(<TaskDetailView {...mockProps} />);
    
    // Click on the description area to start editing
    fireEvent.click(screen.getByText('Initial description'));
    
    // Find the textarea and change its value
    const textarea = screen.getByPlaceholderText('Add a description...');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });
    
    // Click Done button
    fireEvent.click(screen.getByText('Done'));
    
    // Check that we're back to view mode
    expect(textarea).not.toBeInTheDocument;
  });
});