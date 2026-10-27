import { useState, useEffect, useCallback } from 'react';
import {
  Todo,
  CreateTodoPayload,
  UpdateTodoPayload,
  TodoFilterParams,
  StatusCounts,
  TodoStatus,
  Priority,
} from '../types/todo';
import { todoApi } from '../services/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({
    all: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [filters, setFilters] = useState<TodoFilterParams>({
    status: undefined,
    priority: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const refreshCounts = useCallback(async () => {
    try {
      const data = await todoApi.getCounts();
      setCounts(data);
    } catch (err) {
      console.error('Failed to load status counts:', err);
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoApi.getTodos(filters);
      setTodos(data);
      await refreshCounts();
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || 'Failed to fetch tasks from server';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshCounts]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (payload: CreateTodoPayload): Promise<boolean> => {
    try {
      const created = await todoApi.createTodo(payload);
      setTodos((prev) => [created, ...prev]);
      await refreshCounts();
      showNotification('Task created successfully!');
      return true;
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Failed to create task';
      showNotification(message, 'error');
      return false;
    }
  };

  const updateTodo = async (id: string, payload: UpdateTodoPayload): Promise<boolean> => {
    try {
      const updated = await todoApi.updateTodo(id, payload);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      await refreshCounts();
      showNotification('Task updated successfully!');
      return true;
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Failed to update task';
      showNotification(message, 'error');
      return false;
    }
  };

  const removeTodo = async (id: string): Promise<boolean> => {
    const originalTodos = [...todos];
    // Optimistic removal
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      await todoApi.deleteTodo(id);
      await refreshCounts();
      showNotification('Task deleted permanently.');
      return true;
    } catch (err: any) {
      setTodos(originalTodos);
      const message = err.response?.data?.message || 'Failed to delete task';
      showNotification(message, 'error');
      return false;
    }
  };

  const toggleComplete = async (id: string): Promise<boolean> => {
    try {
      const updated = await todoApi.toggleComplete(id);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      await refreshCounts();
      const statusText =
        updated.status === 'Completed' ? 'Task marked as completed!' : 'Task reopened!';
      showNotification(statusText);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update task status';
      showNotification(message, 'error');
      return false;
    }
  };

  const setStatusFilter = (status?: TodoStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setPriorityFilter = (priority?: Priority) => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const setSort = (
    sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title',
    sortOrder: 'asc' | 'desc'
  ) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      priority: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: '',
    });
  };

  return {
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
  };
}
