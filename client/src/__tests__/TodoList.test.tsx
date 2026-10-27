import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '../components/TodoList';
import { Todo } from '../types/todo';

const mockTodos: Todo[] = [
  {
    _id: 'todo-1',
    title: 'First Task',
    priority: 'Low',
    status: 'Pending',
    createdAt: '2026-10-27T10:00:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z',
  },
  {
    _id: 'todo-2',
    title: 'Second Task',
    priority: 'High',
    status: 'Completed',
    createdAt: '2026-10-27T11:00:00.000Z',
    updatedAt: '2026-10-27T11:00:00.000Z',
  },
];

describe('TodoList Component', () => {
  it('TC-FE-026: should display loading spinner when loading and no todos', () => {
    render(
      <TodoList
        todos={[]}
        loading={true}
        error={null}
        onRetry={vi.fn()}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={vi.fn()}
        hasFilters={false}
      />
    );

    expect(screen.getByText('Loading your tasks...')).toBeInTheDocument();
  });

  it('TC-FE-027: should display error banner and retry button when error occurs', () => {
    const handleRetry = vi.fn();

    render(
      <TodoList
        todos={[]}
        loading={false}
        error="Network timeout occurred"
        onRetry={handleRetry}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={vi.fn()}
        hasFilters={false}
      />
    );

    expect(screen.getByText('Unable to Load Tasks')).toBeInTheDocument();
    expect(screen.getByText('Network timeout occurred')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Connection/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalled();
  });

  it('TC-FE-028: should display default empty state when list is empty without filters', () => {
    const handleCreate = vi.fn();

    render(
      <TodoList
        todos={[]}
        loading={false}
        error={null}
        onRetry={vi.fn()}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={handleCreate}
        hasFilters={false}
      />
    );

    expect(screen.getByText('All clear! No tasks yet')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: 'Add New Task' });
    fireEvent.click(actionBtn);
    expect(handleCreate).toHaveBeenCalled();
  });

  it('TC-FE-029: should display filtered empty state when hasFilters is true', () => {
    render(
      <TodoList
        todos={[]}
        loading={false}
        error={null}
        onRetry={vi.fn()}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={vi.fn()}
        hasFilters={true}
      />
    );

    expect(screen.getByText('No matching tasks')).toBeInTheDocument();
  });

  it('should render all items in the list', () => {
    render(
      <TodoList
        todos={mockTodos}
        loading={false}
        error={null}
        onRetry={vi.fn()}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={vi.fn()}
        hasFilters={false}
      />
    );

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });
});
