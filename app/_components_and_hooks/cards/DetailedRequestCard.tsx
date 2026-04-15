"use client";
import React from 'react';
import Image from 'next/image';
import { type LucideIcon, CalendarClock } from 'lucide-react';

interface RequestTag {
  id: string | number;
  label: string; // Example: PYTHON
}

interface RequestCardProps {
  // Primary Student Info
  id: string | number;
  studentName: string;
  majorAndYear: string; // Example: (CS '26)
  studentAvatarUrl: string;
  messagePreview: string; // The long paragraph
  
  // Metadata & Status
  requestTime: string; // Example: 2 HOURS AGO
  tags: RequestTag[];
  initialStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
  StatusIcon?: LucideIcon; // Default: CalendarClock
  
  // Action Callbacks
  onAccept?: (id: string | number) => void;
  onDecline?: (id: string | number) => void;
  
  // Customization (Props to match existing cards)
  bgColor?: string; // Default: bg-white
  accentColor?: string; // Default: bg-[#6A0A1D] (dark burgundy)
}

export function ProfessorRequestCard({
  id,
  studentName,
  majorAndYear,
  studentAvatarUrl,
  messagePreview,
  requestTime,
  tags = [],
  initialStatus = "PENDING",
  StatusIcon = CalendarClock,
  onAccept,
  onDecline,
}: RequestCardProps) {
  
  // Handle actions safely
  const handleAccept = () => onAccept?.(id);
  const handleDecline = () => onDecline?.(id);

  return (
    <div 
      className={`w-full max-w-[700px] bg-white rounded-[30px] p-10 flex flex-col gap-8 shadow-sm border border-accent/5`}
    >
      
      <div className="flex flex-row items-center justify-between gap-6">
        
        <div className="flex flex-row items-center gap-5">
          <div className="relative w-[120px] h-[120px] shrink-0 rounded-[20px] overflow-hidden border">
            <Image
              src={studentAvatarUrl || "/default-professor.png"} // Fallback image
              alt={`${studentName}'s profile`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1.5 justify-center">
            <h1 className="text-2xl font-bold text-[#241919]">
              Student {studentName} {majorAndYear}
            </h1>
            
            <div className="flex flex-row gap-2.5 mt-1">
              {tags.map((tag) => (
                <span key={tag.id} className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full pl-3.5 pr-3.5 pt-1.5 pb-1.5 uppercase tracking-wider">
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          
          <div className="flex flex-row items-center gap-2 bg-[#FEF9C3] text-[#A16207] rounded-[10px] pl-3.5 pr-3.5 pt-1 pb-1.5">
            <StatusIcon className="w-3.5 h-3.5 text-[#A16207]/70" strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">
              {initialStatus}
            </span>
          </div>
          
          <span className="text-sm text-gray-400 font-medium lowercase tracking-wide">
            {requestTime}
          </span>
        </div>
        
      </div>

      <div className="bg-[#FAF8F8] p-8 pl-9 pr-9 rounded-2xl">
        <p className="text-base font-normal text-[#241919]/90 leading-relaxed tracking-wider">
          “{messagePreview}”
        </p>
      </div>

      <div className="flex flex-row items-center gap-6 mt-1.5">
        <button
          onClick={handleAccept}
          className={`w-[260px] h-[58px] bg-[#6A0A1D] hover:brightness-110 text-white rounded-[28px] text-lg font-bold uppercase tracking-wider transition-all`}
        >
          Accept Request
        </button>
        
        <button
          onClick={handleDecline}
          className={`w-[200px] h-[58px] bg-white border-2 border-[#6A0A1D] bg-[#6A0A1D] hover:bg-[#6A0A1D]/5 rounded-[28px] text-lg font-bold uppercase tracking-wider transition-all`}
        >
          Decline
        </button>
      </div>
      
    </div>
  );
}