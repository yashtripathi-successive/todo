
import { Todo, ITodo } from '../models/todo.model';
import { CreateTodoInput, UpdateTodoInput, QueryTodoInput } from '../validators/todo.validator';

export class TodoService {
  async getTodos(query: QueryTodoInput): Promise<ITodo[]> {
    const filter: Record<string, any> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search && query.search.trim()) {
      filter.$or = [
        { title: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
      ];
    }

    let todosQuery = Todo.find(filter);

    if (query.sortBy === 'priority') {
      // Custom sorting for priority: High (1) -> Medium (2) -> Low (3)
      const order = query.sortOrder === 'desc' ? -1 : 1;
      const todos = await todosQuery.exec();
      const priorityWeights: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return todos.sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        return (weightA - weightB) * order;
      });
    }

    if (query.sortBy === 'dueDate') {
      const order = query.sortOrder === 'desc' ? -1 : 1;
      todosQuery = todosQuery.sort({ dueDate: order, createdAt: -1 });
    } else {
      const order = query.sortOrder === 'asc' ? 1 : -1;
      const sortField = query.sortBy || 'createdAt';
      todosQuery = todosQuery.sort({ [sortField]: order });
    }

    return await todosQuery.exec();
  }

  async getTodoById(id: string): Promise<ITodo | null> {
    return await Todo.findById(id).exec();
  }

  async createTodo(data: CreateTodoInput): Promise<ITodo> {
    const newTodo = new Todo({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      completedAt: data.status === 'Completed' ? new Date() : null,
    });
    return await newTodo.save();
  }

  async updateTodo(id: string, updates: UpdateTodoInput): Promise<ITodo | null> {
    const existing = await Todo.findById(id);
    if (!existing) {
      return null;
    }

    if (updates.status !== undefined) {
      if (updates.status === 'Completed' && existing.status !== 'Completed') {
        updates.completedAt = updates.completedAt || new Date().toISOString();
      } else if (updates.status !== 'Completed' && existing.status === 'Completed') {
        updates.completedAt = null;
      }
    }

    const formattedUpdates: Record<string, any> = { ...updates };
    if (updates.dueDate !== undefined) {
      formattedUpdates.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    }
    if (updates.completedAt !== undefined) {
      formattedUpdates.completedAt = updates.completedAt ? new Date(updates.completedAt) : null;
    }

    return await Todo.findByIdAndUpdate(id, formattedUpdates, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async deleteTodo(id: string): Promise<boolean> {
    const result = await Todo.findByIdAndDelete(id).exec();
    return !!result;
  }

  async toggleComplete(id: string): Promise<ITodo | null> {
    const existing = await Todo.findById(id);
    if (!existing) {
      return null;
    }

    const isCurrentlyCompleted = existing.status === 'Completed';
    const newStatus = isCurrentlyCompleted ? 'Pending' : 'Completed';
    const completedAt = isCurrentlyCompleted ? null : new Date();

    existing.status = newStatus;
    existing.completedAt = completedAt;

    return await existing.save();
  }

  async getCounts(): Promise<{ all: number; pending: number; inProgress: number; completed: number }> {
    const [all, pending, inProgress, completed] = await Promise.all([
      Todo.countDocuments(),
      Todo.countDocuments({ status: 'Pending' }),
      Todo.countDocuments({ status: 'In Progress' }),
      Todo.countDocuments({ status: 'Completed' }),
    ]);

    return { all, pending, inProgress, completed };
  }
}

export const todoService = new TodoService();
