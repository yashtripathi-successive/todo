import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFilters } from '../components/TodoFilters';

const mockCounts = {
  all: 10,
  pending: 5,
  inProgress: 3,
  completed: 2,
};

describe('TodoFilters Component', () => {
  it('TC-FE-015: should render status tabs with counts', () => {
    render(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('TC-FE-016 & TC-FE-017: should trigger onStatusChange when tab is clicked', () => {
    const handleStatusChange = vi.fn();

    render(
      <TodoFilters
        filters={{ status: 'Pending', priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={handleStatusChange}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const completedTab = screen.getByRole('button', { name: /Completed/i });
    fireEvent.click(completedTab);

    expect(handleStatusChange).toHaveBeenCalledWith('Completed');
  });

  it('TC-FE-018: should trigger onSearchChange when typing in search input', () => {
    const handleSearch = vi.fn();

    render(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={handleSearch}
        onClearFilters={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search tasks by title/i);
    fireEvent.change(searchInput, { target: { value: 'database' } });

    expect(handleSearch).toHaveBeenCalledWith('database');
  });

  it('TC-FE-019: should trigger onPriorityChange when priority filter is selected', () => {
    const handlePriority = vi.fn();

    render(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={handlePriority}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: /Filter by priority/i });
    fireEvent.change(select, { target: { value: 'High' } });

    expect(handlePriority).toHaveBeenCalledWith('High');
  });

  it('TC-FE-021: should display Clear all filters and trigger callback', () => {
    const handleClear = vi.fn();

    render(
      <TodoFilters
        filters={{ status: 'Completed', priority: 'High', sortBy: 'dueDate', sortOrder: 'asc', search: 'audit' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear all filters/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalled();
  });
});
