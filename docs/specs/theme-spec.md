# Feature Spec: Light/Dark Theme Toggle

**Objective:** Allow users to switch between Light and Dark modes in the Todo app.

## Requirements
- Add a theme toggle button in the header.
- Switch themes instantly across all components.
- Save selected theme in `localStorage`.
- Restore theme after page refresh.
- Default to Light Mode.

## Acceptance Criteria
- Toggle works correctly.
- Text, backgrounds, buttons, and cards update.
- Selected theme persists after refresh.
- Existing functionality remains unaffected.

## Edge Cases
- Invalid or missing saved theme → Light Mode.
- `localStorage` unavailable → Toggle still works.

**Tech Stack:** React, CSS variables. No backend changes.