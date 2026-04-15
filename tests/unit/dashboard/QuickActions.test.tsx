import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickActions from '@/app/_components/dashboard/QuickActions';

describe('QuickActions', () => {
  it('renders all action buttons', () => {
    const actions = [
      { id: '1', label: 'Edit', variant: 'primary' as const, onClick: vi.fn() },
      { id: '2', label: 'Delete', variant: 'secondary' as const, onClick: vi.fn() },
    ];

    render(<QuickActions actions={actions} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onClick handler when button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions = [{ id: '1', label: 'Test', onClick }];

    render(<QuickActions actions={actions} />);

    await user.click(screen.getByText('Test'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies primary styling to primary variant buttons', () => {
    const actions = [
      { id: '1', label: 'Primary', variant: 'primary' as const, onClick: vi.fn() },
    ];

    const { container } = render(<QuickActions actions={actions} />);
    const button = screen.getByText('Primary').closest('button');

    expect(button).toHaveClass('bg-primary');
  });

  it('applies secondary styling to secondary variant buttons', () => {
    const actions = [
      { id: '1', label: 'Secondary', variant: 'secondary' as const, onClick: vi.fn() },
    ];

    const { container } = render(<QuickActions actions={actions} />);
    const button = screen.getByText('Secondary').closest('button');

    expect(button).toHaveClass('border-primary', 'bg-white');
  });

  it('renders icons when provided', () => {
    const actions = [
      {
        id: '1',
        label: 'With Icon',
        icon: <span data-testid="test-icon">📝</span>,
        onClick: vi.fn(),
      },
    ];

    render(<QuickActions actions={actions} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
