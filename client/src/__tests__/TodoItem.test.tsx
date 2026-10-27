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
});
