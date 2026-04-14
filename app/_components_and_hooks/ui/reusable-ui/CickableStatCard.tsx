"use client";
import { Icon, type LucideIcon } from "lucide-react";

interface QuickInfoProps {
  title: string;
  Icon: LucideIcon;
  statsNum: number;
}

export function QuickInfoCard({ title, Icon, statsNum }: QuickInfoProps) {
  return (
    <div className="w-full h-34 bg-[#FFF0F0] rounded-l-[40px] rounded-br-[40px] flex items-center justify-between
     p-4 shadow-sm">
  <div id="title-and-number" className="flex flex-col gap-1">
    <h1 className="text-[#6A0A1DB2] text-xs font-bold tracking-widest leading-none">
      {title.toUpperCase()}
    </h1>
    <p className="text-[#241919] text-3xl font-black leading-none">
      {statsNum}
    </p>
  </div>

  <div className="bg-white/50 p-3 rounded-2xl flex items-center justify-center">
    <Icon size={32} className="text-[#6A0A1D] opacity-90" />
  </div>
</div>
  );
}
