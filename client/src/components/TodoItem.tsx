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
    <article
      className={`group rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between relative hover:-translate-y-0.5 bg-white dark:bg-[#303236] shadow-[0_2px_8px_-2px_rgba(35,45,20,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_20px_-4px_rgba(35,45,20,0.1)] dark:hover:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.45)] ${
        isCompleted
          ? 'border-[#DDE6D3] dark:border-[#354336] bg-[#FBFBF9] dark:bg-[#303236]/90'
          : isOverdue
          ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/20'
          : 'border-[#E2E4DC] dark:border-[#3E4248] hover:border-[#6B7A40]/40 dark:hover:border-[#C8CDD0]/40'
      }`}
    >
      {/* Top Row: Complete toggle, Title, Description, and Actions */}
      <div className="flex items-start gap-3.5">
        {/* Toggle Complete Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(todo._id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            isCompleted
              ? 'bg-[#6B7A40] dark:bg-[#C8CDD0] border-[#6B7A40] dark:border-[#C8CDD0] text-white dark:text-[#202124]'
              : 'bg-[#F0EFE9] dark:bg-[#27282C] border-[#E2E4DC] dark:border-[#3E4248] hover:border-[#6B7A40] dark:hover:border-[#C8CDD0] text-transparent'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <CheckCircle2 className="w-4 h-4 fill-current stroke-white dark:stroke-[#202124]" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
            className={`text-base font-semibold text-[#1F241C] dark:text-[#F1F3F4] break-words leading-snug transition-colors ${
              isCompleted ? 'line-through text-[#8E9685] dark:text-[#73787E] font-normal' : ''
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p
              className={`mt-1.5 text-xs sm:text-sm text-[#656C5B] dark:text-[#A0A5AA] whitespace-pre-wrap break-words leading-relaxed ${
                isCompleted ? 'line-through text-[#8E9685] dark:text-[#73787E]' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>

        {/* Card Top Right Actions: Edit & Delete */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="p-1.5 text-[#656C5B] dark:text-[#A0A5AA] hover:text-[#1F241C] dark:hover:text-[#F1F3F4] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo)}
            className="p-1.5 text-[#8E9685] dark:text-[#73787E] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="mt-4 pt-3.5 border-t border-[#ECEEE6] dark:border-[#34373C] flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#656C5B] dark:text-[#A0A5AA]">
        <div className="flex items-center gap-3 flex-wrap">
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
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed: {formatDateTime(todo.completedAt)}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[#8E9685] dark:text-[#73787E]">
            <Clock className="w-3.5 h-3.5" />
            <span>Created: {formatDate(todo.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
