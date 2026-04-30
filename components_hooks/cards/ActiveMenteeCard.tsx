"use client";
import { UserCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface MCardProps {
  mName: string;
  mTitle: string;
  onMessage?: () => void;
}

export function ActiveMCard({ mName, mTitle, onMessage }: MCardProps) {
  return (
    <div className="w-full max-w-sm bg-[#FDF1F2] rounded-[28px] rounded-tl-[56px] p-5 flex flex-col gap-4 shadow-sm border border-accent/5">
      
      {/* Identity row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h2 className="text-lg font-bold text-[#241919] leading-snug truncate">
            {mName}
          </h2>
          <p className="text-xs font-semibold text-[#6C1221] uppercase tracking-widest truncate">
            {mTitle}
          </p>
        </div>
        <UserCircle className="w-10 h-10 shrink-0 text-[#8D8386]" strokeWidth={1} />
      </div>

      {/* Message CTA */}
      <Link href="/mentors/messages" className="block w-full">
        <button
          onClick={onMessage}
          className="w-full bg-accent hover:brightness-110 active:scale-[0.98] h-11 flex items-center justify-center gap-2 rounded-2xl transition-all"
        >
          <MessageSquare className="w-4 h-4 text-white shrink-0" />
          <span className="text-sm font-bold text-white">Message</span>
        </button>
      </Link>

    </div>
  );
}