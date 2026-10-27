import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { Priority, TodoStatus, StatusCounts, TodoFilterParams } from '../types/todo';

interface TodoFiltersProps {
  filters: TodoFilterParams;
  counts: StatusCounts;
  onStatusChange: (status?: TodoStatus) => void;
  onPriorityChange: (priority?: Priority) => void;
  onSortChange: (
    sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title',
    sortOrder: 'asc' | 'desc'
  ) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  counts,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onSearchChange,
  onClearFilters,
}) => {
  const statusTabs: { label: string; value?: TodoStatus; count: number }[] = [
    { label: 'All', value: undefined, count: counts.all },
    { label: 'Pending', value: 'Pending', count: counts.pending },
    { label: 'In Progress', value: 'In Progress', count: counts.inProgress },
    { label: 'Completed', value: 'Completed', count: counts.completed },
  ];

  const hasActiveFilters =
    filters.status !== undefined ||
    filters.priority !== undefined ||
    (filters.search && filters.search.trim().length > 0) ||
    filters.sortBy !== 'createdAt';

  return (
    <div className="space-y-4 mb-6">
      {/* Top Filter Bar: Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => onStatusChange(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-700/80 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Second Row: Search, Priority Filter, Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          {filters.search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              aria-label="Filter by priority"
              value={filters.priority || ''}
              onChange={(e) =>
                onPriorityChange(e.target.value ? (e.target.value as Priority) : undefined)
              }
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <div className="relative flex-1">
            <select
              aria-label="Sort tasks"
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                onSortChange(by as any, order as any);
              }}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
