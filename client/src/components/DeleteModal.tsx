import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  todoTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  todoTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white dark:bg-[#303236] rounded-2xl max-w-md w-full shadow-2xl border border-[#E2E4DC] dark:border-[#3E4248] overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 id="delete-modal-title" className="text-lg font-semibold text-[#1F241C] dark:text-[#F1F3F4]">
                Delete Task
              </h3>
              <p className="text-xs sm:text-sm text-[#656C5B] dark:text-[#A0A5AA] mt-1 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-[#1F241C] dark:text-[#F1F3F4]">"{todoTitle}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-[#8E9685] hover:text-[#1F241C] dark:text-[#73787E] dark:hover:text-[#F1F3F4] p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-[#F8F7F3] dark:bg-[#27282C] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#ECEEE6] dark:border-[#34373C]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs sm:text-sm font-medium border border-[#E2E4DC] dark:border-[#3E4248] text-[#656C5B] dark:text-[#A0A5AA] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
