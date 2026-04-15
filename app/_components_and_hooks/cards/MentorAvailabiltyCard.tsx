"use client";
import React, { useState } from 'react';

interface AvailabilityCardProps {
  initialStatus?: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

export function MentorAvailabilityCard({
  initialStatus = true,
  onStatusChange,
}: AvailabilityCardProps) {
  
  const [isOpen, setIsOpen] = useState(initialStatus);

  const handleToggle = () => {
    // update availability through api, then toggle
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    onStatusChange?.(newStatus); 
  };

  return (
    <div  className={`w-full max-w-90 bg-[#FDF1F2] rounded-[30px] p-8 pl-9 pr-9 flex flex-row items-center justify-between shadow-sm border border-accent/5`}>
      <div className="flex flex-col gap-1.5 justify-center">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500 opacity-80 leading-tight">
          STATUS
        </span>
        <p className={`text-base font-medium text-[#6C1221] leading-tight`}> {isOpen ? "Open to Mentorship" : "Closed to Mentorship"}</p>
      </div>

      <button
        role="switch"
        aria-checked={isOpen}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        className={`relative flex items-center shrink-0 w-16 h-8.5 rounded-[17px] cursor-pointer transition-colors duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-accent/40
          ${isOpen ? "bg-[#6C1221]" : "bg-gray-300"}`} 
      >
        <span 
          className={`absolute block w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300
            ${isOpen ? "translate-x-8" : "translate-x-0.75"}`}
        />
        
        <span className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-[17px] transition-opacity`} />
      </button>

    </div>
  );
}