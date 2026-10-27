import mongoose, { Document, Schema } from 'mongoose';

export type Priority = 'Low' | 'Medium' | 'High';
export type TodoStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ITodo extends Document {
  title: string;
  description?: string;
  priority: Priority;
  status: TodoStatus;
  dueDate?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Status must be Pending, In Progress, or Completed',
      },
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
TodoSchema.index({ status: 1 });
TodoSchema.index({ priority: 1 });
TodoSchema.index({ dueDate: 1 });
TodoSchema.index({ createdAt: -1 });

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
