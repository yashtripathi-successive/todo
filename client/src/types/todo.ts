export type Priority = 'Low' | 'Medium' | 'High';
export type TodoStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TodoStatus;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  status?: TodoStatus;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TodoStatus;
  dueDate?: string | null;
  completedAt?: string | null;
}

export interface TodoFilterParams {
  status?: TodoStatus;
  priority?: Priority;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface StatusCounts {
  all: number;
  pending: number;
  inProgress: number;
  completed: number;
}
