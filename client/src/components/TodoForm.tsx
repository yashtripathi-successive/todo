import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { Todo, Priority, TodoStatus, CreateTodoPayload, UpdateTodoPayload } from '../types/todo';

interface TodoFormProps {
  isOpen: boolean;
  initialTodo?: Todo | null;
  onClose: () => void;
  onSubmitCreate: (data: CreateTodoPayload) => Promise<boolean>;
  onSubmitUpdate: (id: string, data: UpdateTodoPayload) => Promise<boolean>;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  isOpen,
  initialTodo,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<TodoStatus>('Pending');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!initialTodo;

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description || '');
      setPriority(initialTodo.priority);
      setStatus(initialTodo.status);
      setDueDate(
        initialTodo.dueDate ? new Date(initialTodo.dueDate).toISOString().split('T')[0] : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
    }
    setErrors({});
  }, [initialTodo, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errs.title = 'Title is required and cannot be whitespace-only.';
    } else if (trimmedTitle.length > 200) {
      errs.title = 'Title cannot exceed 200 characters.';
    }

    if (description && description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing && initialTodo) {
        const payload: UpdateTodoPayload = {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        };
        const success = await onSubmitUpdate(initialTodo._id, payload);
        if (success) onClose();
      } else {
        const payload: CreateTodoPayload = {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        };
        const success = await onSubmitCreate(payload);
        if (success) onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="todo-form-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 id="todo-form-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="todo-title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {title.trim().length}/200
                </span>
              </div>
              <input
                id="todo-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete quarterly financial review"
                maxLength={200}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200 dark:focus:ring-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100'
                    : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                }`}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="todo-desc" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {description.length}/1000
                </span>
              </div>
              <textarea
                id="todo-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add extra context or details for this task..."
                maxLength={1000}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200 dark:focus:ring-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100'
                    : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="todo-priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  id="todo-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="todo-status" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  id="todo-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TodoStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="todo-due-date" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due Date <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="todo-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
