import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from '../components/TodoForm';
import { Todo } from '../types/todo';

const mockTodo: Todo = {
  _id: 'todo-999',
  title: 'Refactor authentication state',
  description: 'Migrate tokens to HttpOnly cookies.',
  priority: 'High',
  status: 'In Progress',
  dueDate: '2026-11-20T00:00:00.000Z',
  completedAt: null,
  createdAt: '2026-10-27T10:00:00.000Z',
  updatedAt: '2026-10-27T10:00:00.000Z',
};

describe('TodoForm Component', () => {
  it('TC-FE-008: should not render when isOpen is false', () => {
    const { container } = render(
      <TodoForm
        isOpen={false}
        onClose={vi.fn()}
        onSubmitCreate={vi.fn()}
        onSubmitUpdate={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('TC-FE-009: should render create mode with default fields when isOpen is true', () => {
    render(
      <TodoForm
        isOpen={true}
        onClose={vi.fn()}
        onSubmitCreate={vi.fn()}
        onSubmitUpdate={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Create New Task' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('Medium');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('Pending');
  });

  it('TC-FE-010: should show error message when submitting empty/whitespace title', async () => {
    const handleCreate = vi.fn().mockResolvedValue(true);

    render(
      <TodoForm
        isOpen={true}
        onClose={vi.fn()}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText('Title is required and cannot be whitespace-only.')
    ).toBeInTheDocument();
    expect(handleCreate).not.toHaveBeenCalled();
  });

  it('TC-FE-011: should update character counters as user types', () => {
    render(
      <TodoForm
        isOpen={true}
        onClose={vi.fn()}
        onSubmitCreate={vi.fn()}
        onSubmitUpdate={vi.fn()}
      />
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    fireEvent.change(titleInput, { target: { value: 'Write unit tests' } });

    expect(screen.getByText('16/200')).toBeInTheDocument();
  });

  it('TC-FE-012: should submit valid payload on create', async () => {
    const handleCreate = vi.fn().mockResolvedValue(true);
    const handleClose = vi.fn();

    render(
      <TodoForm
        isOpen={true}
        onClose={handleClose}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: ' Deploy v1.0 ' },
    });
    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: 'High' },
    });

    const submitBtn = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Deploy v1.0',
          priority: 'High',
          status: 'Pending',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('TC-FE-013: should pre-fill fields and submit update in edit mode', async () => {
    const handleUpdate = vi.fn().mockResolvedValue(true);
    const handleClose = vi.fn();

    render(
      <TodoForm
        isOpen={true}
        initialTodo={mockTodo}
        onClose={handleClose}
        onSubmitCreate={vi.fn()}
        onSubmitUpdate={handleUpdate}
      />
    );

    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('Refactor authentication state');
    expect(screen.getByLabelText(/Description/i)).toHaveValue(
      'Migrate tokens to HttpOnly cookies.'
    );
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('High');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('In Progress');

    const submitBtn = screen.getByRole('button', { name: 'Update Task' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledWith(
        'todo-999',
        expect.objectContaining({
          title: 'Refactor authentication state',
          priority: 'High',
          status: 'In Progress',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('TC-FE-014: should call onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();

    render(
      <TodoForm
        isOpen={true}
        onClose={handleClose}
        onSubmitCreate={vi.fn()}
        onSubmitUpdate={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
