import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middleware/error.middleware';

// Load .env from server directory as well as process.cwd()
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to cwd

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/todos', todoRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Server Startup
export const startServer = async (port: number | string = PORT) => {
  await connectDB();
  return app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log(`API endpoints accessible at http://localhost:${port}/api/todos`);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
