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

  // --- Additional Figma Redesign, Layout, and Theming Tests ---

  // TC-LST-001: 2-column responsive grid container layout
  it('TC-LST-001: should render todos in Figma responsive 2-column grid container', () => {
    const { container } = render(
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

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'gap-4');
  });

  // TC-LST-002: Loading state Figma spinner and typography
  it('TC-LST-002: should render centered loading layout with large spinner and styled text', () => {
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

    const loadingText = screen.getByText('Loading your tasks...');
    expect(loadingText).toHaveClass('text-sm', 'font-medium', 'text-[#656C5B]');

    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('w-12', 'h-12', 'border-4', 'animate-spin');
  });

  // TC-LST-003: Error state banner Figma styling and RefreshCw icon
  it('TC-LST-003: should render rose alert banner with AlertCircle and RefreshCw retry button', () => {
    render(
      <TodoList
        todos={[]}
        loading={false}
        error="Server connection refused"
        onRetry={vi.fn()}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onOpenCreate={vi.fn()}
        hasFilters={false}
      />
    );

    const heading = screen.getByText('Unable to Load Tasks');
    expect(heading).toHaveClass('text-rose-900', 'font-semibold');

    const retryBtn = screen.getByRole('button', { name: /Retry Connection/i });
    expect(retryBtn).toHaveClass('bg-rose-600', 'hover:bg-rose-700', 'text-white', 'rounded-xl');

    const retryIcon = retryBtn.querySelector('svg');
    expect(retryIcon).toHaveClass('lucide-refresh-cw');
  });

  // TC-LST-004: Empty state card Figma layout, CheckSquare illustration and action button
  it('TC-LST-004: should render EmptyState card with CheckSquare illustration and trigger onOpenCreate', () => {
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

    expect(screen.getByText('All clear! No tasks yet')).toHaveClass('text-lg', 'font-bold');
    expect(screen.getByText(/Add your first task above/i)).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: 'Add New Task' });
    expect(actionBtn).toHaveClass('bg-[#6B7A40]', 'text-white', 'rounded-xl');

    fireEvent.click(actionBtn);
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  // TC-LST-005: Filtered empty state subtext guidance
  it('TC-LST-005: should render filtered empty state with specific guidance to adjust filters', () => {
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
    expect(
      screen.getByText('Try adjusting your search query, priority filter, or status tabs to view tasks.')
    ).toBeInTheDocument();
  });
});
