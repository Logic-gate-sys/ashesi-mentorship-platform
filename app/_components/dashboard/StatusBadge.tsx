import React from 'react';

export type StatusType = 'active' | 'pending' | 'matched' | 'completed' | 'paused';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-primary/10', text: 'text-primary', label: 'Active' },
  pending: { bg: 'bg-accent/20', text: 'text-accent-dark', label: 'Pending' },
  matched: { bg: 'bg-primary', text: 'text-white', label: 'Matched' },
  completed: { bg: 'bg-page', text: 'text-text-secondary', label: 'Completed' },
  paused: { bg: 'bg-border', text: 'text-text-secondary', label: 'Paused' },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      {config.label}
    </span>
  );
}
