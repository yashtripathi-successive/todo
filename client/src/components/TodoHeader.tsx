import React from 'react';
import { CheckSquare, Plus, Sparkles, Sun, Moon } from 'lucide-react';
import { StatusCounts } from '../types/todo';
import { useTheme } from '../hooks/useTheme';

interface TodoHeaderProps {
  counts: StatusCounts;
  onOpenCreateModal: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ counts, onOpenCreateModal }) => {
  const { theme, toggleTheme } = useTheme();
  const completionRate =
    counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                TaskMaster
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Organize, track, and complete your tasks seamlessly
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Progress: {completionRate}%</span>
            <div className="w-14 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden ml-1">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
