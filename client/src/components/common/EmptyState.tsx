import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'You have no tasks matching the selected filters. Create a new task to get started!',
  actionText = 'Create Task',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center bg-white dark:bg-[#303236] rounded-2xl border border-[#E2E4DC] dark:border-[#3E4248] shadow-[0_2px_8px_-2px_rgba(35,45,20,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)]">
      <div className="w-16 h-16 bg-[#F0EFE9] dark:bg-[#27282C] text-[#6B7A40] dark:text-[#C8CDD0] rounded-2xl flex items-center justify-center mb-4 transition-all shadow-sm">
        <CheckSquare className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1F241C] dark:text-[#F1F3F4] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#656C5B] dark:text-[#A0A5AA] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B7A40] hover:bg-[#5A6836] dark:bg-[#C8CDD0] dark:hover:bg-[#DBE0E3] text-white dark:text-[#202124] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
