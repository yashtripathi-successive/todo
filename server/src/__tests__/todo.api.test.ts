import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import { Todo } from '../models/todo.model';

describe('Todo API Integration Test Suite', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  // Health Check
  describe('GET /health', () => {
    it('TC-API-001: should return 200 OK and health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  // POST /api/todos
  describe('POST /api/todos - Creation & Validation', () => {
    it('TC-API-002: should create a new todo with valid required fields', async () => {
      const payload = {
        title: 'Buy groceries',
        priority: 'Medium',
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Buy groceries');
      expect(res.body.priority).toBe('Medium');
      expect(res.body.status).toBe('Pending');
      expect(res.body.description).toBe('');
      expect(res.body.dueDate).toBeNull();
      expect(res.body.completedAt).toBeNull();
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();

      const inDb = await Todo.findById(res.body._id);
      expect(inDb).not.toBeNull();
      expect(inDb?.title).toBe('Buy groceries');
    });

    it('TC-API-003: should create a todo with all optional fields provided', async () => {
      const dueDate = new Date(Date.now() + 86400000).toISOString();
      const payload = {
        title: 'Complete annual tax filing',
        description: 'Gather all W-2s, 1099s, and expense receipts.',
        priority: 'High',
        status: 'In Progress',
        dueDate,
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(payload.title);
      expect(res.body.description).toBe(payload.description);
      expect(res.body.priority).toBe('High');
      expect(res.body.status).toBe('In Progress');
      expect(new Date(res.body.dueDate).toISOString()).toBe(new Date(dueDate).toISOString());
    });

    it('TC-API-004: should reject whitespace-only title with 400 Bad Request', async () => {
      const payload = {
        title: '     ',
        priority: 'Low',
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title cannot be empty or whitespace-only',
          }),
        ])
      );
    });

    it('TC-API-005: should reject title exceeding 200 characters with 400 Bad Request', async () => {
      const payload = {
        title: 'A'.repeat(201),
        priority: 'Medium',
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors[0].field).toBe('title');
    });

    it('TC-API-006: should reject description exceeding 1000 characters with 400', async () => {
      const payload = {
        title: 'Valid Title',
        description: 'D'.repeat(1001),
        priority: 'Low',
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors[0].field).toBe('description');
    });

    it('TC-API-007: should reject invalid priority value with 400', async () => {
      const payload = {
        title: 'Valid Title',
        priority: 'SuperUrgent',
      };

      const res = await request(app).post('/api/todos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].field).toBe('priority');
    });
  });

  // GET /api/todos & Queries
  describe('GET /api/todos - Queries, Filters & Sort', () => {
    beforeEach(async () => {
      await Todo.create([
        {
          title: 'High priority urgent task',
          priority: 'High',
          status: 'Pending',
          dueDate: new Date('2026-11-01'),
        },
        {
          title: 'Medium priority work item',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: new Date('2026-11-10'),
        },
        {
          title: 'Low priority archive clean',
          priority: 'Low',
          status: 'Completed',
          completedAt: new Date(),
          dueDate: new Date('2026-10-15'),
        },
      ]);
    });

    it('TC-API-008: should retrieve all todos', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    it('TC-API-014: should filter todos by status=Completed', async () => {
      const res = await request(app).get('/api/todos?status=Completed');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('Completed');
    });

    it('TC-API-015: should filter todos by priority=High', async () => {
      const res = await request(app).get('/api/todos?priority=High');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].priority).toBe('High');
    });

    it('TC-API-016: should sort todos by dueDate asc', async () => {
      const res = await request(app).get('/api/todos?sortBy=dueDate&sortOrder=asc');
      expect(res.status).toBe(200);
      expect(res.body[0].title).toBe('Low priority archive clean'); // earliest
    });

    it('TC-API-017: should sort todos by priority weight (High > Medium > Low)', async () => {
      const res = await request(app).get('/api/todos?sortBy=priority&sortOrder=desc');
      expect(res.status).toBe(200);
      expect(res.body[0].priority).toBe('High');
      expect(res.body[1].priority).toBe('Medium');
      expect(res.body[2].priority).toBe('Low');
    });
  });

  // GET /api/todos/counts
  describe('GET /api/todos/counts', () => {
    it('TC-API-018: should return correct status counts', async () => {
      await Todo.create([
        { title: 'Task 1', priority: 'Low', status: 'Pending' },
        { title: 'Task 2', priority: 'Medium', status: 'Pending' },
        { title: 'Task 3', priority: 'High', status: 'In Progress' },
        { title: 'Task 4', priority: 'Low', status: 'Completed' },
      ]);

      const res = await request(app).get('/api/todos/counts');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        all: 4,
        pending: 2,
        inProgress: 1,
        completed: 1,
      });
    });
  });

  // GET /api/todos/:id
  describe('GET /api/todos/:id', () => {
    it('TC-API-009: should return a single todo by valid ID', async () => {
      const created = await Todo.create({ title: 'Read documentation', priority: 'Low' });
      const res = await request(app).get(`/api/todos/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(created._id.toString());
      expect(res.body.title).toBe('Read documentation');
    });

    it('TC-API-010: should return 404 for non-existent ObjectId', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/todos/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('not found');
    });
  });

  // PUT /api/todos/:id
  describe('PUT /api/todos/:id', () => {
    it('TC-API-011: should update existing todo details', async () => {
      const created = await Todo.create({
        title: 'Initial Title',
        description: 'Initial Desc',
        priority: 'Low',
      });

      const res = await request(app)
        .put(`/api/todos/${created._id}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Desc',
          priority: 'High',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.description).toBe('Updated Desc');
      expect(res.body.priority).toBe('High');
    });
  });

  // PATCH /api/todos/:id/complete
  describe('PATCH /api/todos/:id/complete', () => {
    it('TC-API-012: should toggle from Pending to Completed and set completedAt', async () => {
      const created = await Todo.create({ title: 'Task to finish', priority: 'Medium' });

      const res = await request(app).patch(`/api/todos/${created._id}/complete`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Completed');
      expect(res.body.completedAt).not.toBeNull();
    });

    it('TC-API-013: should toggle back from Completed to Pending and clear completedAt', async () => {
      const created = await Todo.create({
        title: 'Task already done',
        priority: 'Medium',
        status: 'Completed',
        completedAt: new Date(),
      });

      const res = await request(app).patch(`/api/todos/${created._id}/complete`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Pending');
      expect(res.body.completedAt).toBeNull();
    });
  });

  // DELETE /api/todos/:id
  describe('DELETE /api/todos/:id', () => {
    it('TC-API-019 & TC-API-020: should delete todo and return 204 No Content', async () => {
      const created = await Todo.create({ title: 'Task to be erased', priority: 'Low' });

      const res = await request(app).delete(`/api/todos/${created._id}`);
      expect(res.status).toBe(204);

      const check = await Todo.findById(created._id);
      expect(check).toBeNull();

      const getAgain = await request(app).get(`/api/todos/${created._id}`);
      expect(getAgain.status).toBe(404);
    });
  });
});
