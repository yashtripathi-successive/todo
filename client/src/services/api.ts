import axios from 'axios';
import {
  Todo,
  CreateTodoPayload,
  UpdateTodoPayload,
  TodoFilterParams,
  StatusCounts,
} from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const todoApi = {
  async getTodos(params?: TodoFilterParams): Promise<Todo[]> {
    const response = await apiClient.get<Todo[]>('', { params });
    return response.data;
  },

  async getCounts(): Promise<StatusCounts> {
    const response = await apiClient.get<StatusCounts>('/counts');
    return response.data;
  },

  async getTodoById(id: string): Promise<Todo> {
    const response = await apiClient.get<Todo>(`/${id}`);
    return response.data;
  },

  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await apiClient.post<Todo>('', payload);
    return response.data;
  },

  async updateTodo(id: string, payload: UpdateTodoPayload): Promise<Todo> {
    const response = await apiClient.put<Todo>(`/${id}`, payload);
    return response.data;
  },

  async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/${id}`);
  },

  async toggleComplete(id: string): Promise<Todo> {
    const response = await apiClient.patch<Todo>(`/${id}/complete`);
    return response.data;
  },
};
