import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/todo';

const baseTodo: Todo = {
  _id: 'todo-123',
  title: 'Audit application performance',
  description: 'Profile heap usage and reduce re-renders.',
  priority: 'High',
  status: 'Pending',
  dueDate: '2026-12-01T00:00:00.000Z',
  completedAt: null,
  createdAt: '2026-10-27T10:00:00.000Z',
  updatedAt: '2026-10-27T10:00:00.000Z',
};

describe('TodoItem Component', () => {
  it('TC-FE-001: should render title, description, and badges', () => {
    const handleToggle = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Audit application performance')).toBeInTheDocument();
    expect(screen.getByText('Profile heap usage and reduce re-renders.')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('TC-FE-002: should render strikethrough and completedAt when status is Completed', () => {
    const completedTodo: Todo = {
      ...baseTodo,
      status: 'Completed',
      completedAt: '2026-10-27T12:00:00.000Z',
    };

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const titleEl = screen.getByText('Audit application performance');
    expect(titleEl).toHaveClass('line-through');
    expect(screen.getByText(/Completed:/i)).toBeInTheDocument();
  });

  it('TC-FE-003: should display OVERDUE badge when past due and not completed', () => {
    const overdueTodo: Todo = {
      ...baseTodo,
      dueDate: '2020-01-01T00:00:00.000Z',
      status: 'Pending',
    };

    render(
      <TodoItem
        todo={overdueTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('OVERDUE')).toBeInTheDocument();
  });

  it('TC-FE-004: should display Due Today badge when due date is today', () => {
    const today = new Date().toISOString();
    const dueTodayTodo: Todo = {
      ...baseTodo,
      dueDate: today,
      status: 'Pending',
    };

    render(
      <TodoItem
        todo={dueTodayTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Due Today')).toBeInTheDocument();
  });

  it('TC-FE-005: should invoke onToggleComplete when checkbox button is clicked', () => {
    const handleToggle = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={handleToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('button', { name: /Mark as complete/i });
    fireEvent.click(checkbox);
    expect(handleToggle).toHaveBeenCalledWith('todo-123');
  });

  it('TC-FE-006: should invoke onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={vi.fn()}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Edit task/i });
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(baseTodo);
  });

  it('TC-FE-007: should invoke onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /Delete task/i });
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(baseTodo);
  });

  // --- Additional Figma Redesign, Layout, and Theming Tests ---

  // TC-ITM-001: Completed task card Figma styling and card state
  it('TC-ITM-001: should apply Figma completed border, filled olive checkbox, and line-through styles', () => {
    const completedTodo: Todo = {
      ...baseTodo,
      status: 'Completed',
      completedAt: '2026-10-27T12:00:00.000Z',
    };

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('border-[#DDE6D3]', 'bg-[#FBFBF9]');

    const checkbox = screen.getByRole('button', { name: /Mark as incomplete/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('bg-[#6B7A40]', 'text-white');

    const titleEl = screen.getByText('Audit application performance');
    expect(titleEl).toHaveClass('line-through', 'text-[#8E9685]');

    const descEl = screen.getByText('Profile heap usage and reduce re-renders.');
    expect(descEl).toHaveClass('line-through', 'text-[#8E9685]');

    expect(screen.getByText(/Completed:/i).closest('div')).toHaveClass('text-emerald-600');
  });

  // TC-ITM-002: Incomplete task card Figma styling and card state
  it('TC-ITM-002: should apply default Figma border, unfilled checkbox, and "Mark as complete" label', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('border-[#E2E4DC]', 'bg-white');

    const checkbox = screen.getByRole('button', { name: /Mark as complete/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('bg-[#F0EFE9]', 'text-transparent');

    const titleEl = screen.getByText('Audit application performance');
    expect(titleEl).not.toHaveClass('line-through');
  });

  // TC-ITM-003: Overdue task card Figma styling and pulsing badge
  it('TC-ITM-003: should apply rose alert border, tinted bg, and pulsing OVERDUE badge when overdue', () => {
    const overdueTodo: Todo = {
      ...baseTodo,
      dueDate: '2020-01-01T00:00:00.000Z',
      status: 'Pending',
    };

    render(
      <TodoItem
        todo={overdueTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('border-rose-300', 'bg-rose-50/20');

    const overdueBadge = screen.getByText('OVERDUE');
    expect(overdueBadge).toHaveClass('bg-rose-100', 'text-rose-700', 'animate-pulse');

    const dueDateText = screen.getByText(/Due:/i).closest('div');
    expect(dueDateText).toHaveClass('text-rose-600', 'font-medium');
  });

  // TC-ITM-004: Due today task styling without overdue indicator
  it('TC-ITM-004: should render amber Due Today badge and omit OVERDUE badge when due today', () => {
    const today = new Date().toISOString();
    const dueTodayTodo: Todo = {
      ...baseTodo,
      dueDate: today,
      status: 'Pending',
    };

    render(
      <TodoItem
        todo={dueTodayTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const dueTodayBadge = screen.getByText('Due Today');
    expect(dueTodayBadge).toHaveClass('bg-amber-100', 'text-amber-800');
    expect(screen.queryByText('OVERDUE')).toBeNull();
  });

  // TC-ITM-005: Action buttons hover opacity and accessibility
  it('TC-ITM-005: should render edit and delete action buttons with accessible labels and hover styles', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Edit task/i });
    expect(editBtn).toHaveAttribute('title', 'Edit task');
    expect(editBtn.querySelector('svg')).toHaveClass('lucide-pen-line');

    const deleteBtn = screen.getByRole('button', { name: /Delete task/i });
    expect(deleteBtn).toHaveAttribute('title', 'Delete task');
    expect(deleteBtn.querySelector('svg')).toHaveClass('lucide-trash2');
    expect(deleteBtn).toHaveClass('hover:text-rose-600');
  });

  // TC-ITM-006: Metadata footer handles missing optional fields cleanly
  it('TC-ITM-006: should render creation date and omit missing due date and empty description cleanly', () => {
    const minimalTodo: Todo = {
      ...baseTodo,
      description: '',
      dueDate: null,
    };

    render(
      <TodoItem
        todo={minimalTodo}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Created date is always displayed
    expect(screen.getByText(/Created:/i)).toBeInTheDocument();

    // Due date is omitted
    expect(screen.queryByText(/Due:/i)).toBeNull();

    // No description paragraph rendered
    expect(screen.queryByText('Profile heap usage and reduce re-renders.')).toBeNull();
  });
});
