'use client';

import React from 'react';

interface MetricItem {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface ImpactMetricsProps {
  metrics: MetricItem[];
}

export default function ImpactMetrics({ metrics }: ImpactMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm lg:p-6"
        >
          {metric.icon && <div className="mb-2 flex justify-center text-primary">{metric.icon}</div>}
          <div className="font-bold text-primary text-2xl lg:text-3xl">{metric.value}</div>
          <p className="mt-1 text-gray-600 text-xs lg:text-sm">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
