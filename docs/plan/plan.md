
# Todo App - Implementation Plan

## 1. Project Overview & Architecture

### 1.1 Objective
Build a robust, responsive, full-stack Todo application based on the specifications. The application enables users to create, edit, delete, complete, filter, and sort tasks with priorities and due dates.

### 1.2 Tech Stack
- **Frontend**: React 18+ with Vite, TypeScript, Tailwind CSS, Lucide React (icons)
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod (for request payload and form validation)
- **API Client**: Axios

### 1.3 Folder Structure
```
project-gemini/
└── todo-app/
    ├── docs/
    │   ├── specs/
    │   │   └── todo-spec.md
    │   └── plan/
    │       └── plan.md
    ├── server/
    │   ├── src/
    │   │   ├── config/
    │   │   │   └── db.ts
    │   │   ├── models/
    │   │   │   └── todo.model.ts
    │   │   ├── validators/
    │   │   │   └── todo.validator.ts
    │   │   ├── services/
    │   │   │   └── todo.service.ts
    │   │   ├── controllers/
    │   │   │   └── todo.controller.ts
    │   │   ├── routes/
    │   │   │   └── todo.routes.ts
    │   │   ├── middleware/
    │   │   │   ├── error.middleware.ts
    │   │   │   └── validate.middleware.ts
    │   │   └── app.ts
    │   ├── .env.example
    │   ├── tsconfig.json
    │   └── package.json
    └── client/
        ├── src/
        │   ├── types/
        │   │   └── todo.ts
        │   ├── services/
        │   │   └── api.ts
        │   ├── hooks/
        │   │   └── useTodos.ts
        │   ├── components/
        │   │   ├── TodoHeader.tsx
        │   │   ├── TodoForm.tsx
        │   │   ├── TodoList.tsx
        │   │   ├── TodoItem.tsx
        │   │   ├── TodoFilters.tsx
        │   │   ├── DeleteModal.tsx
        │   │   └── common/
        │   │       ├── Badge.tsx
        │   │       ├── Spinner.tsx
        │   │       └── EmptyState.tsx
        │   ├── App.tsx
        │   ├── main.tsx
        │   └── index.css
        ├── tailwind.config.js
        ├── postcss.config.js
        ├── tsconfig.json
        ├── vite.config.ts
        └── package.json
```

---

## 2. Data Model & Validation Design

### 2.1 Todo Data Contract
| Field | Type | Required | Default | Constraints / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId / String | Auto | Generated | MongoDB primary key |
| `title` | String | Yes | - | 1-200 characters, trimmed, cannot be whitespace-only |
| `description` | String | No | `""` | Max 1000 characters |
| `priority` | String Enum | Yes | - | Values: `'Low'`, `'Medium'`, `'High'` |
| `status` | String Enum | Yes | `'Pending'` | Values: `'Pending'`, `'In Progress'`, `'Completed'` |
| `dueDate` | Date / ISO String | No | `null` | Must be valid date; flagged as overdue if past & not completed |
| `completedAt` | Date / ISO String | No | `null` | Set when status becomes 'Completed', cleared if toggled back |
| `createdAt` | Date / ISO String | Auto | Current Time | Immutable |
| `updatedAt` | Date / ISO String | Auto | Current Time | Auto-updated on modification |

### 2.2 Zod Validation Schemas
- **Create Todo Schema**:
  - `title`: string, min 1, max 200, trimmed
  - `description`: optional string, max 1000
  - `priority`: enum `['Low', 'Medium', 'High']`
  - `dueDate`: optional ISO string or Date, nullable
  - `status`: optional enum `['Pending', 'In Progress', 'Completed']` (defaults to `'Pending'`)
- **Update Todo Schema**:
  - Partial of Create Todo Schema with additional validation for `completedAt` handling.
- **Query Params Schema**:
  - `status`: optional enum `['Pending', 'In Progress', 'Completed']`
  - `priority`: optional enum `['Low', 'Medium', 'High']`
  - `sortBy`: optional enum `['dueDate', 'priority', 'createdAt']`
  - `sortOrder`: optional enum `['asc', 'desc']`

---

## 3. Backend Implementation Plan

### Step 3.1: Server Scaffolding & Dependencies
- Initialize `server/package.json` with TypeScript configuration.
- Install dependencies:
  - Runtime: `express`, `cors`, `dotenv`, `mongoose`, `zod`
  - Dev: `typescript`, `@types/express`, `@types/cors`, `@types/node`, `ts-node-dev`
- Configure `tsconfig.json` with strict type checking.

### Step 3.2: Database Connection & Configuration
- Create `src/config/db.ts` to manage MongoDB connection with retry logic and graceful shutdown handling.
- Configure environment variables via `.env` (`PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`).

### Step 3.3: Mongoose Model (`todo.model.ts`)
- Define Mongoose Schema matching the exact requirements with timestamps.
- Add index on `status`, `priority`, and `dueDate` for query performance.

### Step 3.4: Controller & Service Layers
- **`todo.service.ts`**:
  - `getTodos(filters, sort)`: Handles filtering by status/priority and sorting (by dueDate or priority weight: High > Medium > Low).
  - `getTodoById(id)`: Fetches single item or throws 404.
  - `createTodo(data)`: Validates and persists new item.
  - `updateTodo(id, updates)`: Updates fields, auto-updates `updatedAt`.
  - `deleteTodo(id)`: Removes todo permanently.
  - `toggleComplete(id)`: Toggles between 'Completed' (sets `completedAt = now`) and 'Pending' (sets `completedAt = null`).
- **`todo.controller.ts`**:
  - Encapsulates HTTP request parsing, status codes (200, 201, 204, 400, 404, 500), and responses.

### Step 3.5: Routing & Middleware
- Express router mapped to `/api/todos`:
  - `GET /api/todos`
  - `GET /api/todos/:id`
  - `POST /api/todos`
  - `PUT /api/todos/:id`
  - `DELETE /api/todos/:id`
  - `PATCH /api/todos/:id/complete`
- Validation middleware using Zod (`validateBody`, `validateQuery`).
- Centralized error handling middleware (`error.middleware.ts`) formatting standardized error payloads: `{ error: string, details?: any }`.

---

## 4. Frontend Implementation Plan

### Step 4.1: Client Scaffolding & Setup
- Initialize Vite React + TypeScript template in `client/`.
- Install dependencies: `axios`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`.
- Configure `tailwind.config.js` with color schemes for priorities (High: red, Medium: yellow/amber, Low: blue/green) and overdue alerts.

### Step 4.2: API Service & Types
- Define TypeScript interfaces in `client/src/types/todo.ts`.
- Set up configured Axios client in `client/src/services/api.ts` with base URL (`http://localhost:5000/api`) and unified error interceptors.

### Step 4.3: State Management & Custom Hook (`useTodos.ts`)
- Manage todo collection, loading status, active filters, sorting preferences, and error notifications.
- Expose methods: `fetchTodos`, `addTodo`, `editTodo`, `removeTodo`, `toggleCompleteTodo`.
- Implement optimistic UI updates where beneficial, with rollback on network failure.

### Step 4.4: UI Components
1. **`TodoHeader`**: App title, quick summary count of pending vs completed tasks.
2. **`TodoForm`**:
   - Modal or expandable drawer for creating and editing todos.
   - Inputs: Title (with character counter 1-200), Description (optional, max 1000), Priority select (Low, Medium, High), Due Date picker.
   - Client-side Zod validation with immediate error highlighting.
3. **`TodoFilters`**:
   - Status tabs: All, Pending, In Progress, Completed (with counts).
   - Priority filter & Sort dropdown (by Due Date, Priority, Created Date).
   - Clear filters action.
4. **`TodoList` & `TodoItem`**:
   - Individual task card showing title, description, priority badge, due date with overdue indicator (red highlight for overdue non-completed tasks).
   - Strikethrough and subtle opacity for completed tasks.
   - Quick toggle checkbox for completion.
   - Action buttons: Edit, Delete.
5. **`DeleteModal`**:
   - Explicit confirmation modal before permanent deletion.
6. **State Indicators**:
   - Loading skeletons/spinners for async calls.
   - Empty state illustration/message when no todos match filters.
   - Error banner/toast for network or server issues.

---

## 5. Edge Cases & Quality Assurance

### 5.1 Validation & Data Edge Cases
- **Whitespace Titles**: Reject strings that only consist of spaces; sanitize with `.trim()`.
- **Character Limits**: Enforce max length on UI and server; reject input > 200 (title) or > 1000 (description).
- **Overdue Detection**: Tasks with `dueDate < today` AND `status !== 'Completed'` are highlighted as Overdue.
- **Today Due Date**: Tasks due today highlighted with "Due today" indicator.
- **Completion Timestamping**: Auto-populate `completedAt` on completion; clear on un-completing.

### 5.2 UI/UX Edge Cases
- **Empty List**: Informative empty state prompting the user to create their first todo.
- **Long Text Wrapping**: Ensure long unbroken text doesn't overflow container using `break-words`.
- **Responsive Layout**: Seamless experience across mobile, tablet, and desktop viewports.
- **Accessibility**: Meaningful ARIA labels for icon buttons and keyboard-navigable forms/modals.

---

## 6. Execution Milestones & Phased Rollout

| Phase | Description | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Scaffolding & Setup | Server & Client project structures, dependencies, configs, DB connection |
| **Phase 2** | Backend API & DB | Mongoose models, Zod schemas, services, controllers, routes, error handler |
| **Phase 3** | Frontend UI & Integration | Tailwind layout, components, API integration hook, CRUD workflows |
| **Phase 4** | Filters, Sorting & Edge Cases | Status filters with counts, priority/date sorting, overdue highlighting, modal confirmation |
| **Phase 5** | Testing & Verification | Acceptance criteria validation, responsive design check, edge case testing |

---

## 7. Approval & Next Steps
- **Status**: Ready for User Review.
- **Action**: Implementation will begin only after user review and explicit approval.
