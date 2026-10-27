import { Request, Response, NextFunction } from 'express';
import { todoService } from '../services/todo.service';

export class TodoController {
  async getTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todos = await todoService.getTodos(req.query as any);
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  }

  async getCounts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counts = await todoService.getCounts();
      res.status(200).json(counts);
    } catch (error) {
      next(error);
    }
  }

  async getTodoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await todoService.getTodoById(id);

      if (!todo) {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
        return;
      }

      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  async createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTodo = await todoService.createTodo(req.body);
      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedTodo = await todoService.updateTodo(id, req.body);

      if (!updatedTodo) {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
        return;
      }

      res.status(200).json(updatedTodo);
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await todoService.deleteTodo(id);

      if (!deleted) {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async toggleComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedTodo = await todoService.toggleComplete(id);

      if (!updatedTodo) {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
        return;
      }

      res.status(200).json(updatedTodo);
    } catch (error) {
      next(error);
    }
  }
}

export const todoController = new TodoController();
