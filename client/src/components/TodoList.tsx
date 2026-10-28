import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { Spinner } from './common/Spinner';
import { EmptyState } from './common/EmptyState';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onOpenCreate: () => void;
  hasFilters: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  onRetry,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenCreate,
  hasFilters,
}) => {
  if (loading && todos.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-[#656C5B] dark:text-[#A0A5AA]">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-1">
          Unable to Load Tasks
        </h3>
        <p className="text-sm text-rose-600 dark:text-rose-300 max-w-md mx-auto mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? 'No matching tasks' : 'All clear! No tasks yet'}
        description={
          hasFilters
            ? 'Try adjusting your search query, priority filter, or status tabs to view tasks.'
            : 'Add your first task above to start tracking your daily progress and priorities.'
        }
        actionText="Add New Task"
        onAction={onOpenCreate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
