import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFilters } from './components/TodoFilters';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { DeleteModal } from './components/DeleteModal';
import { Todo } from './types/todo';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    todos,
    counts,
    loading,
    error,
    notification,
    filters,
    fetchTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleComplete,
    setStatusFilter,
    setPriorityFilter,
    setSort,
    setSearch,
    clearFilters,
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleOpenDelete = (todo: Todo) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!todoToDelete) return;
    setIsDeleting(true);
    try {
      await removeTodo(todoToDelete._id);
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasFilters =
    filters.status !== undefined ||
    filters.priority !== undefined ||
    (filters.search !== undefined && filters.search.trim().length > 0) ||
    filters.sortBy !== 'createdAt';

  return (
    <div className="min-h-screen transition-colors duration-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-[#F8F7F3] dark:bg-[#202124] text-[#1F241C] dark:text-[#F1F3F4]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs sm:text-sm font-medium transition-all transform animate-bounce-subtle ${
            notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 text-rose-800 border-rose-200'
              : 'bg-[#ECF5EE] dark:bg-[#263528] dark:text-emerald-300 dark:border-[#38543B] text-[#166534] border-[#BBF7D0]'
          }`}
          role="status"
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#6B7A40] dark:text-[#C8CDD0] flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <TodoHeader counts={counts} onOpenCreateModal={handleOpenCreate} />

        {/* Unified Single Horizontal Toolbar */}
        <TodoFilters
          filters={filters}
          counts={counts}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={setSort}
          onSearchChange={setSearch}
          onClearFilters={clearFilters}
        />

        {/* Active Filters & Counter Meta Bar */}
        <div className="flex items-center justify-between text-xs px-1 text-[#656C5B] dark:text-[#A0A5AA] -mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-[#1F241C] dark:text-[#F1F3F4]">{todos.length}</strong> of{' '}
              <strong className="text-[#1F241C] dark:text-[#F1F3F4]">{counts.all}</strong> tasks
            </span>
            {filters.status && (
              <span className="px-2 py-0.5 rounded-full text-[11px] border bg-[#EDF1E5] dark:bg-[#3A3E43] text-[#536031] dark:text-[#D0D5D8] border-[#ECEEE6] dark:border-[#34373C]">
                Status: {filters.status}
              </span>
            )}
            {filters.priority && (
              <span className="px-2 py-0.5 rounded-full text-[11px] border bg-[#EDF1E5] dark:bg-[#3A3E43] text-[#536031] dark:text-[#D0D5D8] border-[#ECEEE6] dark:border-[#34373C]">
                Priority: {filters.priority}
              </span>
            )}
          </div>
        </div>

        {/* Todo List Grid */}
        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onRetry={fetchTodos}
          onToggleComplete={toggleComplete}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onOpenCreate={handleOpenCreate}
          hasFilters={!!hasFilters}
        />

        {/* Create / Edit Form Modal */}
        <TodoForm
          isOpen={isFormOpen}
          initialTodo={editingTodo}
          onClose={handleCloseForm}
          onSubmitCreate={addTodo}
          onSubmitUpdate={updateTodo}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          todoTitle={todoToDelete?.title || ''}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setTodoToDelete(null);
          }}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
