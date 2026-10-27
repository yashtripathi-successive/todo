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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-bounce-subtle ${
            notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 text-rose-800 border-rose-200'
              : 'bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800 text-emerald-800 border-emerald-200'
          }`}
          role="status"
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <TodoHeader counts={counts} onOpenCreateModal={handleOpenCreate} />

        {/* Filters & Search */}
        <TodoFilters
          filters={filters}
          counts={counts}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={setSort}
          onSearchChange={setSearch}
          onClearFilters={clearFilters}
        />

        {/* Todo List */}
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
