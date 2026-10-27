# Task: Todo Application

I want to build a simple, clean, full-stack Todo application using React, Express.js, Node.js, and Mongodb.


## 1. Technology Stack

**Frontend**
- React with Vite
- TypeScript
- Tailwind CSS
- Axios for API requests

**Backend**
- Node.js
- Express.js
- TypeScript
- REST APIs

**Database**
- Mongodb

**Development**
- npm
- Environment variables using `.env`
- ESLint and Prettier

Keep the architecture simple and suitable for a small application. Avoid unnecessary libraries, authentication, Redux, microservices, Docker, or complex infrastructure.

## 2. Application Overview

Build a single-page Todo application where users can create, view, edit, and delete tasks.

The UI should be minimal, responsive, and easy to use.

### UI Requirements

The page should contain:

1. A heading: "My Todo List"
2. A single text input with placeholder "Enter a task..."
3. An "Add Task" button
4. A section displaying all created tasks
5. Each task should display:
   - Task title
   - Edit button
   - Delete button
6. An appropriate empty state when no tasks exist
7. Loading, success, and error feedback where necessary

Use a clean layout with a centered container, consistent spacing, and simple styling.

Do not introduce additional features such as authentication, task priorities, categories, deadlines, or notifications.

## 3. Functional Requirements

### FR-01: Create Task

- Users can enter a task title.
- Clicking "Add Task" saves the task to Mongodb through the backend API.
- Pressing Enter should also submit the task.
- Newly created tasks should appear immediately after successful creation.
- Clear the input only after successful creation.
- Reject empty or whitespace-only tasks.
- Prevent duplicate submissions while a request is pending.

### FR-02: View Tasks

- Fetch saved tasks from Mongodb when the application loads.
- Display tasks in descending order of creation time.
- Display the latest task first.
- Show a friendly empty state when there are no tasks.
- Display loading and error states appropriately.
- Tasks must persist after refreshing the browser.

### FR-03: Edit Task

- Clicking Edit should allow inline editing of the task title.
- Prepopulate the input with the existing title.
- Provide Save and Cancel actions.
- Save should update the existing database record.
- Cancel should discard changes.
- Reject empty or invalid updated titles.
- Avoid API calls when the title has not changed.
- Show the updated title after successful saving.

### FR-04: Delete Task

- Clicking Delete should ask for confirmation.
- Confirming should delete the task from Mongodb.
- Canceling should leave the task unchanged.
- Remove the task from the UI only after successful deletion.
- Display an error if deletion fails.

## 4. Validation Requirements

Define validation on both frontend and backend.

Include:

- Required task title
- Trim leading and trailing whitespace
- Maximum task title length: 255 characters
- Reject whitespace-only input
- Reject invalid request payloads
- Validate task IDs
- Handle nonexistent task IDs
- Handle malformed JSON
- Prevent duplicate API submissions
- Ensure task titles are rendered safely to prevent XSS

Allow two different tasks to have identical titles. Duplicate titles are not prohibited.

## 5. Database Specification

Design a Mongodb `tasks` table .

Required fields:

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| title | VARCHAR(255) | Required |
| createdAt | Timestamp | Automatically generated |
| updatedAt | Timestamp | Automatically updated |

Include database schema definitions, migration requirements, and data integrity considerations.

Use a stable secondary sort by ID when creation timestamps are identical.

## 6. REST API Specification

Define these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

For every endpoint, document:

- Purpose
- Request parameters
- Request body
- Success response
- HTTP status code
- Validation rules
- Error responses
- Example JSON requests and responses

Use appropriate HTTP status codes including 200, 201, 204, 400, 404, 500, and 503.

Define a consistent error response format.

## 7. Edge Cases

Cover at least these scenarios:

1. User submits an empty task.
2. User enters only spaces.
3. User enters more than 255 characters.
4. User submits a task by pressing Enter.
5. User rapidly clicks Add multiple times.
6. User creates two tasks with the same title.
7. User edits a task to an empty value.
8. User cancels editing.
9. User saves an unchanged title.
10. User deletes a task and cancels confirmation.
11. User attempts to edit or delete a nonexistent task.
12. Backend server is unavailable.
13. Mongodb connection fails.
14. API request times out.
15. Page refresh occurs after task creation.
16. Task contains special characters or HTML-like text.
17. Two requests update or delete the same task.
18. User refreshes the page during a pending operation.
19. Network fails after the server has processed a write.
20. Task list is empty.

For each edge case, describe the expected behavior and error handling.

## 8. Acceptance Criteria

Write testable acceptance criteria using Given/When/Then format.

Example:

**AC-01: Successfully create a task**

Given the application is running and the database is available,

When the user enters "Buy groceries" and clicks "Add Task",

Then the task must be saved to MOngodb,

And the new task must appear in the task list,

And the input field must be cleared.

Create acceptance criteria for all major functional requirements, validation rules, error scenarios, and persistence behavior.

## 9. Non-Functional Requirements

Define reasonable expectations for:

- Responsiveness across desktop and mobile
- Basic accessibility and keyboard navigation
- Clear loading and error feedback
- Maintainable TypeScript code
- Database persistence
- Secure environment variable handling
- Basic application security
- API reliability
- Consistent error handling
- Simple local development setup

Do not invent strict performance guarantees without a testing environment.

## 10. Architecture

Propose a simple architecture:

React Frontend
↓
Axios HTTP Requests
↓
Express REST API
↓
Prisma ORM
↓
Mongodb Database

Explain the responsibility of each layer.

Recommend a clean folder structure with separate `client` and `server` directories.

Keep the backend organized into routes, controllers, services, and database configuration without unnecessary abstraction.



