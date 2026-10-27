# Theme Switcher (Light / Dark Mode) - Implementation Plan

**Spec Reference:** [`docs/specs/theme-spec.md`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/docs/specs/theme-spec.md)  
**Target:** Client application (`todo-app/client`)  
**Scope:** Frontend only (React 18+, CSS Variables, Tailwind CSS). No backend changes.

---

## 1. Executive Summary & Objective

The objective is to implement a robust, accessible, and persistent Light/Dark theme toggle for the TaskMaster Todo application according to the specifications in [`theme-spec.md`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/docs/specs/theme-spec.md).

### Core Goals:
1. **Header Toggle Button:** Provide an intuitive toggle control with Sun/Moon icon states in [`TodoHeader.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoHeader.tsx).
2. **Instant System-wide Switching:** Seamlessly update backgrounds, cards, typography, inputs, badges, and modals across all components without page reload.
3. **Persistence:** Store selected theme in `localStorage` under key `'theme'`.
4. **Reliable Defaults:** Always default to Light Mode when no saved preference exists.
5. **Fault Tolerant / Edge-Case Resilient:** Gracefully handle corrupted/invalid `localStorage` values and environments where `localStorage` is disabled or throws (e.g. strict privacy modes).
6. **Zero Regression:** Ensure all existing task operations, filtering, sorting, validation, and existing test suites continue to pass without disruption.

---

## 2. Architecture & Design Specification

### 2.1 Technical Strategy
To meet the spec requirement of **"React, CSS variables"** while leveraging the existing Tailwind CSS setup:
1. **CSS Variables (`index.css`):** Define semantic CSS custom properties on `:root` (light) and `.dark` (dark mode) for core design tokens (app background, surface background, card border, text colors, muted text, form input backgrounds).
2. **Tailwind Dark Mode Configuration (`tailwind.config.js`):** Configure `darkMode: 'class'`. This enables using Tailwind's `dark:` variant utilities in conjunction with CSS variables for responsive, maintainable styles.
3. **DOM Class & Data Attribute Synchronization:** The theme manager toggles the `.dark` class and `data-theme="dark" | "light"` on `document.documentElement` (`<html>`), updating both CSS variables and Tailwind variant selectors simultaneously. Also synchronize `color-scheme` (`light` / `dark`) for native browser widgets (e.g., HTML date picker).

### 2.2 Theme Tokens & CSS Variable Mapping

| Semantic Token | Light Mode Value | Dark Mode Value | Usage Description |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#f8fafc` (`slate-50`) | `#0f172a` (`slate-900`) | Main application page background |
| `--bg-surface` | `#ffffff` (`white`) | `#1e293b` (`slate-800`) | Cards, modals, header cards, inputs |
| `--bg-surface-subtle` | `#f1f5f9` (`slate-100`) | `#334155` (`slate-700`) | Hover backgrounds, modal footers, progress track |
| `--text-primary` | `#0f172a` (`slate-900`) | `#f8fafc` (`slate-50`) | Headings, main task titles, primary text |
| `--text-secondary` | `#475569` (`slate-600`) | `#94a3b8` (`slate-400`) | Task descriptions, subtitle, secondary labels |
| `--text-muted` | `#94a3b8` (`slate-400`) | `#64748b` (`slate-500`) | Timestamps, counters, icons |
| `--border-color` | `#e2e8f0` (`slate-200`) | `#334155` (`slate-700`) | Card borders, dividers, form borders |
| `--border-focus` | `#6366f1` (`indigo-500`) | `#818cf8` (`indigo-400`) | Active input/button focus rings |

---

## 3. Data Flow & State Management

```
┌────────────────────────────────────────────────────────┐
│                      ThemeContext                      │
│                                                        │
│  State: theme ('light' | 'dark')                       │
│  Default: 'light'                                      │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌──────────────┐                       ┌───────────────┐
│ LocalStorage │                       │ DOM Document  │
│              │                       │               │
│ - safeRead   │                       │ - html.dark   │
│ - safeWrite  │                       │ - colorScheme │
└──────────────┘                       └───────┬───────┘
                                               │
                                               ▼
                                  ┌─────────────────────────┐
                                  │   All React Components  │
                                  │                         │
                                  │  - TodoHeader (Toggle)  │
                                  │  - TodoFilters          │
                                  │  - TodoItem & List      │
                                  │  - TodoForm & Modals    │
                                  │  - Badges & EmptyState  │
                                  └─────────────────────────┘
```

### 3.1 LocalStorage Safety Layer (`safeThemeStorage`)
To satisfy the edge cases from [`theme-spec.md`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/docs/specs/theme-spec.md):
```typescript
const THEME_STORAGE_KEY = 'theme';
export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (err) {
    // localStorage unavailable / security restriction
    console.warn('LocalStorage not accessible for reading theme:', err);
  }
  return 'light'; // Default to Light Mode for missing or invalid theme
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    // localStorage unavailable / quota exceeded
    console.warn('LocalStorage not accessible for saving theme:', err);
  }
}
```

---

## 4. Step-by-Step Implementation Plan

### Step 1: Tailwind & CSS Infrastructure
- **File:** [`client/tailwind.config.js`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/tailwind.config.js)
  - Add `darkMode: 'class'`.
- **File:** [`client/src/index.css`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/index.css)
  - Define CSS custom properties under `:root` and `.dark`.
  - Update `body` styling to use CSS variables and dark mode classes (`dark:bg-slate-900 dark:text-slate-100`).

### Step 2: Theme Context & Hook
- **File (New):** `client/src/context/ThemeContext.tsx`
  - Create `ThemeContext` providing `{ theme: Theme, toggleTheme: () => void, setTheme: (t: Theme) => void }`.
  - Initialize state with `getStoredTheme()`.
  - Use `useEffect` to synchronize:
    - `document.documentElement.classList.toggle('dark', theme === 'dark')`
    - `document.documentElement.setAttribute('data-theme', theme)`
    - `document.documentElement.style.colorScheme = theme`
    - `setStoredTheme(theme)`
  - Provide `ThemeProvider` component.
- **File (New):** `client/src/hooks/useTheme.ts`
  - Export custom hook `useTheme()` with helpful error when used outside provider.
- **File:** [`client/src/main.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/main.tsx)
  - Wrap `<App />` inside `<ThemeProvider>`.

### Step 3: Theme Toggle Button in Header
- **File:** [`client/src/components/TodoHeader.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoHeader.tsx)
  - Import `useTheme` and icons `Sun`, `Moon` from `lucide-react`.
  - Insert toggle button into the header action bar alongside the progress indicator and "New Task" button.
  - Implement accessible markup:
    - `aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}`
    - `title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}`
  - Style button with smooth transition, hover states, and dark mode variants (`dark:bg-slate-800 dark:border-slate-700 dark:text-amber-400 dark:hover:bg-slate-700`).

### Step 4: Component Dark Mode Styling Updates
Update all components with corresponding `dark:` classes and CSS variable awareness:

1. **[`client/src/App.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/App.tsx):**
   - Page container: `bg-slate-50 dark:bg-slate-900 transition-colors duration-200`.
   - Toast notification: Dark mode background and border for error and success toasts.
2. **[`client/src/components/TodoHeader.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoHeader.tsx):**
   - Title: `text-slate-900 dark:text-slate-100`.
   - Subtitle: `text-slate-500 dark:text-slate-400`.
   - Progress card: `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300`.
   - Progress bar track: `bg-slate-100 dark:bg-slate-700`.
3. **[`client/src/components/TodoFilters.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoFilters.tsx):**
   - Filter border: `border-slate-200 dark:border-slate-800`.
   - Unselected status tabs: `bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700`.
   - Tab badge count: `bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`.
   - Search input: `bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500`.
   - Priority and Sort selects: `bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700`.
4. **[`client/src/components/TodoList.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoList.tsx):**
   - Loading label: `text-slate-500 dark:text-slate-400`.
   - Error card: `dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-200`.
5. **[`client/src/components/TodoItem.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoItem.tsx):**
   - Item card: `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`.
   - Completed state: `bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800`.
   - Overdue state: `dark:border-rose-900/60 dark:bg-rose-950/20`.
   - Title: `text-slate-800 dark:text-slate-100` (completed: `line-through text-slate-400 dark:text-slate-500`).
   - Description: `text-slate-600 dark:text-slate-300` (completed: `line-through text-slate-400 dark:text-slate-500`).
   - Checkbox border: `border-slate-300 dark:border-slate-600`.
   - Timestamps & icons: `text-slate-400 dark:text-slate-500`.
   - Action icon buttons: Hover background `dark:hover:bg-slate-700 dark:text-slate-400`.
6. **[`client/src/components/TodoForm.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/TodoForm.tsx):**
   - Modal container: `bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700`.
   - Header & title: `text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-700`.
   - Labels: `text-slate-700 dark:text-slate-300`.
   - Inputs / textareas / selects: `bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100`.
   - Date input: Native dark calendar styling via `color-scheme: dark`.
   - Footer: `bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-700`.
   - Cancel button: `text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800`.
7. **[`client/src/components/DeleteModal.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/DeleteModal.tsx):**
   - Modal background: `bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700`.
   - Title: `text-slate-900 dark:text-slate-100`.
   - Body text: `text-slate-500 dark:text-slate-400`, highlighted title in quotes: `text-slate-700 dark:text-slate-200`.
   - Footer & buttons: `bg-slate-50 dark:bg-slate-900/60`, cancel button `dark:text-slate-300 dark:hover:bg-slate-800`.
8. **[`client/src/components/common/Badge.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/common/Badge.tsx):**
   - Priority badges: Add dark variant styles ensuring WCAG contrast (e.g. `dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900`).
   - Status badges: Add dark variant styles (e.g. `dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900`).
9. **[`client/src/components/common/EmptyState.tsx`](file:///C:/Users/yash.tripathi/project-gemini/todo-app/client/src/components/common/EmptyState.tsx):**
   - Card container: `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`.
   - Text & icon: `text-slate-800 dark:text-slate-100`, description `text-slate-500 dark:text-slate-400`, icon container `dark:bg-indigo-950/50 dark:text-indigo-400`.

### Step 5: Unit & Integration Testing
- **New Test:** `client/src/__tests__/ThemeContext.test.tsx`
  - Validates default theme is `'light'`.
  - Validates toggling switches between `'light'` and `'dark'`.
  - Validates `document.documentElement` class update (`dark`).
  - Validates persistence into `localStorage`.
  - Validates restoring saved theme from `localStorage` on initial mount.
  - Validates fallback to `'light'` mode if `localStorage` value is invalid (`'invalid'`, `'blue'`, `''`).
  - Validates resilience when `localStorage.getItem` or `localStorage.setItem` throws an error.
- **New Test:** `client/src/__tests__/TodoHeader.test.tsx`
  - Verifies theme toggle button renders with proper accessibility attributes (`aria-label`, role).
  - Verifies clicking toggle fires theme switch.
- **Regression Verification:**
  - Run `npm --prefix client test` to confirm all 5 existing test files (28 tests) plus new test suites pass with 100% success.

---

## 5. Acceptance Criteria & Verification Matrix

| Spec Requirement | Acceptance Criteria | Verification Method |
| :--- | :--- | :--- |
| **Theme Toggle Button** | Header contains button displaying Sun icon (when dark) or Moon icon (when light) with accessible label | Automated test in `TodoHeader.test.tsx` + manual visual inspect |
| **Instant Component Updates** | Page background, cards, header, filters, inputs, modals, badges update immediately upon clicking toggle | Verify DOM `.dark` class toggle and inspect UI state transitions |
| **Save in `localStorage`** | Theme preference persisted under `'theme'` key on change | Unit test verifying `localStorage.setItem('theme', ...)` call |
| **Restore after Refresh** | Initial state reads from `localStorage` and applies `.dark` if stored value was `'dark'` | Unit test with mocked `localStorage` pre-populated with `'dark'` |
| **Default to Light Mode** | When `localStorage` is empty or cleared, defaults to Light Mode | Unit test with empty `localStorage` asserting `'light'` |
| **Edge Case: Invalid Theme** | Unknown string in storage (e.g. `'neon'`, `123`) falls back to `'light'` | Unit test asserting fallback to `'light'` |
| **Edge Case: Storage Unavailable**| If `localStorage` throws (private mode/security quota), toggle still switches in-memory | Unit test mocking `localStorage` throwing errors |
| **Zero Regression** | Existing CRUD, filtering, sorting, modals, and tests unaffected | Run existing Vitest test suite (`npm --prefix client test`) |

---

## 6. Execution Milestones & Phased Rollout

| Phase | Description | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Scaffolding & Setup | `tailwind.config.js` (`darkMode: 'class'`), `index.css` CSS variables & base styles |
| **Phase 2** | Theme State & Storage Layer | `ThemeContext.tsx`, `useTheme.ts`, `safeThemeStorage` helpers, `main.tsx` provider |
| **Phase 3** | Header Toggle UI | `TodoHeader.tsx` toggle button with Sun/Moon icons, accessibility attributes |
| **Phase 4** | Component Dark Mode Styling | Updates across `App`, `TodoFilters`, `TodoItem`, `TodoList`, `TodoForm`, `DeleteModal`, `Badge`, `EmptyState` |
| **Phase 5** | Automated Testing | `ThemeContext.test.tsx`, `TodoHeader.test.tsx`, full Vitest test pass |
| **Phase 6** | Verification & Polish | Acceptance check against `theme-spec.md`, smooth CSS transitions check |

---

## 7. Approval & Next Steps
- **Status:** Ready for User Review.
- **Action:** Awaiting user approval to proceed with execution.
