import React from 'react';
import { Search, X, ArrowUpDown, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
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
    (filters.search !== undefined && filters.search.trim().length > 0) ||
    filters.sortBy !== 'createdAt';

  return (
    <section
      aria-label="Filter and search toolbar"
      className="rounded-2xl p-2.5 sm:p-3 border transition-all bg-white dark:bg-[#303236] border-[#E2E4DC] dark:border-[#3E4248] shadow-[0_2px_8px_-2px_rgba(35,45,20,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)] mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Status Pills Group: All, Pending, In Progress, Completed */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={`h-10 px-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#6B7A40] dark:bg-[#3C4045] border-[#5A6836] dark:border-[#555B63] text-white shadow-sm'
                    : 'bg-transparent border-transparent text-[#656C5B] dark:text-[#A0A5AA] hover:bg-[#F0EFE9] dark:hover:bg-[#27282C]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#556233] dark:bg-[#27292C] text-white'
                      : 'bg-[#F0EFE9] dark:bg-[#27282C] text-[#8E9685] dark:text-[#73787E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input, Priority Filter, and Sort Menus (Same matched 40px height) */}
        <div className="flex flex-1 items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] h-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#8E9685] dark:text-[#73787E]" />
            </div>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks by title or details..."
              className="w-full h-10 pl-9 pr-8 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none bg-white dark:bg-[#26282B] border-[#E2E4DC] dark:border-[#3E4248] text-[#1F241C] dark:text-[#F1F3F4] placeholder-[#8E9685] dark:placeholder-[#73787E]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#8E9685] hover:text-[#1F241C] dark:text-[#73787E] dark:hover:text-[#F1F3F4]"
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Priority Selector */}
          <div className="relative h-10 min-w-[140px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="w-3.5 h-3.5 text-[#8E9685] dark:text-[#73787E]" />
            </div>
            <select
              aria-label="Filter by priority"
              value={filters.priority || ''}
              onChange={(e) =>
                onPriorityChange(e.target.value ? (e.target.value as Priority) : undefined)
              }
              className="w-full h-10 pl-8 pr-7 rounded-xl text-xs sm:text-sm font-medium border appearance-none transition-all cursor-pointer focus:outline-none bg-white dark:bg-[#26282B] border-[#E2E4DC] dark:border-[#3E4248] text-[#1F241C] dark:text-[#F1F3F4]"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8E9685] dark:text-[#73787E]" />
            </div>
          </div>

          {/* Sort Selector */}
          <div className="relative h-10 min-w-[145px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E9685] dark:text-[#73787E]" />
            </div>
            <select
              aria-label="Sort tasks"
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                onSortChange(by as any, order as any);
              }}
              className="w-full h-10 pl-8 pr-7 rounded-xl text-xs sm:text-sm font-medium border appearance-none transition-all cursor-pointer focus:outline-none bg-white dark:bg-[#26282B] border-[#E2E4DC] dark:border-[#3E4248] text-[#1F241C] dark:text-[#F1F3F4]"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority: High to Low</option>
              <option value="priority-asc">Priority: Low to High</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8E9685] dark:text-[#73787E]" />
            </div>
          </div>

          {/* Active Filter Clear Icon */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              aria-label="Clear all filters"
              title="Clear all filters"
              className="h-10 px-3 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all shrink-0 bg-[#F0EFE9] dark:bg-[#27282C] border-[#E2E4DC] dark:border-[#3E4248] text-[#656C5B] dark:text-[#A0A5AA] hover:opacity-80 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
