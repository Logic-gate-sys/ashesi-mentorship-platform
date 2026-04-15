'use client';

import React from 'react';

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

interface QuickActionsProps {
  actions: ActionItem[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`flex flex-1 items-center justify-center gap-2 rounded px-4 py-3 font-medium transition-colors lg:px-6 ${
            action.variant === 'secondary'
              ? 'border border-primary bg-white text-primary hover:bg-gray-50'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {action.icon && <span className="flex h-5 w-5 items-center justify-center">{action.icon}</span>}
          <span className="text-sm lg:text-base">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
