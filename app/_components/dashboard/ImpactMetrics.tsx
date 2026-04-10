'use client';

import React from 'react';

interface MetricItem {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
}

interface ImpactMetricsProps {
  metrics?: MetricItem[];
  showHeaderSection?: boolean;
}

export default function ImpactMetrics({ 
  metrics = [
    { value: 12, label: 'Sessions Completed', trend: '+2 this month' },
    { value: '4.8/5', label: 'Average Rating', trend: '+0.1 this month' },
    { value: 8, label: 'Mentees Helped', trend: '+1 new this month' },
  ],
  showHeaderSection = true 
}: ImpactMetricsProps) {
  return (
    <div className="space-y-6">
      {showHeaderSection && (
        <div className="bg-impact-bg rounded-lg p-6 border border-border">
          <h3 className="text-xl font-semibold text-text mb-6">Your Impact Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white bg-opacity-60 p-4 text-center shadow-sm hover:shadow-primary transition-shadow"
              >
                {metric.icon && <div className="mb-2 flex justify-center text-primary">{metric.icon}</div>}
                <div className="font-bold text-primary text-3xl">{metric.value}</div>
                <p className="mt-2 text-text-secondary text-sm font-medium">{metric.label}</p>
                {metric.trend && <p className="mt-1 text-accent text-xs">{metric.trend}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white shadow-primary">
        <p className="text-lg italic">
          "The best way to predict the future is to invent it."
        </p>
        <p className="text-sm mt-2 opacity-80">— Alan Kay</p>
      </div>
    </div>
  );
}
