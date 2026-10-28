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

  // --- Additional Figma Redesign, Layout, and Theming Tests ---

  // TC-FLT-001: Active vs Inactive status pill styling
  it('TC-FLT-001: should apply active olive styles to selected pill and transparent style to inactive pills', () => {
    render(
      <TodoFilters
        filters={{ status: 'Pending', priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    expect(pendingBtn).toHaveClass('bg-[#6B7A40]', 'text-white');

    const pendingCount = pendingBtn.querySelector('span:last-child');
    expect(pendingCount).toHaveClass('bg-[#556233]', 'text-white');

    const allBtn = screen.getByRole('button', { name: /^All/i });
    expect(allBtn).toHaveClass('bg-transparent', 'text-[#656C5B]');
  });

  // TC-FLT-002: Search input icon, clear button conditional render and interaction
  it('TC-FLT-002: should render Search icon, show clear button only when query is non-empty, and clear query on click', () => {
    const handleSearch = vi.fn();

    const { rerender } = render(
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

    // When search is empty, clear button is not present
    expect(screen.queryByRole('button', { name: /Clear search/i })).toBeNull();

    // Rerender with active search query
    rerender(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: 'audit' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={handleSearch}
        onClearFilters={vi.fn()}
      />
    );

    const clearSearchBtn = screen.getByRole('button', { name: /Clear search/i });
    expect(clearSearchBtn).toBeInTheDocument();

    fireEvent.click(clearSearchBtn);
    expect(handleSearch).toHaveBeenCalledWith('');
  });

  // TC-FLT-003: Sort selector options and change triggers
  it('TC-FLT-003: should render all 7 sort options and trigger onSortChange correctly', () => {
    const handleSort = vi.fn();

    render(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={handleSort}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const sortSelect = screen.getByRole('combobox', { name: /Sort tasks/i });
    expect(sortSelect).toBeInTheDocument();

    // Verify option elements count
    const options = sortSelect.querySelectorAll('option');
    expect(options).toHaveLength(7);

    // Test sort by due date ascending
    fireEvent.change(sortSelect, { target: { value: 'dueDate-asc' } });
    expect(handleSort).toHaveBeenCalledWith('dueDate', 'asc');

    // Test sort by priority descending
    fireEvent.change(sortSelect, { target: { value: 'priority-desc' } });
    expect(handleSort).toHaveBeenCalledWith('priority', 'desc');

    // Test sort by title ascending
    fireEvent.change(sortSelect, { target: { value: 'title-asc' } });
    expect(handleSort).toHaveBeenCalledWith('title', 'asc');
  });

  // TC-FLT-004: Priority selector options and clearing priority
  it('TC-FLT-004: should allow selecting "All Priorities" to clear priority filter', () => {
    const handlePriority = vi.fn();

    render(
      <TodoFilters
        filters={{ status: undefined, priority: 'High', sortBy: 'createdAt', sortOrder: 'desc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={handlePriority}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: /Filter by priority/i });
    fireEvent.change(select, { target: { value: '' } });

    expect(handlePriority).toHaveBeenCalledWith(undefined);
  });

  // TC-FLT-005: Toolbar layout, aria-label, and uniform 40px height
  it('TC-FLT-005: should render toolbar container with aria-label, rounded-2xl, and h-10 controls', () => {
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

    const toolbar = screen.getByRole('region', { name: /Filter and search toolbar/i });
    expect(toolbar).toHaveClass('rounded-2xl', 'p-2.5', 'border');

    const searchInput = screen.getByPlaceholderText(/Search tasks by title/i);
    expect(searchInput).toHaveClass('h-10', 'rounded-xl');

    const prioritySelect = screen.getByRole('combobox', { name: /Filter by priority/i });
    expect(prioritySelect).toHaveClass('h-10', 'rounded-xl');
  });

  // TC-FLT-006: Conditional rendering of Clear all filters button
  it('TC-FLT-006: should hide clear button when default filters and show when sort is changed', () => {
    const { rerender } = render(
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

    expect(screen.queryByRole('button', { name: /Clear all filters/i })).toBeNull();

    // When sorting differs from default 'createdAt', button appears
    rerender(
      <TodoFilters
        filters={{ status: undefined, priority: undefined, sortBy: 'dueDate', sortOrder: 'asc', search: '' }}
        counts={mockCounts}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
        onSortChange={vi.fn()}
        onSearchChange={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear all filters/i });
    expect(clearBtn).toBeInTheDocument();
    expect(clearBtn.querySelector('svg')).toHaveClass('lucide-rotate-ccw');
  });
});
