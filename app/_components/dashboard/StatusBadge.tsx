import React from 'react';

export type StatusType = 'active' | 'pending' | 'matched' | 'completed' | 'paused';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-primary-light', text: 'text-white', label: 'Active' },
  pending: { bg: 'bg-purple', text: 'text-white', label: 'Pending' },
  matched: { bg: 'bg-primary', text: 'text-white', label: 'Matched' },
  completed: { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Completed' },
  paused: { bg: 'bg-gray-300', text: 'text-gray-600', label: 'Paused' },
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
