import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Priority, TodoStatus } from '../types/todo';

describe('Badges Component Suite (Figma Design Styles & Theming)', () => {
  describe('PriorityBadge', () => {
    // TC-BDG-001: Low Priority Badge
    it('TC-BDG-001: should render Low priority with olive design styles and accessible role', () => {
      render(<PriorityBadge priority="Low" />);

      const badge = screen.getByRole('status', { name: 'Priority Low' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Low');

      // Verify Olive light theme classes
      expect(badge).toHaveClass('bg-[#EDF1E6]', 'text-[#4E5B2E]', 'border-[#DCE2D1]');

      // Verify indicator dot styling
      const dot = badge.querySelector('span');
      expect(dot).toHaveClass('bg-[#6B7A40]');
    });

    // TC-BDG-002: Medium Priority Badge
    it('TC-BDG-002: should render Medium priority with amber styles and accessible role', () => {
      render(<PriorityBadge priority="Medium" />);

      const badge = screen.getByRole('status', { name: 'Priority Medium' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Medium');

      // Verify Amber warning classes
      expect(badge).toHaveClass('bg-amber-50', 'text-amber-700', 'border-amber-200');

      const dot = badge.querySelector('span');
      expect(dot).toHaveClass('bg-amber-500');
    });

    // TC-BDG-003: High Priority Badge
    it('TC-BDG-003: should render High priority with rose alert styles and accessible role', () => {
      render(<PriorityBadge priority="High" />);

      const badge = screen.getByRole('status', { name: 'Priority High' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('High');

      // Verify Rose alert classes
      expect(badge).toHaveClass('bg-rose-50', 'text-rose-700', 'border-rose-200');

      const dot = badge.querySelector('span');
      expect(dot).toHaveClass('bg-rose-500');
    });

    // TC-BDG-004: Fallback for Unknown Priority
    it('TC-BDG-004: should fallback gracefully to slate styles when given an unknown priority', () => {
      render(<PriorityBadge priority={'Urgent' as unknown as Priority} />);

      const badge = screen.getByRole('status', { name: 'Priority Urgent' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-slate-50', 'text-slate-700');
    });
  });

  describe('StatusBadge', () => {
    // TC-BDG-005: Pending Status Badge
    it('TC-BDG-005: should render Pending status with Clock icon and warm amber palette', () => {
      render(<StatusBadge status="Pending" />);

      const badge = screen.getByRole('status', { name: 'Status Pending' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Pending');

      // Verify warm amber styling
      expect(badge).toHaveClass('bg-[#FFFBEB]', 'text-[#92400E]', 'border-[#FDE68A]');

      // Verify Clock icon rendered
      const icon = badge.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('lucide-clock');
    });

    // TC-BDG-006: In Progress Status Badge
    it('TC-BDG-006: should render In Progress status with PlayCircle icon and olive-sage palette', () => {
      render(<StatusBadge status="In Progress" />);

      const badge = screen.getByRole('status', { name: 'Status In Progress' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('In Progress');

      // Verify soft olive-sage styling
      expect(badge).toHaveClass('bg-[#F0F5ED]', 'text-[#4F622C]', 'border-[#D4DEC5]');

      // Verify PlayCircle icon rendered
      const icon = badge.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('lucide-circle-play');
    });

    // TC-BDG-007: Completed Status Badge
    it('TC-BDG-007: should render Completed status with CheckCircle2 icon and emerald palette', () => {
      render(<StatusBadge status="Completed" />);

      const badge = screen.getByRole('status', { name: 'Status Completed' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Completed');

      // Verify emerald green styling
      expect(badge).toHaveClass('bg-[#ECF5EE]', 'text-[#166534]', 'border-[#BBF7D0]');

      // Verify CheckCircle2 icon rendered
      const icon = badge.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('lucide-circle-check');
    });

    // TC-BDG-008: Fallback for Unknown Status
    it('TC-BDG-008: should fallback gracefully to slate styles and omit icon for unknown status', () => {
      render(<StatusBadge status={'Archived' as unknown as TodoStatus} />);

      const badge = screen.getByRole('status', { name: 'Status Archived' });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-slate-50', 'text-slate-700');
      expect(badge.querySelector('svg')).toBeNull();
    });
  });
});
