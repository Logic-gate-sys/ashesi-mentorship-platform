'use client';

import React from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  compact?: boolean;
}

export function DashboardSection({ title, subtitle, children, compact = false }: SectionProps) {
  return (
    <section className={compact ? '' : 'space-y-4 lg:space-y-6'}>
      <div>
        <h2 className="font-bold text-lg text-text lg:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-text-secondary text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
}

export default function DashboardContainer({ children }: ContainerProps) {
  return (
    <main className="space-y-8 px-4 py-6 lg:space-y-10 lg:px-8 lg:py-8">
      {children}
    </main>
  );
}
