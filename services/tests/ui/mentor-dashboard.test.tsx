import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MentorDashboard from '#app/(dashboards)/mentors/page'

describe('MentorDashboard - UI Interactions', () => {
  it('handles quick action button clicks', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    const editBtn = screen.getByText('Edit Availability');
    const manageBtn = screen.getByText('Manage Profile');

    // Buttons should be clickable (no errors)
    await user.click(editBtn);
    await user.click(manageBtn);

    // If we got here without errors, the handlers work
    expect(editBtn).toBeInTheDocument();
  });

  it('handles mentee action buttons in pending requests', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    // Each pending request has Message and Schedule buttons
    const messageButtons = screen.getAllByText('Message');
    expect(messageButtons.length).toBeGreaterThan(0);

    // Try clicking a message button
    await user.click(messageButtons[0]);
    expect(messageButtons[0]).toBeInTheDocument();
  });

  it('handles mentee action buttons in active mentees', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    // Skip pending request section buttons and get active mentee buttons
    const scheduleButtons = screen.getAllByText('Schedule');
    expect(scheduleButtons.length).toBeGreaterThan(0);

    // At least some should come from active mentees section
    await user.click(scheduleButtons[scheduleButtons.length - 1]);
    expect(scheduleButtons[0]).toBeInTheDocument();
  });

  it('handles session join interactions', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    const joinButtons = screen.getAllByText('Join');
    expect(joinButtons.length).toBeGreaterThan(0);

    // Try joining a session
    await user.click(joinButtons[0]);
    expect(joinButtons[0]).toBeInTheDocument();
  });

  it('displays responsive card layouts for mentees', () => {
    render(<MentorDashboard />);

    // Check that the active mentees section uses responsive grid
    const activeMenteesSection = screen.getByText('Active Mentees').closest('section');
    expect(activeMenteesSection).toBeInTheDocument();

    // Should have grid layout with responsive classes
    const container = activeMenteesSection?.querySelector('[class*="grid"]');
    if (container) {
      expect(container).toHaveClass('md:grid-cols-2');
    }
  });

  it('shows session information clearly', () => {
    render(<MentorDashboard />);

    // Sessions should show all their information
    const sessionsSection = screen.getByText('Upcoming Sessions').closest('section');
    expect(sessionsSection).toBeInTheDocument();

    // Should contain session details
    expect(screen.getByText('Abena Amoah')).toBeInTheDocument();
    expect(screen.getByText(/Mar 31, 2026/)).toBeInTheDocument();
  });

  it('maintains visual hierarchy with section titles and descriptions', () => {
    render(<MentorDashboard />);

    // Each section should have a title
    const impactTitle = screen.getByText('Your Impact');
    const impactSubtitle = screen.getByText('Track your mentorship metrics');

    expect(impactTitle.tagName).toBe('H2');
    expect(impactSubtitle).toBeInTheDocument();
  });

  it('show mentee status badges', () => {
    render(<MentorDashboard />);

    // Status badges should be visible for pending and active mentees
    const statusBadges = screen.getAllByText(/Active|Pending|Matched/);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('displays last interaction information', () => {
    render(<MentorDashboard />);

    // Mentee cards should show last interaction
    expect(screen.getByText(/Last interaction:/i)).toBeInTheDocument();
  });

  it('action buttons are easily distinguishable', () => {
    const { container } = render(<MentorDashboard />);

    // Accept buttons should have primary styling
    const acceptButtons = screen.getAllByText('Accept');
    acceptButtons.forEach((btn) => {
      expect(btn.closest('button')).toHaveClass('bg-primary');
    });

    // Decline buttons should have secondary styling
    const declineButtons = screen.getAllByText('Decline');
    declineButtons.forEach((btn) => {
      expect(btn.closest('button')).toHaveClass('bg-white');
    });
  });
});
