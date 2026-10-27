# Todo App (TaskMaster)

A modern full-stack Todo application built with React, Vite, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- **Create & Edit Todos**: Title (1-200 chars), Description (up to 1000 chars), Priority (Low, Medium, High), Due Date, and Status (Pending, In Progress, Completed).
- **Completion Tracking**: Single-click completion toggle with strikethrough, visual status indicators, and completion timestamp.
- **Priority & Due Date Indicators**: Distinct color badges for priorities, formatted due dates, and prominent overdue alerts.
- **Real-time Status Filtering & Counts**: Filter by status (All, Pending, In Progress, Completed) with live counter badges.
- **Sorting & Search**: Sort by due date, priority weight, or creation time, alongside real-time search.
- **Safe Deletion**: Confirmation modal prevents accidental task removal.
- **Resilient MongoDB Setup**: Connects to your configured `MONGODB_URI` or seamlessly boots an in-memory MongoDB instance for zero-configuration development.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Backend Server

Navigate to the `server` directory:
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000` with API routes at `/api/todos`.

To run automated integration tests:
```bash
npm test
```

### 3. Frontend Client

Open a second terminal and navigate to `client`:
```bash
cd client
npm install
npm run dev
```
The client Vite application will run on `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/todos` | List all tasks (supports `status`, `priority`, `sortBy`, `sortOrder`, `search`) |
| `GET` | `/api/todos/counts` | Retrieve task counts per status |
| `GET` | `/api/todos/:id` | Get single task details |
| `POST` | `/api/todos` | Create a new task (Zod validated) |
| `PUT` | `/api/todos/:id` | Update task details |
| `PATCH`| `/api/todos/:id/complete`| Toggle completion status |
| `DELETE`| `/api/todos/:id` | Delete task permanently |
| `GET` | `/health` | Server health check |
