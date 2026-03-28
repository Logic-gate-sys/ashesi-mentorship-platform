import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '@/app/_components/dashboard/StatusBadge';

describe('StatusBadge', () => {
  it('renders the correct status label', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies correct styling for active status', () => {
    const { container } = render(<StatusBadge status="active" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-primary-light', 'text-white');
  });

  it('applies correct styling for pending status', () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-purple', 'text-white');
  });

  it('supports different sizes', () => {
    const { container } = render(<StatusBadge status="active" size="lg" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('renders all status types correctly', () => {
    const statuses = ['active', 'pending', 'matched', 'completed', 'paused'] as const;
    statuses.forEach((status) => {
      const { unmount } = render(<StatusBadge status={status} />);
      const label = (status.charAt(0).toUpperCase() + status.slice(1)) as string;
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });
});
