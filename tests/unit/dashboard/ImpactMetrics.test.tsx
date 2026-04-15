import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImpactMetrics from '@/app/_components/dashboard/ImpactMetrics';

describe('ImpactMetrics', () => {
  it('renders all metrics', () => {
    const metrics = [
      { value: '10', label: 'Mentees' },
      { value: '50', label: 'Sessions' },
      { value: '20h', label: 'Hours' },
    ];

    render(<ImpactMetrics metrics={metrics} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Mentees')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('20h')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
  });

  it('renders metric icons when provided', () => {
    const metrics = [
      {
        value: '5',
        label: 'Active',
        icon: <span data-testid="metric-icon">🎯</span>,
      },
    ];

    render(<ImpactMetrics metrics={metrics} />);

    expect(screen.getByTestId('metric-icon')).toBeInTheDocument();
  });

  it('handles numeric values', () => {
    const metrics = [{ value: 42, label: 'Count' }];

    render(<ImpactMetrics metrics={metrics} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const metrics = [
      { value: '1', label: 'A' },
      { value: '2', label: 'B' },
      { value: '3', label: 'C' },
      { value: '4', label: 'D' },
    ];

    const { container } = render(<ImpactMetrics metrics={metrics} />);
    const grid = container.querySelector('[class*="grid"]');

    expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
  });
});
