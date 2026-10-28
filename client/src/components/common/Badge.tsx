import React from 'react';
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Priority, TodoStatus } from '../../types/todo';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    Low: 'bg-[#EDF1E6] dark:bg-slate-800/60 text-[#4E5B2E] dark:text-slate-300 border-[#DCE2D1] dark:border-slate-700/60',
    Medium: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    High: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
  }[priority] || 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const dotStyles = {
    Low: 'bg-[#6B7A40] dark:bg-slate-400',
    Medium: 'bg-amber-500',
    High: 'bg-rose-500',
  }[priority] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}
      role="status"
      aria-label={`Priority ${priority}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      {priority}
    </span>
  );
};

interface StatusBadgeProps {
  status: TodoStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeConfig = {
    Pending: {
      className: 'bg-[#FFFBEB] dark:bg-[#3A3832] text-[#92400E] dark:text-amber-300 border-[#FDE68A] dark:border-[#534C38]',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    'In Progress': {
      className: 'bg-[#F0F5ED] dark:bg-[#29323A] text-[#4F622C] dark:text-sky-300 border-[#D4DEC5] dark:border-[#384654]',
      icon: <PlayCircle className="w-3.5 h-3.5" />,
    },
    Completed: {
      className: 'bg-[#ECF5EE] dark:bg-[#263528] text-[#166534] dark:text-emerald-300 border-[#BBF7D0] dark:border-[#38543B]',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  }[status] || {
    className: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeConfig.className}`}
      role="status"
      aria-label={`Status ${status}`}
    >
      {badgeConfig.icon}
      <span>{status}</span>
    </span>
  );
};
