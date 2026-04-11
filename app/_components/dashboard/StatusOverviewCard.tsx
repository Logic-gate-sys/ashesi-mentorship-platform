'use client';

import React from 'react';
import Link from 'next/link';

interface StatusOverviewCardProps {
  title: string;
  subtitle: string;
  mainStat: string | number;
  secondaryStat?: string;
  icon: string;
  actionLabel: string;
  actionHref?: string;
  onActionClick?: () => void;
  variant?: 'requests' | 'mentors' | 'sessions' | 'completed';
  loading?: boolean;
}

export default function StatusOverviewCard({
  title,
  subtitle,
  mainStat,
  secondaryStat,
  icon,
  actionLabel,
  actionHref,
  onActionClick,
  variant = 'requests',
  loading = false,
}: StatusOverviewCardProps) {
  const variantStyles = {
    requests: 'border-accent-50 bg-accent-50',
    mentors: 'border-primary-50 bg-primary-50',
    sessions: 'border-blue-50 bg-blue-50',
    completed: 'border-success-50 bg-success-50',
  };

  const statColors = {
    requests: 'text-accent',
    mentors: 'text-primary',
    sessions: 'text-blue-600',
    completed: 'text-green-600',
  };

  const renderContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-text-secondary text-sm font-semibold tracking-wide">{title}</p>
        <div>
          <p className={`text-3xl font-bold ${statColors[variant]}`}>{mainStat}</p>
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>
        {secondaryStat && <p className="text-text-secondary text-xs md:text-sm">{secondaryStat}</p>}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-2xl">{icon}</span>
        <button
          onClick={onActionClick}
          className="text-primary hover:text-primary-dark text-xs md:text-sm font-semibold transition-colors"
        >
          {actionLabel} →
        </button>
      </div>
    </div>
  );

  const baseClass = `rounded-lg border-2 p-6 transition-all hover:shadow-md ${variantStyles[variant]}`;

  if (actionHref) {
    return (
      <Link href={actionHref}>
        <div className={`${baseClass} cursor-pointer`}>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={baseClass}>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}
