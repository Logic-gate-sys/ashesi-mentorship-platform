"use client";
import React from 'react';
import Image from 'next/image';
import { ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

type RequestStatus = 'PENDING' | 'CONNECTED' | 'DECLINED';

interface StatusRequestCardProps {
  studentName: string;
  majorAndYear: string;
  focusArea: string;
  status: RequestStatus;
  avatarUrl?: string;
  onClick?: () => void;
}

export function StatusRequestCard({
  studentName,
  majorAndYear,
  focusArea,
  status,
  avatarUrl,
  onClick
}: StatusRequestCardProps) {
  
  // COLOR & ICON MAPPING (The logic stays inside the component)
  const statusStyles = {
    PENDING: {
      container: "bg-[#FDF1F2]", // Light Pink
      text: "text-[#241919]",
      subtext: "text-gray-600",
      badge: "bg-[#FEF9C3] text-[#A16207]", // Yellow
      icon: <Clock className="w-4 h-4" />
    },
    CONNECTED: {
      container: "bg-[#F0FDF4]", // Light Green
      text: "text-[#064E3B]",
      subtext: "text-[#065F46]/80",
      badge: "bg-[#DCFCE7] text-[#059669] border border-[#059669]/20",
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    DECLINED: {
      container: "bg-[#FDF1F2]", 
      text: "text-[#241919]",
      subtext: "text-[#B91C1C]", // Red focus text
      badge: "bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C]/20",
      icon: <XCircle className="w-4 h-4" />
    }
  };

  const style = statusStyles[status];

  return (
    <div 
      onClick={onClick}
      className={`w-full p-5 rounded-2xl flex flex-row items-center justify-between transition-all cursor-pointer hover:shadow-md ${style.container}`}
    >
      <div className="flex flex-row items-center gap-4">
        {/* AVATAR / INITIALS */}
        <div className="relative w-16 h-16 shrink-0 rounded-[16px] overflow-hidden bg-white/50 flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={studentName} fill unoptimized className="object-cover" />
          ) : (
            <span className="text-xl font-bold text-[#6A0A1D]">
              {studentName?.split(' ').map(n => n[0]).join('') || '?'}
            </span>
          )}
        </div>

        {/* TEXT CONTENT */}
        <div className="flex flex-col gap-0.5">
          <h3 className={`text-lg font-bold ${style.text}`}>
            {studentName} ({majorAndYear})
          </h3>
          <p className={`text-sm font-medium ${style.subtext}`}>
            {focusArea}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: BADGE & CHEVRON */}
      <div className="flex flex-row items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs tracking-wider ${style.badge}`}>
          {style.icon}
          {status}
        </div>
        <ChevronRight className={`w-5 h-5 ${style.text} opacity-60`} />
      </div>
    </div>
  );
}