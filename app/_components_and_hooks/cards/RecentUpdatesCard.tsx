"use client";
import React from 'react';
import { type LucideIcon, Megaphone } from 'lucide-react';

interface UpdateItem {
  id: string | number;
  event: string; // Example: Kojo Annan sent a request
  timestamp: string; // Example: 2 hours ago
}

interface UpdatesCardProps {
  updates: UpdateItem[];
  title?: string; // Default: Updates
  Icon?: LucideIcon; // Default: Megaphone
}

export function UpdatesCard({
  updates,
  title = "Updates",
  Icon = Megaphone,
}: UpdatesCardProps) {
  
  return (
    // MAIN CONTAINER: uses p-8 for that high-end spaced feel.
    <div 
      className={`w-full max-w-90 bg-[#FDF1F2] rounded-[30px] p-8 flex flex-col gap-6 shadow-sm border border-accent/5`}
    >
      
      {/* Title Section: Icon and Heading */}
      <div className="flex flex-row items-center gap-2.5">
        <Icon className={`w-6 h-6 text-[#6C1221] opacity-90`} />
        <h1 className="text-2xl font-bold text-[#241919]">
          {title}
        </h1>
      </div>

      {/* Updates List */}
      <section className="flex flex-col gap-5">
        {updates.map((update) => (
          
          // Use CSS Grid for robust alignment of dot and content
          <div key={update.id} className="grid grid-cols-[auto_1fr] items-start gap-x-3.5 gap-y-1">
            
            {/* The Dot Separator (CSS Circle) */}
            <div 
              className={`w-2 h-2 rounded-full mt-2 text-[#6C1221] opacity-90`} 
              aria-hidden="true" 
            />
            
            {/* Event and Timestamp */}
            <div className="flex flex-col">
              <p className="text-base font-medium text-[#241919] leading-tight">
                {update.event}
              </p>
              <span className="text-sm text-gray-500 font-medium lowercase">
                {update.timestamp}
              </span>
            </div>

          </div>
        ))}
      </section>

    </div>
  );
}