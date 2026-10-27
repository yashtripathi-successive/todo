import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  queryTodoSchema,
} from '../validators/todo.validator';

const router = Router();

// Counts endpoint before :id to prevent collision
router.get('/counts', (req, res, next) => todoController.getCounts(req, res, next));

// Main Todo CRUD routes
router.get('/', validateQuery(queryTodoSchema), (req, res, next) =>
  todoController.getTodos(req, res, next)
);

router.get('/:id', (req, res, next) => todoController.getTodoById(req, res, next));

router.post('/', validateBody(createTodoSchema), (req, res, next) =>
  todoController.createTodo(req, res, next)
);

router.put('/:id', validateBody(updateTodoSchema), (req, res, next) =>
  todoController.updateTodo(req, res, next)
);

router.delete('/:id', (req, res, next) => todoController.deleteTodo(req, res, next));

router.patch('/:id/complete', (req, res, next) =>
  todoController.toggleComplete(req, res, next)
);

export default router;
