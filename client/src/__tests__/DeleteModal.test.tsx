import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteModal } from '../components/DeleteModal';

describe('DeleteModal Component', () => {
  it('TC-FE-022: should not render when isOpen is false', () => {
    const { container } = render(
      <DeleteModal
        isOpen={false}
        todoTitle="Clean workspace"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('TC-FE-023: should render modal and display the targeted task title', () => {
    render(
      <DeleteModal
        isOpen={true}
        todoTitle="Delete old logs"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Delete Task' })).toBeInTheDocument();
    expect(screen.getByText(/"Delete old logs"/i)).toBeInTheDocument();
  });

  it('TC-FE-024: should call onConfirm when Delete Task button is clicked', () => {
    const handleConfirm = vi.fn();

    render(
      <DeleteModal
        isOpen={true}
        todoTitle="Task to delete"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete Task' });
    fireEvent.click(deleteBtn);
    expect(handleConfirm).toHaveBeenCalled();
  });

  it('TC-FE-025: should call onCancel when Cancel button is clicked', () => {
    const handleCancel = vi.fn();

    render(
      <DeleteModal
        isOpen={true}
        todoTitle="Task to keep"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalled();
  });
});
