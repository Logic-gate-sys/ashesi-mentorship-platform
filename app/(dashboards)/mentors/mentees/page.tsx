"use client";
import React from 'react';
import { Search, Bell, History } from 'lucide-react';
import { MentorAvailabilityCard } from '@/app/_components_and_hooks/cards/MentorAvailabiltyCard';


const sampleMentees = [
  {
    id: "1",
    name: "Kojo Annan",
    major: "CS '26 • Computer Science",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    focusAreas: ["FAANG Internships", "Python Projects"],
    goalProgress: 3,
    totalGoals: 4
  },
  {
    id: "2",
    name: "Akosua Mensah",
    major: "BA '27 • Business Administration",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    focusAreas: ["Career Planning", "Interview Prep"],
    goalProgress: 1,
    totalGoals: 3
  }
];

export default function MentorDashboard() {
  return (
    <div className="flex-1 p-8 ">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#241919]">
            Welcome Back, Dr. Ama Koomson!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            View and manage your current mentee relationships.
          </p>
        </div>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search mentees, documents, or notes..."
          className="w-full h-16 pl-14 pr-6 rounded-3xl bg-[#FDF1F2] border-none focus:ring-2 focus:ring-[#6A0A1D]/20 text-lg outline-none"
        />
      </div>

       <section id='grid' className='grid grid-cols-[2.5fr_1fr] gap-4 '>
         <main>
                <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#241919]">Active Mentees (2)</h2>
        <button className="text-[#6A0A1D] font-bold hover:underline">View Archive &rarr;</button>
           </div>

           <div className="flex flex-col gap-6">
        {sampleMentees.map((mentee) => (
          <ActiveMenteeCard key={mentee.id} {...mentee} />
        ))}
      </div>
         </main>

           <aside className="w-[380px] flex flex-col gap-8 p-6 bg-white overflow-y-auto no-scrollbar">
             <MentorAvailabilityCard />
      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Updates</h4>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-[#FDF1F2] rounded-lg text-[#6A0A1D]">📝</div>
            <div>
              <p className="text-sm font-bold text-[#241919]">New note on Kojo Annan</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-[#FDF1F2] rounded-lg text-[#6A0A1D]">↩️</div>
            <div>
              <p className="text-sm font-bold text-[#241919]">Last message from you</p>
              <p className="text-xs text-gray-400">Yesterday at 4:12 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-[30px] p-6">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Notifications</h4>
        <NotificationCard title="Akosua Mensah booked a session for Tuesday." type="ACTION" time="Just Now" />
        <NotificationCard title="New message from Mentor Ama regarding curriculum." time="Just Now" />
      </div>

      <div>
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Milestones Summary</h4>
        <MilestoneRow name="Kojo Annan" progress="3/4" />
        <MilestoneRow name="Akosua Mensah" progress="1/3" />
      </div>
           </aside>

       </section>
     
    </div>
  );
}




interface MenteeProps {
  name: string;
  major: string;
  avatar: string;
  focusAreas: string[];
  goalProgress: number;
  totalGoals: number;
}

export function ActiveMenteeCard({ name, major, avatar, focusAreas, goalProgress, totalGoals }: MenteeProps) {
  const progressPercentage = (goalProgress / totalGoals) * 100;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm flex items-start gap-8 relative hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-[#241919]">{name}</h3>
            <p className="text-gray-400 font-medium uppercase tracking-wide text-sm">{major}</p>
          </div>
          <button className="text-[#6A0A1D] text-sm font-bold border-b border-[#6A0A1D]">View Profile</button>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-6">
          {/* Focus Areas */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map(area => (
                <span key={area} className="px-4 py-1.5 rounded-lg bg-[#FDF1F2] text-[#6A0A1D] text-xs font-bold">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mentorship Goal Progress</p>
              <p className="text-[#6A0A1D] font-bold text-xs">{goalProgress} of {totalGoals} Complete</p>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#6A0A1D] transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button className="bg-[#6A0A1D] text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:brightness-110">
             Schedule Meeting
          </button>
          <button className="border-2 border-gray-200 text-[#241919] px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50">
            <span>💬</span> Message
          </button>
          <div className="ml-auto flex items-center">
            <span className="bg-[#DCFCE7] text-[#059669] px-4 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ProfileStatusWidget() {
  return (
    <div className="bg-[#6A0A1D] rounded-[30px] p-6 text-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Profile Status</span>
        {/* Custom Toggle using the logic we discussed earlier */}
        <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Accepting Requests</h3>
      <div className="bg-white/10 rounded-2xl p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Available Hours</p>
        <p className="text-sm font-medium">6:00pm - 7:00pm</p>
      </div>
    </div>
  );
}


export function NotificationCard({ title, type, time }: { title: string; type?: string; time: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
      <p className="text-sm font-medium text-[#241919] leading-snug mb-2">{title}</p>
      <div className="flex justify-between items-center">
        {type && <span className="text-[9px] font-bold text-[#6A0A1D] uppercase tracking-tighter">Action Required</span>}
        <span className="text-[10px] text-gray-400 font-bold uppercase ml-auto">{time}</span>
      </div>
    </div>
  );
}


export function MilestoneRow({ name, progress }: { name: string; progress: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm font-medium text-[#241919]">{name}</span>
      <span className="bg-gray-100 px-3 py-1 rounded-md text-[10px] font-bold text-gray-500 uppercase">{progress} Met</span>
    </div>
  );
}