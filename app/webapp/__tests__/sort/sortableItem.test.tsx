import { render, screen, fireEvent } from "@testing-library/react";
import { SortableItem } from "@/app/webapp/_components/sort/sortableItem";
import { Task } from "@/lib/types";
import { useState } from "react";

describe("SortableItem", () => {
  const mockTask: Task = {
    id: "task-1",
    title: "Test Task",
    position: 0,
    depth: 0,
    parent_task_id: null,
    created_at: new Date().toISOString(),
  } as Task;

  const mockOptimisticTaskState: Task[] = [mockTask];
  const mockSetOptimisticTaskState = jest.fn();
  const mockSetActiveId = jest.fn();

  const defaultProps = {
    task: mockTask,
    optimisticTaskState: mockOptimisticTaskState,
    setOptimisticTaskState: mockSetOptimisticTaskState,
    activeId: null,
    setActiveId: mockSetActiveId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with children", () => {
    render(
      <SortableItem {...defaultProps}>
        <div data-testid="child-content">Child Content</div>
      </SortableItem>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(
      screen.getByTestId(`drag-handle-${mockTask.id}`)
    ).toBeInTheDocument();
  });

  it("applies correct padding based on task depth", () => {
    const deepTask = { ...mockTask, depth: 2 };
    const { container } = render(
      <SortableItem {...defaultProps} task={deepTask}>
        <div>Content</div>
      </SortableItem>
    );

    const itemDiv = container.firstChild as HTMLElement;
    expect(itemDiv).toHaveStyle({ paddingLeft: "100px" }); // 24 * 2
  });

  it("shows/hides drag handle on hover", () => {
    render(
      <SortableItem {...defaultProps}>
        <div>Content</div>
      </SortableItem>
    );

    const dragHandle = screen.getByTestId(`drag-handle-${mockTask.id}`);
    expect(dragHandle).toHaveClass("invisible");

    // Simulate hover on parent container
    const container = dragHandle.parentElement!;
    fireEvent.mouseEnter(container);
    expect(dragHandle).toHaveClass("group-hover:visible");
  });

  it("becomes invisible when task is connected or active", () => {
    const { rerender } = render(
      <SortableItem {...defaultProps} activeId={mockTask.id}>
        <div>Content</div>
      </SortableItem>
    );

    expect(
      screen.getByTestId(`drag-handle-${mockTask.id}`).parentElement
    ).toHaveClass("invisible");

    // Test connected task case
    rerender(
      <SortableItem
        {...defaultProps}
        activeId="different-task"
        optimisticTaskState={[
          { ...mockTask, parent_task_id: "different-task" },
        ]}
      >
        <div>Content</div>
      </SortableItem>
    );

    expect(
      screen.getByTestId(`drag-handle-${mockTask.id}`).parentElement
    ).toHaveClass("invisible");
  });
});
