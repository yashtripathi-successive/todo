import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TodoHeader } from '../components/TodoHeader';
import { ThemeProvider } from '../context/ThemeContext';
import * as themeHook from '../hooks/useTheme';
import { StatusCounts } from '../types/todo';

const mockCounts: StatusCounts = {
  all: 5,
  pending: 3,
  inProgress: 1,
  completed: 1,
};

describe('TodoHeader Component - Theme Toggle & Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  // TC-THM-018: Renders theme toggle button in header
  it('TC-THM-018: should render theme toggle button in the header', () => {
    render(
      <ThemeProvider>
        <TodoHeader counts={mockCounts} onOpenCreateModal={vi.fn()} />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('type', 'button');
  });

  // TC-THM-019: In Light Mode, renders Moon icon with accessible attributes
  it('TC-THM-019: should render Moon icon and "Switch to dark mode" label when in light mode', () => {
    render(
      <ThemeProvider initialTheme="light">
        <TodoHeader counts={mockCounts} onOpenCreateModal={vi.fn()} />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggleBtn).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(toggleBtn).toHaveAttribute('title', 'Switch to dark mode');

    // Verify Moon icon rendered and Sun icon is absent
    const icon = toggleBtn.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('lucide-moon');
    expect(toggleBtn.querySelector('.lucide-sun')).toBeNull();
  });

  // TC-THM-020: In Dark Mode, renders Sun icon with accessible attributes
  it('TC-THM-020: should render Sun icon and "Switch to light mode" label when in dark mode', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <TodoHeader counts={mockCounts} onOpenCreateModal={vi.fn()} />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /switch to light mode/i });
    expect(toggleBtn).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(toggleBtn).toHaveAttribute('title', 'Switch to light mode');

    // Verify Sun icon rendered and Moon icon is absent
    const icon = toggleBtn.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('lucide-sun');
    expect(toggleBtn.querySelector('.lucide-moon')).toBeNull();
  });

  // TC-THM-021: Clicking the theme toggle button calls toggleTheme
  it('TC-THM-021: should call toggleTheme when theme toggle button is clicked', () => {
    const mockToggleTheme = vi.fn();
    vi.spyOn(themeHook, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    });

    render(
      <TodoHeader counts={mockCounts} onOpenCreateModal={vi.fn()} />
    );

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(toggleBtn);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  // TC-THM-022: Integration test - Clicking toggle dynamically flips icon, label, and document root class
  it('TC-THM-022: should interactively switch from Moon to Sun icon and toggle dark class on document root', () => {
    render(
      <ThemeProvider initialTheme="light">
        <TodoHeader counts={mockCounts} onOpenCreateModal={vi.fn()} />
      </ThemeProvider>
    );

    // Initial state: Light mode
    const lightBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(lightBtn.querySelector('svg')).toHaveClass('lucide-moon');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click toggle: Switch to Dark mode
    fireEvent.click(lightBtn);

    const darkBtn = screen.getByRole('button', { name: /switch to light mode/i });
    expect(darkBtn.querySelector('svg')).toHaveClass('lucide-sun');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Click toggle again: Switch back to Light mode
    fireEvent.click(darkBtn);

    const revertedBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(revertedBtn.querySelector('svg')).toHaveClass('lucide-moon');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  // TC-THM-023: Preserves existing header controls and metrics
  it('TC-THM-023: should render branding, completion rate, and trigger create modal without regression', () => {
    const handleOpenCreateModal = vi.fn();

    render(
      <ThemeProvider>
        <TodoHeader counts={mockCounts} onOpenCreateModal={handleOpenCreateModal} />
      </ThemeProvider>
    );

    // TaskMaster title and subtitle
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByText(/Organize, track, and complete your tasks seamlessly/i)).toBeInTheDocument();

    // Completion percentage: 1 completed out of 5 = 20%
    expect(screen.getByText('Progress: 20%')).toBeInTheDocument();

    // New task button interaction
    const newTaskBtn = screen.getByRole('button', { name: /New Task/i });
    fireEvent.click(newTaskBtn);
    expect(handleOpenCreateModal).toHaveBeenCalledTimes(1);
  });
});
