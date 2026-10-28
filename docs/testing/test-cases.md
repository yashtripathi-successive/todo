# Test Cases & Testing Strategy Documentation

## 1. Overview
This document specifies the automated test suites for the Todo Application (**TaskMaster**), mapped to the functional specifications in `docs/specs/todo-spec.md` and architecture in `docs/plan/plan.md`.

---

## 2. Testing Framework Architecture

### 2.1 Backend Testing Stack
- **Framework**: Vitest / Supertest
- **Scope**: REST API Endpoints, Zod Validation Middleware, Service Layer, Database Integration
- **Database Strategy**: In-Memory MongoDB (`mongodb-memory-server`) to ensure isolation and zero external dependencies
- **Test File Location**: `server/src/__tests__/todo.api.test.ts`

### 2.2 Frontend Testing Stack
- **Framework**: Vitest + React Testing Library + `@testing-library/jest-dom` + `jsdom`
- **Scope**: Component Rendering, User Interactions, Form Validation, Filter/Sort State, Delete Confirmation, Theme Switching & Persistence
- **Test File Location**: `client/src/__tests__/`
  - `TodoItem.test.tsx`
  - `TodoForm.test.tsx`
  - `TodoFilters.test.tsx`
  - `DeleteModal.test.tsx`
  - `TodoList.test.tsx`
  - `ThemeContext.test.tsx`
  - `TodoHeader.test.tsx`

---

## 3. Test Cases Specification

### 3.1 Backend API Test Cases (`todo.api.test.ts`)

| Test ID | Method & Endpoint | Description | Expected Status | Validation Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **TC-API-001** | `GET /health` | Health check endpoint | `200 OK` | `{ status: "ok" }` and timestamp returned |
| **TC-API-002** | `POST /api/todos` | Create todo with valid required fields | `201 Created` | Creates todo with default status `Pending`, `dueDate: null`, generated `_id` |
| **TC-API-003** | `POST /api/todos` | Create todo with all fields (title, desc, priority, dueDate) | `201 Created` | All fields correctly persisted and returned |
| **TC-API-004** | `POST /api/todos` | Validation: Reject whitespace-only title | `400 Bad Request` | Fails Zod validation with error message |
| **TC-API-005** | `POST /api/todos` | Validation: Reject title > 200 characters | `400 Bad Request` | Fails Zod validation (`Title cannot exceed 200 characters`) |
| **TC-API-006** | `POST /api/todos` | Validation: Reject description > 1000 characters | `400 Bad Request` | Fails Zod validation (`Description cannot exceed 1000 characters`) |
| **TC-API-007** | `POST /api/todos` | Validation: Reject invalid priority enum value | `400 Bad Request` | Fails Zod validation (`Priority must be Low, Medium, or High`) |
| **TC-API-008** | `GET /api/todos` | Retrieve all todos | `200 OK` | Array containing all created todos |
| **TC-API-009** | `GET /api/todos/:id` | Retrieve single todo by valid ID | `200 OK` | Correct todo object matching ID |
| **TC-API-010** | `GET /api/todos/:id` | Retrieve todo with non-existent ID | `404 Not Found` | Error message indicating todo not found |
| **TC-API-011** | `PUT /api/todos/:id` | Update title, description, and priority | `200 OK` | Updated todo fields returned, `updatedAt` refreshed |
| **TC-API-012** | `PATCH /api/todos/:id/complete` | Toggle status from Pending to Completed | `200 OK` | `status` becomes `Completed`, `completedAt` timestamp populated |
| **TC-API-013** | `PATCH /api/todos/:id/complete` | Toggle status from Completed to Pending | `200 OK` | `status` reverts to `Pending`, `completedAt` cleared to `null` |
| **TC-API-014** | `GET /api/todos?status=Completed` | Filter todos by status | `200 OK` | Only completed todos returned |
| **TC-API-015** | `GET /api/todos?priority=High` | Filter todos by priority | `200 OK` | Only High priority todos returned |
| **TC-API-016** | `GET /api/todos?sortBy=dueDate` | Sort todos by due date | `200 OK` | Todos ordered chronologically by due date |
| **TC-API-017** | `GET /api/todos?sortBy=priority` | Sort todos by priority weight | `200 OK` | Ordered: High -> Medium -> Low |
| **TC-API-018** | `GET /api/todos/counts` | Retrieve status counter metrics | `200 OK` | Returns `{ all, pending, inProgress, completed }` |
| **TC-API-019** | `DELETE /api/todos/:id` | Delete existing todo | `204 No Content` | Record permanently deleted from MongoDB |
| **TC-API-020** | `GET /api/todos/:id` | Fetch previously deleted todo | `404 Not Found` | Verifies permanent deletion |

---

### 3.2 Frontend Component Test Cases

#### A. `TodoItem.test.tsx`
| Test ID | Component / Scenario | Verification |
| :--- | :--- | :--- |
| **TC-FE-001** | Render basic todo item | Renders title, description, priority badge, and status badge |
| **TC-FE-002** | Completed status visual styling | Applies line-through, dimmed text, and displays completion timestamp |
| **TC-FE-003** | Overdue highlighting | Shows red "OVERDUE" badge when `dueDate < today` and task is not completed |
| **TC-FE-004** | Due today indicator | Shows amber "Due Today" badge when task is due today |
| **TC-FE-005** | Toggle complete button | Calls `onToggleComplete(todo._id)` on checkbox click |
| **TC-FE-006** | Edit button trigger | Calls `onEdit(todo)` on edit icon button click |
| **TC-FE-007** | Delete button trigger | Calls `onDelete(todo)` on delete icon button click |

#### B. `TodoForm.test.tsx`
| Test ID | Component / Scenario | Verification |
| :--- | :--- | :--- |
| **TC-FE-008** | Modal visibility | Does not render when `isOpen: false`, renders dialog when `isOpen: true` |
| **TC-FE-009** | Create mode initial values | Form fields default to empty title, medium priority, pending status |
| **TC-FE-010** | Validation: Empty title error | Submitting empty/spaces displays error message and blocks submission |
| **TC-FE-011** | Character counter update | Live character counter reflects title (X/200) and description (X/1000) |
| **TC-FE-012** | Valid submission | Trims inputs, formats payload, and invokes `onSubmitCreate` |
| **TC-FE-013** | Edit mode pre-fill | Pre-populates all inputs with `initialTodo` values and submits via `onSubmitUpdate` |
| **TC-FE-014** | Cancel button | Discards changes and triggers `onClose` |

#### C. `TodoFilters.test.tsx`
| Test ID | Component / Scenario | Verification |
| :--- | :--- | :--- |
| **TC-FE-015** | Status tabs rendering | Displays tabs for All, Pending, In Progress, Completed with badge counts |
| **TC-FE-016** | Active tab indicator | Active status tab has distinct styling (indigo background) |
| **TC-FE-017** | Tab click callback | Clicking tab calls `onStatusChange` with appropriate status |
| **TC-FE-018** | Search input | Typing in search input calls `onSearchChange` |
| **TC-FE-019** | Priority select | Changing priority dropdown triggers `onPriorityChange` |
| **TC-FE-020** | Sort dropdown | Changing sort option triggers `onSortChange` with sort field and direction |
| **TC-FE-021** | Clear filters action | Shows "Clear all filters" when filters are active and calls `onClearFilters` |

#### D. `DeleteModal.test.tsx`
| Test ID | Component / Scenario | Verification |
| :--- | :--- | :--- |
| **TC-FE-022** | Conditional rendering | Only renders when `isOpen: true` |
| **TC-FE-023** | Display task title | Accurately quotes the title of the task to be deleted |
| **TC-FE-024** | Confirm deletion | Clicking "Delete Task" triggers `onConfirm` |
| **TC-FE-025** | Cancel deletion | Clicking "Cancel" or "X" triggers `onCancel` |

#### E. `TodoList.test.tsx`
| Test ID | Component / Scenario | Verification |
| :--- | :--- | :--- |
| **TC-FE-026** | Loading state | Displays spinner when `loading: true` and no todos |
| **TC-FE-027** | Error state | Displays error banner and retry button when `error` prop is set |
| **TC-FE-028** | Empty list state | Displays empty state illustration with action button |
| **TC-FE-029** | Filtered empty state | Displays "No matching tasks" when filters are active |

---

### 3.3 Theme Switcher Test Cases (`docs/specs/theme-spec.md`)

#### A. `ThemeContext.test.tsx`
| Test ID | Scenario / Test Case | Verification Criteria |
| :--- | :--- | :--- |
| **TC-THM-001** | Default theme initialization | When `localStorage` has no `'theme'`, initializes state as `'light'`, sets `data-theme="light"`, ensures `.dark` class is absent, sets `colorScheme="light"`, and syncs `'light'` to `localStorage`. |
| **TC-THM-002** | Toggle theme transition | Calling `toggleTheme` transitions state from `'light'` -> `'dark'` and back to `'light'`. Class `.dark` toggles on `document.documentElement` and `localStorage` is refreshed. |
| **TC-THM-003** | DOM attribute synchronization | Ensures `document.documentElement` `.dark` class, `data-theme`, and `style.colorScheme` are updated synchronously on theme changes. |
| **TC-THM-004** | LocalStorage write persistence | Asserts `localStorage.setItem('theme', ...)` is called with updated theme value on each state transition. |
| **TC-THM-005** | Restore dark theme on mount | Pre-populating `localStorage` with `'dark'` mounts provider in dark mode with `.dark` class and `data-theme="dark"` applied immediately. |
| **TC-THM-006** | Restore light theme on mount | Pre-populating `localStorage` with `'light'` mounts provider in light mode without `.dark` class. |
| **TC-THM-007** | Invalid saved theme fallback | Corrupted `localStorage` values (`'neon'`, `'system'`, `'DARK'`, `''`, `'123'`) fallback safely to `'light'` mode. |
| **TC-THM-008** | Storage unavailable on read (`SecurityError`) | When `localStorage.getItem` throws a `DOMException` (e.g. private browsing mode), catches error, logs warning, and safely defaults to `'light'`. |
| **TC-THM-009** | Storage unavailable on write (`QuotaExceededError`) | When `localStorage.setItem` throws, catches error and allows in-memory state toggle and DOM updates without crashing the application. |
| **TC-THM-010** | Direct `setTheme` invocation | Calling `setTheme('dark')` and `setTheme('light')` switches state properly, while passing invalid strings is ignored. |
| **TC-THM-011** | `initialTheme` prop override | Passing `initialTheme="dark"` overrides `localStorage` values during initialization. |
| **TC-THM-012** | Hook boundary enforcement | Calling `useTheme()` outside a `<ThemeProvider>` throws a descriptive `Error: useTheme must be used within a ThemeProvider`. |
| **TC-THM-013** | Helper: `getStoredTheme` default | Returns `'light'` when storage is empty. |
| **TC-THM-014** | Helper: `getStoredTheme` dark | Returns `'dark'` when `'dark'` is stored. |
| **TC-THM-015** | Helper: `getStoredTheme` invalid | Returns `'light'` when unexpected string is stored. |
| **TC-THM-016** | Helper: `getStoredTheme` error | Catches storage access error and returns `'light'`. |
| **TC-THM-017** | Helper: `setStoredTheme` error | Catches storage write error without throwing unhandled exceptions. |

#### B. `TodoHeader.test.tsx`
| Test ID | Scenario / Test Case | Verification Criteria |
| :--- | :--- | :--- |
| **TC-THM-018** | Theme button rendering | Renders theme toggle button in the header action bar with `type="button"`. |
| **TC-THM-019** | Light mode icon & accessibility | In light mode, button renders `lucide-moon` icon, `aria-label="Switch to dark mode"`, and `title="Switch to dark mode"`. |
| **TC-THM-020** | Dark mode icon & accessibility | In dark mode, button renders `lucide-sun` icon, `aria-label="Switch to light mode"`, and `title="Switch to light mode"`. |
| **TC-THM-021** | Click callback invocation | Clicking the toggle button calls `toggleTheme` function from `useTheme`. |
| **TC-THM-022** | End-to-end toggle integration | Clicking the button inside `ThemeProvider` dynamically updates the icon (Moon <-> Sun), accessible labels, and toggles `.dark` on `document.documentElement`. |
| **TC-THM-023** | Action bar regression protection | Verifies TaskMaster header title, progress bar percentage calculation, and "New Task" modal trigger operate properly alongside the toggle button. |

---

## 4. Requirements Traceability Matrix

| Specification Requirement | Relevant Test Cases |
| :--- | :--- |
| **1. Create Todos** | TC-API-002, TC-API-003, TC-API-004, TC-API-005, TC-API-006, TC-API-007, TC-FE-009, TC-FE-010, TC-FE-011, TC-FE-012 |
| **2. Edit Todos** | TC-API-011, TC-FE-006, TC-FE-013, TC-FE-014 |
| **3. Delete Todos** | TC-API-019, TC-API-020, TC-FE-007, TC-FE-022, TC-FE-023, TC-FE-024, TC-FE-025 |
| **4. Mark Completed** | TC-API-012, TC-API-013, TC-FE-002, TC-FE-005 |
| **5. Filter by Status** | TC-API-014, TC-API-018, TC-FE-015, TC-FE-016, TC-FE-017, TC-FE-021, TC-FE-029 |
| **6. Priority & Due Date** | TC-API-015, TC-API-016, TC-API-017, TC-FE-001, TC-FE-003, TC-FE-004, TC-FE-019, TC-FE-020 |
| **7. Error & Loading States** | TC-API-010, TC-FE-026, TC-FE-027, TC-FE-028 |
| **8. Theme Toggle Button** | TC-THM-018, TC-THM-019, TC-THM-020, TC-THM-021, TC-THM-022 |
| **9. Instant Theme Switch** | TC-THM-002, TC-THM-003, TC-THM-022 |
| **10. LocalStorage Persistence** | TC-THM-004, TC-THM-017 |
| **11. Restore Theme on Refresh** | TC-THM-005, TC-THM-006, TC-THM-014 |
| **12. Default to Light Mode** | TC-THM-001, TC-THM-013 |
| **13. Theme Fallbacks & Safety** | TC-THM-007, TC-THM-008, TC-THM-009, TC-THM-015, TC-THM-016 |
| **14. Zero Regression on Header** | TC-THM-023 |
| **15. Figma Redesign UI & Theming** | TC-BDG-001 - TC-BDG-008, TC-HDR-001 - TC-HDR-005, TC-FLT-001 - TC-FLT-006, TC-ITM-001 - TC-ITM-006, TC-LST-001 - TC-LST-005 |

---

## 5. Figma Redesign UI & Layout Test Cases

### 5.1 Badges Suite (`client/src/__tests__/Badge.test.tsx`)
| Test ID | Component / Scenario | Verification Criteria |
| :--- | :--- | :--- |
| **TC-BDG-001** | `PriorityBadge` Low | Renders Low label, olive palette (`bg-[#EDF1E6]`, text `#4E5B2E`), dot `bg-[#6B7A40]`, `role="status"` |
| **TC-BDG-002** | `PriorityBadge` Medium | Renders Medium label, amber palette (`bg-amber-50`, text `amber-700`), dot `bg-amber-500`, `role="status"` |
| **TC-BDG-003** | `PriorityBadge` High | Renders High label, rose palette (`bg-rose-50`, text `rose-700`), dot `bg-rose-500`, `role="status"` |
| **TC-BDG-004** | `PriorityBadge` Unknown | Renders slate fallback style without crashing |
| **TC-BDG-005** | `StatusBadge` Pending | Renders Pending label, Clock icon, warm yellow-amber palette (`bg-[#FFFBEB]`, text `#92400E`), `role="status"` |
| **TC-BDG-006** | `StatusBadge` In Progress | Renders In Progress label, PlayCircle icon, olive-sage palette (`bg-[#F0F5ED]`, text `#4F622C`), `role="status"` |
| **TC-BDG-007** | `StatusBadge` Completed | Renders Completed label, CheckCircle2 icon, emerald green palette (`bg-[#ECF5EE]`, text `#166534`), `role="status"` |
| **TC-BDG-008** | `StatusBadge` Unknown | Renders slate fallback style and omits icon gracefully |

### 5.2 Header Suite Additions (`client/src/__tests__/TodoHeader.test.tsx`)
| Test ID | Component / Scenario | Verification Criteria |
| :--- | :--- | :--- |
| **TC-HDR-001** | `TodoHeader` Theme Badge | Renders "Light Theme (Olive)" in light mode, and "Dark Theme" in dark mode |
| **TC-HDR-002** | `TodoHeader` Brand Icon | Renders CheckSquare icon with stroke-[2.2] in olive-rounded container |
| **TC-HDR-003** | `TodoHeader` Progress Bar | Dynamic inline CSS width calculation (0%, 70%, 100%) and percentage labels |
| **TC-HDR-004** | `TodoHeader` New Task Button | Renders Plus icon with stroke-[2.5], olive styling, and calls `onOpenCreateModal` |
| **TC-HDR-005** | `TodoHeader` Elevation & Layout | Renders `rounded-2xl`, responsive `flex-col md:flex-row`, and Figma shadow tokens |

### 5.3 Filters Suite Additions (`client/src/__tests__/TodoFilters.test.tsx`)
| Test ID | Component / Scenario | Verification Criteria |
| :--- | :--- | :--- |
| **TC-FLT-001** | `TodoFilters` Status Pills | Active pill applies olive style (`bg-[#6B7A40]`) and darker count badge (`bg-[#556233]`); inactive is transparent |
| **TC-FLT-002** | `TodoFilters` Search Bar | Renders Search icon, conditional Clear (X) button, and clicking X clears query |
| **TC-FLT-003** | `TodoFilters` Sort Menu | Renders 7 sort options and fires `onSortChange(by, order)` |
| **TC-FLT-004** | `TodoFilters` Priority Menu | Renders priority options and selecting "All Priorities" passes `undefined` |
| **TC-FLT-005** | `TodoFilters` Toolbar Layout | Validates `aria-label`, `rounded-2xl`, and uniform 40px (`h-10`) height across controls |
| **TC-FLT-006** | `TodoFilters` Clear Filters Action | Hidden by default; appears with RotateCcw icon when filters active |

### 5.4 Item Suite Additions (`client/src/__tests__/TodoItem.test.tsx`)
| Test ID | Component / Scenario | Verification Criteria |
| :--- | :--- | :--- |
| **TC-ITM-001** | `TodoItem` Completed State | Renders green-tinted border `border-[#DDE6D3]`, filled olive checkbox, strikethrough, and `aria-label="Mark as incomplete"` |
| **TC-ITM-002** | `TodoItem` Incomplete State | Renders neutral border `border-[#E2E4DC]`, unfilled checkbox, and `aria-label="Mark as complete"` |
| **TC-ITM-003** | `TodoItem` Overdue Highlighting | Renders rose alert border, tinted bg, pulsing `OVERDUE` badge, and rose due date metadata |
| **TC-ITM-004** | `TodoItem` Due Today Indicator | Renders amber badge `bg-amber-100 text-amber-800` and omits OVERDUE badge |
| **TC-ITM-005** | `TodoItem` Actions Hover & A11y | Edit and delete buttons have aria-labels, icons, and transition opacity classes |
| **TC-ITM-006** | `TodoItem` Metadata Footer | Displays Calendar, Clock, and CheckCircle2 icons and gracefully omits missing fields |

### 5.5 List Suite Additions (`client/src/__tests__/TodoList.test.tsx`)
| Test ID | Component / Scenario | Verification Criteria |
| :--- | :--- | :--- |
| **TC-LST-001** | `TodoList` Grid Layout | Renders items in Figma 2-column responsive grid container `grid grid-cols-1 md:grid-cols-2 gap-4` |
| **TC-LST-002** | `TodoList` Loading Typography | Centered layout with large spinner (`size="lg"`) and `text-sm font-medium text-[#656C5B]` |
| **TC-LST-003** | `TodoList` Error Banner | Rose alert card with AlertCircle icon, title "Unable to Load Tasks", and RefreshCw retry button |
| **TC-LST-004** | `TodoList` Empty Card Layout | CheckSquare illustration in olive square, title "All clear! No tasks yet", and "Add New Task" button |
| **TC-LST-005** | `TodoList` Filtered Empty Text | Displays "No matching tasks" and guidance subtext |

