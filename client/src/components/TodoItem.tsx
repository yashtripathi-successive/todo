import React from 'react';
import { Calendar, CheckCircle2, Clock, Edit3, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';
import { PriorityBadge, StatusBadge } from './common/Badge';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isCompleted = todo.status === 'Completed';

  // Overdue calculation
  const isOverdue = React.useMemo(() => {
    if (!todo.dueDate || isCompleted) return false;
    const due = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }, [todo.dueDate, isCompleted]);

  // Due today calculation
  const isDueToday = React.useMemo(() => {
    if (!todo.dueDate || isCompleted) return false;
    const due = new Date(todo.dueDate);
    const today = new Date();
    return (
      due.getDate() === today.getDate() &&
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  }, [todo.dueDate, isCompleted]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80'
          : isOverdue
          ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Complete Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(todo._id)}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-teal-500 border-teal-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-transparent hover:text-slate-300 dark:hover:text-slate-600'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <CheckCircle2 className="w-4 h-4 fill-current stroke-white" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />

            {isOverdue && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse">
                OVERDUE
              </span>
            )}
            {isDueToday && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Due Today
              </span>
            )}
          </div>

          <h3
            className={`text-base font-semibold text-slate-800 dark:text-slate-100 break-words leading-snug transition-colors ${
              isCompleted ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : ''
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p
              className={`mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Meta & Timestamps */}
          <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
            {todo.dueDate && (
              <div
                className={`flex items-center gap-1 ${
                  isOverdue ? 'text-rose-600 dark:text-rose-400 font-medium' : ''
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Due: {formatDate(todo.dueDate)}</span>
              </div>
            )}

            {isCompleted && todo.completedAt && (
              <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed: {formatDateTime(todo.completedAt)}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {formatDate(todo.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo)}
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
