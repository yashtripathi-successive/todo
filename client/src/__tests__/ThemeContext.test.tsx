import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ThemeProvider,
  useTheme,
  getStoredTheme,
  setStoredTheme,
  Theme,
} from '../context/ThemeContext';

// Helper component for consuming and interacting with ThemeContext in RTL tests
const ThemeTestConsumer: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-btn">
        Toggle Theme
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark-btn">
        Set Dark
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light-btn">
        Set Light
      </button>
      <button
        onClick={() => setTheme('invalid-theme' as Theme)}
        data-testid="set-invalid-btn"
      >
        Set Invalid
      </button>
    </div>
  );
};

describe('ThemeContext & ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
    vi.restoreAllMocks();
  });

  // TC-THM-001: Default to Light Mode when no saved theme in localStorage
  it('TC-THM-001: should default to Light Mode when no saved theme in localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  // TC-THM-002: Toggling theme switches from 'light' to 'dark' and back to 'light'
  it('TC-THM-002: should switch from light to dark and back to light when toggling theme', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    // First toggle: light -> dark
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    // Second toggle: dark -> light
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  // TC-THM-003: Applies and removes 'dark' class and data-theme attribute on document.documentElement
  it('TC-THM-003: should apply and remove dark class and data-theme attribute on document.documentElement', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    const root = document.documentElement;
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.getAttribute('data-theme')).toBe('light');

    // Switch to dark mode
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.getAttribute('data-theme')).toBe('dark');

    // Switch back to light mode
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.getAttribute('data-theme')).toBe('light');
  });

  // TC-THM-004: Saves theme to localStorage on change
  it('TC-THM-004: should save theme to localStorage when changed', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    // Initial mount syncs default theme to localStorage
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');

    // Toggle to dark mode
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    // Toggle back to light mode
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  // TC-THM-005: Restores saved dark theme from localStorage on initial mount
  it('TC-THM-005: should restore saved dark theme from localStorage on initial mount', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  // TC-THM-006: Restores saved light theme from localStorage on initial mount
  it('TC-THM-006: should restore saved light theme from localStorage on initial mount', () => {
    localStorage.setItem('theme', 'light');

    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  // TC-THM-007: Edge case - Invalid or unknown theme in localStorage defaults to 'light'
  it('TC-THM-007: should default to light mode when localStorage contains invalid or unknown theme', () => {
    const invalidThemes = ['neon', 'system', 'DARK', 'LIGHT', 'custom', '', '123'];

    invalidThemes.forEach((invalidValue) => {
      localStorage.setItem('theme', invalidValue);

      const { unmount } = render(
        <ThemeProvider>
          <ThemeTestConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      unmount();
      document.documentElement.className = '';
      document.documentElement.removeAttribute('data-theme');
    });
  });

  // TC-THM-008: Edge case - When localStorage is unavailable or throws errors on read (e.g., SecurityError in private browsing)
  it('TC-THM-008: should handle localStorage getItem errors gracefully and default to light mode', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException(
        'SecurityError: The operation is insecure or localStorage is disabled.',
        'SecurityError'
      );
    });

    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(warnSpy).toHaveBeenCalledWith(
      'Unable to read theme from localStorage:',
      expect.anything()
    );
  });

  // TC-THM-009: Edge case - When localStorage is unavailable or throws errors on write, toggle still works in-memory without crashing
  it('TC-THM-009: should continue working in-memory without crashing when localStorage setItem throws', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException(
        'QuotaExceededError: The quota has been exceeded.',
        'QuotaExceededError'
      );
    });

    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    // Toggle should still switch theme in-memory
    expect(() => fireEvent.click(toggleBtn)).not.toThrow();
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Toggle back to light in-memory
    expect(() => fireEvent.click(toggleBtn)).not.toThrow();
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    expect(warnSpy).toHaveBeenCalledWith(
      'Unable to persist theme to localStorage:',
      expect.anything()
    );
  });

  // TC-THM-010: setTheme function updates theme and ignores invalid values
  it('TC-THM-010: should allow setting theme directly via setTheme and ignore invalid inputs', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    // Explicitly set dark
    fireEvent.click(screen.getByTestId('set-dark-btn'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Setting invalid theme should be ignored
    fireEvent.click(screen.getByTestId('set-invalid-btn'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Explicitly set light
    fireEvent.click(screen.getByTestId('set-light-btn'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  // TC-THM-011: initialTheme prop override
  it('TC-THM-011: should initialize with initialTheme prop overriding localStorage', () => {
    localStorage.setItem('theme', 'light');

    render(
      <ThemeProvider initialTheme="dark">
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  // TC-THM-012: useTheme hook throws error when used outside of ThemeProvider
  it('TC-THM-012: should throw an error when useTheme is called outside of ThemeProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeTestConsumer />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleErrorSpy.mockRestore();
  });

  // Helper functions unit tests
  describe('Helper Functions (getStoredTheme & setStoredTheme)', () => {
    it('TC-THM-013: getStoredTheme should return light when nothing is stored', () => {
      expect(getStoredTheme()).toBe('light');
    });

    it('TC-THM-014: getStoredTheme should return dark when dark is stored', () => {
      localStorage.setItem('theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('TC-THM-015: getStoredTheme should return light when invalid value is stored', () => {
      localStorage.setItem('theme', 'high-contrast');
      expect(getStoredTheme()).toBe('light');
    });

    it('TC-THM-016: getStoredTheme should catch exceptions and return light', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      expect(getStoredTheme()).toBe('light');
    });

    it('TC-THM-017: setStoredTheme should catch exceptions without crashing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Write failed');
      });

      expect(() => setStoredTheme('dark')).not.toThrow();
      expect(warnSpy).toHaveBeenCalledWith(
        'Unable to persist theme to localStorage:',
        expect.any(Error)
      );
    });
  });
});
