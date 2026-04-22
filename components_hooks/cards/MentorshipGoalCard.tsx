"use client";
import React from 'react';

interface GoalMetric {
  label: string;
  currentValue: string | number;
  targetValue?: string | number; // Optional, for cases like 12/15
}

interface MentorshipGoalsCardProps {
  title?: string;
  metrics: GoalMetric[];
}

export function MentorshipGoalsCard({
  title = "Mentorship Goals",
  metrics,
}: MentorshipGoalsCardProps) {
  return (
    <div className={`w-full max-w-[500px] bg-[#6C1221] rounded-[40px] p-10 flex flex-col gap-8 shadow-md`}>
      {/* Card Title */}
      <h2 className="text-3xl font-bold text-white tracking-tight">
        {title}
      </h2>

      {/* Metrics Row */}
      <div className="flex flex-row gap-4">
        {metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="flex-1 bg-white/10 backdrop-blur-sm rounded-[30px] p-6 flex flex-col gap-2"
          >
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] leading-tight">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-4xl font-light">
                {metric.currentValue}
              </span>
              {metric.targetValue && (
                <span className="text-lg text-white/40 font-light">
                  /{metric.targetValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}