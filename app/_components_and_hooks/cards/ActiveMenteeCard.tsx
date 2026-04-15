"use client";
import { type LucideIcon, UserCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface MCardProps {
  mName: string;
  mTitle: string; 
  onMessage?: () => void;
}

export function ActiveMCard({
  mName,
  mTitle,
  onMessage,
}: MCardProps) {

  return (
    <div 
      className={`w-full max-w-[320px] bg-[#FDF1F2] rounded-[30px] rounded-tl-[60px] p-6 pt-5 pb-5 flex flex-col gap-5 shadow-sm border border-accent/5`}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#241919]">
            {mName}
          </h1>
          <p className="text-sm font-medium text-[#6C1221] uppercase tracking-wider">
            {mTitle}
          </p>
        </div>
        <UserCircle className="w-9 h-9 text-[#8D8386]" strokeWidth={1} />
      </div>
      <Link href='/messages'>
      <button
        onClick={onMessage}
        className={`w-full bg-accent accent-[#6C1221] hover:brightness-110 active:scale-[0.98] h-12 flex flex-row items-center justify-center gap-3 rounded-3xl transition-all`}
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-lg font-bold text-white">
          Message
        </span>
      </button>
      </Link>

    </div>
  );
}