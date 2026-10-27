import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty or whitespace-only')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
  }),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'))
    .nullable()
    .optional(),
  status: z
    .enum(['Pending', 'In Progress', 'Completed'], {
      errorMap: () => ({ message: 'Status must be Pending, In Progress, or Completed' }),
    })
    .default('Pending')
    .optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty or whitespace-only')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  priority: z
    .enum(['Low', 'Medium', 'High'], {
      errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
    })
    .optional(),
  status: z
    .enum(['Pending', 'In Progress', 'Completed'], {
      errorMap: () => ({ message: 'Status must be Pending, In Progress, or Completed' }),
    })
    .optional(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'))
    .nullable()
    .optional(),
  completedAt: z
    .string()
    .datetime({ offset: true })
    .nullable()
    .optional(),
});

export const queryTodoSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type QueryTodoInput = z.infer<typeof queryTodoSchema>;
