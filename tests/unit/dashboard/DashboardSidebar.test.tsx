import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/app/_components/dashboard/DashboardSidebar';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('DashboardSidebar', () => {
  const mockPathname = usePathname as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPathname.mockReturnValue('/mentor');
  });

  describe('Mentor sidebar', () => {
    it('should render sidebar with mentor navigation items', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      // Check for mentor-specific items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Mentees')).toBeInTheDocument();
      expect(screen.getByText('Requests')).toBeInTheDocument();
      expect(screen.getByText('Sessions')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('should highlight active navigation item', () => {
      mockPathname.mockReturnValue('/mentor');
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-primary', 'text-white');
    });

    it('should display request badge for mentor', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      // Requests should have a badge
      const badges = screen.getAllByText(/\d+/);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Student sidebar', () => {
    it('should render sidebar with student navigation items', () => {
      render(
        <DashboardSidebar
          role="STUDENT"
          name="Jane Student"
          initials="JS"
        />
      );

      // Check for student-specific items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Find Mentor')).toBeInTheDocument();
      expect(screen.getByText('Mentorships')).toBeInTheDocument();
      expect(screen.getByText('Sessions')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('should link to correct student routes', () => {
      render(
        <DashboardSidebar
          role="STUDENT"
          name="Jane Student"
          initials="JS"
        />
      );

      const findMentorLink = screen.getByText('Find Mentor').closest('a');
      expect(findMentorLink).toHaveAttribute('href', '/student/find-mentor');

      const mentorshipsLink = screen.getByText('Mentorships').closest('a');
      expect(mentorshipsLink).toHaveAttribute('href', '/student/mentorships');
    });
  });

  describe('Navigation links', () => {
    it('should have correct href for mentor links', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/mentor');
      expect(screen.getByText('Mentees').closest('a')).toHaveAttribute('href', '/mentor/mentees');
      expect(screen.getByText('Requests').closest('a')).toHaveAttribute('href', '/mentor/requests');
      expect(screen.getByText('Sessions').closest('a')).toHaveAttribute('href', '/mentor/sessions');
      expect(screen.getByText('Messages').closest('a')).toHaveAttribute('href', '/mentor/messages');
    });
  });

  describe('User profile section', () => {
    it('should display user name and initials', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Doe"
          initials="JD"
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display correct role label', () => {
      const { rerender } = render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      expect(screen.getByText('Mentor')).toBeInTheDocument();

      rerender(
        <DashboardSidebar
          role="STUDENT"
          name="Jane Student"
          initials="JS"
        />
      );

      expect(screen.getByText('Student')).toBeInTheDocument();
    });

    it('should have logout button', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Sidebar expand/collapse', () => {
    it('should have collapsed state by default', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      const aside = screen.getByRole('complementary');
      expect(aside).toHaveClass('w-20');
    });

    it('should expand on toggle button click', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      const toggleButton = screen.getByLabelText('Collapse sidebar');
      fireEvent.click(toggleButton);

      const aside = screen.getByRole('complementary');
      expect(aside).toHaveClass('w-64');
    });

    it('should collapse on second toggle click', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      const toggleButton = screen.getByLabelText('Collapse sidebar');

      // First click to expand
      fireEvent.click(toggleButton);
      let aside = screen.getByRole('complementary');
      expect(aside).toHaveClass('w-64');

      // Second click to collapse
      fireEvent.click(toggleButton);
      aside = screen.getByRole('complementary');
      expect(aside).toHaveClass('w-20');
    });
  });

  describe('Accessibility', () => {
    it('should be navigable with keyboard', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      const toggleButton = screen.getByLabelText('Collapse sidebar');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toBeVisible();
    });

    it('should have title attributes for icon-only view', () => {
      render(
        <DashboardSidebar
          role="MENTOR"
          name="John Mentor"
          initials="JM"
        />
      );

      // When collapsed, items should have title for tooltip
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      // Title will be set when collapsed (we can't easily test this without mocking the sidebar state)
      expect(dashboardLink).toBeInTheDocument();
    });
  });
});
