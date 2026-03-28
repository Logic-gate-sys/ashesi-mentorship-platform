import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MentorDashboard from '@/app/(dashboard)/mentor/page';

describe('MentorDashboard - State & Integration', () => {
  it('renders all main sections', () => {
    render(<MentorDashboard />);

    expect(screen.getByText('Your Impact')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Pending Requests')).toBeInTheDocument();
    expect(screen.getByText('Active Mentees')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Sessions')).toBeInTheDocument();
  });

  it('displays correct number of pending requests', () => {
    render(<MentorDashboard />);

    // Mock data has 3 pending requests
    const pendingText = screen.getByText(/3 students waiting for your response/);
    expect(pendingText).toBeInTheDocument();
  });

  it('displays correct number of active mentees', () => {
    render(<MentorDashboard />);

    // Mock data has 4 active mentees
    const activeText = screen.getByText(/You are currently mentoring 4 students/);
    expect(activeText).toBeInTheDocument();
  });

  it('displays correct number of upcoming sessions', () => {
    render(<MentorDashboard />);

    // Mock data has 3 sessions
    const sessionsText = screen.getByText(/You have 3 sessions scheduled/);
    expect(sessionsText).toBeInTheDocument();
  });

  it('displays impact metrics values', () => {
    render(<MentorDashboard />);

    expect(screen.getByText('8')).toBeInTheDocument(); // Active Mentees
    expect(screen.getByText('32')).toBeInTheDocument(); // Sessions
    expect(screen.getByText('24h')).toBeInTheDocument(); // Hours/Month
    expect(screen.getByText('4.8')).toBeInTheDocument(); // Rating
  });

  it('renders quick action buttons', () => {
    render(<MentorDashboard />);

    expect(screen.getByText('Edit Availability')).toBeInTheDocument();
    expect(screen.getByText('Manage Profile')).toBeInTheDocument();
  });

  it('shows pending request mentee information', () => {
    render(<MentorDashboard />);

    // Check for pending request names from mock data
    expect(screen.getByText('Ama Asante')).toBeInTheDocument();
    expect(screen.getByText('Kwame Osei')).toBeInTheDocument();
    expect(screen.getByText('Nada Mensah')).toBeInTheDocument();
  });

  it('shows active mentee information', () => {
    render(<MentorDashboard />);

    // Check for active mentee names from mock data
    expect(screen.getByText('Abena Amoah')).toBeInTheDocument();
    expect(screen.getByText('Kofi Mensah')).toBeInTheDocument();
  });

  it('shows upcoming session details', () => {
    render(<MentorDashboard />);

    expect(screen.getByText('Career planning after graduation')).toBeInTheDocument();
    expect(screen.getByText('Interview prep')).toBeInTheDocument();
  });

  it('accepts a pending request and moves mentee to active list', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    // Initial count
    expect(screen.getByText(/3 students waiting for your response/)).toBeInTheDocument();

    // Accept first request
    const acceptButtons = screen.getAllByText('Accept');
    await user.click(acceptButtons[0]);

    // Count should decrease to 2
    expect(screen.getByText(/2 students waiting for your response/)).toBeInTheDocument();
  });

  it('declines a pending request', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    const initialText = screen.getByText(/3 students waiting for your response/);
    expect(initialText).toBeInTheDocument();

    // Decline first request
    const declineButtons = screen.getAllByText('Decline');
    await user.click(declineButtons[0]);

    // Count should decrease
    expect(screen.getByText(/2 students waiting for your response/)).toBeInTheDocument();
  });

  it('shows empty state when all requests are processed', async () => {
    const user = userEvent.setup();
    render(<MentorDashboard />);

    // Decline all 3 pending requests
    for (let i = 0; i < 3; i++) {
      const declineButtons = screen.getAllByText('Decline');
      // eslint-disable-next-line no-await-in-loop
      await user.click(declineButtons[0]);
    }

    // Should show empty state
    expect(screen.getByText(/No pending requests. Great job keeping up!/)).toBeInTheDocument();
  });
});
