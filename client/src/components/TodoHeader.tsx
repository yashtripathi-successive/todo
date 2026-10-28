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
  const isDark = theme === 'dark';

  return (
    <header className="rounded-2xl p-5 sm:p-6 transition-all border flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white dark:bg-[#303236] border-[#E2E4DC] dark:border-[#3E4248] shadow-[0_2px_8px_-2px_rgba(35,45,20,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)] mb-6">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 bg-[#6B7A40] dark:bg-[#3C4045] text-white"
        >
          <CheckSquare className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F241C] dark:text-[#F1F3F4]">
              TaskMaster
            </h1>
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-md border bg-[#EDF1E5] dark:bg-[#3A3E43] text-[#536031] dark:text-[#D0D5D8] border-[#ECEEE6] dark:border-[#34373C]"
            >
              {isDark ? 'Dark Theme' : 'Light Theme (Olive)'}
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-0.5 text-[#656C5B] dark:text-[#A0A5AA]">
            Organize, track, and complete your tasks seamlessly
          </p>
        </div>
      </div>

      {/* Actions & Stats */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start md:self-auto">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-[#F0EFE9] dark:bg-[#27282C] border-[#E2E4DC] dark:border-[#3E4248] text-[#1F241C] dark:text-[#F1F3F4]"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#6B7A40]" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Progress Meter Bar */}
        <div
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl border text-xs bg-[#F0EFE9] dark:bg-[#27282C] border-[#E2E4DC] dark:border-[#3E4248]"
        >
          <Sparkles
            className="w-4 h-4 shrink-0 text-[#6B7A40] dark:text-[#C8CDD0]"
          />
          <div className="flex flex-col gap-1 min-w-[110px] sm:min-w-[130px]">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-[#656C5B] dark:text-[#A0A5AA]">Progress: {completionRate}%</span>
              <span className="font-semibold text-[#1F241C] dark:text-[#F1F3F4]">
                {completionRate}%
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden bg-[#DDE1D4] dark:bg-[#3E4248]"
            >
              <div
                className="h-full rounded-full transition-all duration-500 bg-[#6B7A40] dark:bg-[#C8CDD0]"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* New Task Button */}
        <button
          onClick={onOpenCreateModal}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-[#6B7A40] hover:bg-[#5A6836] dark:bg-[#C8CDD0] dark:hover:bg-[#DBE0E3] text-white dark:text-[#202124]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
