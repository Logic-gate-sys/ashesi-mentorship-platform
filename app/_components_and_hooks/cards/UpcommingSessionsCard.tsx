"use client";
import { type LucideIcon, CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CalendarEvent {
  id: string | number;
  month: string; 
  day: string | number; 
  title: string; 
  meetingUrl: string; 
}

interface UpcomingEventsCardProps {
  events: CalendarEvent[];
  title?: string; // Default: Upcoming
  Icon?: LucideIcon; // Default: CalendarDays
}

export function UpcomingEventsCard({
  events,
  title = "Upcoming",
  Icon = CalendarDays,
}: UpcomingEventsCardProps) {
  
  return (
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

      {/* Events List */}
      <section className="flex flex-col gap-4">
        {events.map((event) => (
          
          // EVENT ITEM CONTAINER: Inner flex layout
          <div key={event.id} className="w-full flex flex-row items-start gap-4 p-4 pl-3.5 pr-3.5 bg-white rounded-2xl shadow-inner">
            
            {/* The Date Block: Stacked flex col */}
            <div className={`flex flex-col items-center justify-center shrink-0 w-18 h-[72px] bg-[#FDF1F2] rounded-xl`} aria-hidden="true">
              <span className={`text-xs font-medium uppercase tracking-widest text-[#6C1221] leading-none`}>
                {event.month}
              </span>
              <span className={`text-4xl font-extrabold text-[#6C1221] leading-none mt-1`}>
                {event.day}
              </span>
            </div>
            
            {/* The Event Text and Link */}
            <div className="flex-1 flex flex-col gap-1.5 justify-center">
              <p className="text-base font-medium text-[#241919] leading-tight">
                {event.title}
              </p>
              
              {/* MEETING LINK */}
              <Link href={event.meetingUrl} className={`flex flex-row items-center gap-1.5 group`}>
                <span className={`text-xs font-medium uppercase tracking-widest text-[#6C1221] opacity-70 group-hover:opacity-100 transition-opacity`}>
                  LINK TO MEETING
                </span>
                <ExternalLink className={`w-3 h-3 text-[#6C1221] opacity-60`} strokeWidth={1.5} />
              </Link>
            </div>

          </div>
        ))}
      </section>

    </div>
  );
}