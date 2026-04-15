import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionsList from '@/app/_components/dashboard/SessionsList';

describe('SessionsList', () => {
  it('renders empty state when no sessions', () => {
    render(<SessionsList sessions={[]} />);

    expect(screen.getByText('No upcoming sessions')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<SessionsList sessions={[]} emptyMessage="No sessions scheduled" />);

    expect(screen.getByText('No sessions scheduled')).toBeInTheDocument();
  });

  it('renders all session data', () => {
    const sessions = [
      {
        id: '1',
        mentee: 'John Doe',
        date: '2026-04-01',
        time: '2:00 PM',
        topic: 'Career planning',
      },
    ];

    render(<SessionsList sessions={sessions} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/2026-04-01/)).toBeInTheDocument();
    expect(screen.getByText(/2:00 PM/)).toBeInTheDocument();
    expect(screen.getByText('Career planning')).toBeInTheDocument();
  });

  it('displays optional notes when provided', () => {
    const sessions = [
      {
        id: '1',
        mentee: 'Jane Doe',
        date: '2026-04-01',
        time: '3:00 PM',
        topic: 'Interview prep',
        notes: 'Practice behavioral questions',
      },
    ];

    render(<SessionsList sessions={sessions} />);

    expect(screen.getByText('Practice behavioral questions')).toBeInTheDocument();
  });

  it('calls onJoinSession when join button clicked', async () => {
    const user = userEvent.setup();
    const onJoinSession = vi.fn();
    const sessions = [
      {
        id: '1',
        mentee: 'Test User',
        date: '2026-04-01',
        time: '2:00 PM',
      },
    ];

    render(<SessionsList sessions={sessions} onJoinSession={onJoinSession} />);

    await user.click(screen.getByText('Join'));

    expect(onJoinSession).toHaveBeenCalledWith('1');
  });

  it('renders multiple sessions', () => {
    const sessions = [
      { id: '1', mentee: 'User 1', date: '2026-04-01', time: '2:00 PM' },
      { id: '2', mentee: 'User 2', date: '2026-04-02', time: '3:00 PM' },
      { id: '3', mentee: 'User 3', date: '2026-04-03', time: '4:00 PM' },
    ];

    render(<SessionsList sessions={sessions} />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();
  });
});
