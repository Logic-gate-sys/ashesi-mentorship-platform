"use client";

import React from 'react';
import { Star, TrendingUp, Users, Clock, Award, Quote } from 'lucide-react';

/**
 * MENTEE FEEDBACK VIEW
 * Core Screen for tracking impact and reading student testimonials.
 */

export default function FeedbackScreen() {
  return (
    <div className="flex-1 p-10 overflow-y-auto no-scrollbar rounded-tl-[60px] ml-[-60px] ">
      {/* --- PAGE HEADER --- */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#241919] mb-2">Mentee Feedback</h1>
          <p className="text-gray-500 font-medium">Refining academic growth through impactful peer guidance.</p>
        </div>
        <div className="flex gap-3 bg-[#F3E8E8]/50 p-1.5 rounded-2xl border border-[#6A0A1D]/5">
           <button className="px-6 py-2.5 bg-white text-[#6A0A1D] rounded-xl text-xs font-bold shadow-sm">Pending Feedback</button>
           <button className="px-6 py-2.5 text-gray-400 text-xs font-bold">Feedback Given</button>
           <button className="px-6 py-2.5 bg-[#6A0A1D] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">View Impact Reports</button>
        </div>
      </header>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Mentees" value="42" trend="+12%" icon={<Users className="w-4 h-4" />} />
        <StatCard label="Total Hours" value="320" subValue="Sessions" icon={<Clock className="w-4 h-4" />} />
        <StatCard label="Average Rating" value="4.9" trend="TOP 1%" isBadge icon={<Star className="w-4 h-4" />} />
        <StatCard label="Outcomes" value="38" subValue="Grants" icon={<Award className="w-4 h-4" />} />
      </div>

      {/* --- SKILLS & PROGRESSION GRID --- */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        
        {/* SKILLS TRANSFERRED */}
        <div className="col-span-5 bg-[#F3E8E8]/30 rounded-[40px] p-10 border border-[#6A0A1D]/5">
          <h3 className="text-xl font-bold text-[#6A0A1D] mb-8">Skills Transferred</h3>
          <div className="space-y-8">
            <SkillBar label="Python & Data Science" percentage={88} />
            <SkillBar label="Research Methodology" percentage={94} />
            <SkillBar label="Leadership & Mentoring" percentage={72} />
            <SkillBar label="Academic Writing" percentage={65} />
          </div>
        </div>

        {/* IMPACT PROGRESSION CHART */}
        <div className="col-span-7 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#241919]">Impact Progression</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session Engagement (Monthly)</span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2">
            <Bar height="30%" month="Sep" />
            <Bar height="45%" month="Oct" />
            <Bar height="40%" month="Nov" />
            <Bar height="65%" month="Dec" active />
            <Bar height="50%" month="Jan" />
            <Bar height="75%" month="Feb" active />
            <Bar height="80%" month="Mar" active />
            <Bar height="85%" month="Apr" active />
            <Bar height="90%" month="May" active />
            <Bar height="88%" month="Jun" active />
            <Bar height="100%" month="Jul" active />
          </div>
        </div>
      </div>

      {/* --- TESTIMONIALS SECTION --- */}
      <section>
        <h3 className="text-2xl font-serif font-bold text-[#241919] mb-8">Voices from Mentees</h3>
        <div className="grid grid-cols-3 gap-6">
          <TestimonialCard 
            rating={5}
            text="Elena's guidance on my doctoral thesis was transformative. She didn't just teach me Python; she taught me how to think like a scientist and tackle complex data problems."
            author="Marcus Thorne"
            role="PHD CANDIDATE, CS"
            avatar="https://i.pravatar.cc/150?u=marcus"
          />
          <TestimonialCard 
            rating={5}
            text="I went from struggling with methodology to winning a department research grant. The structured feedback sessions were exactly what I needed to refine my proposal."
            author="Sarah Jenkins"
            role="RESEARCH ASSOCIATE"
            avatar="https://i.pravatar.cc/150?u=sarah"
          />
          <TestimonialCard 
            rating={5}
            text="The clarity she brings to complex academic writing is unmatched. My publication rate has doubled since we started our monthly reviews and deep-dives."
            author="David Okafor"
            role="JUNIOR FACULTY"
            avatar="https://i.pravatar.cc/150?u=david"
          />
        </div>
      </section>
    </div>
  );
}

// --- UI HELPER COMPONENTS ---

function StatCard({ label, value, subValue, trend, isBadge, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#241919]">{value}</span>
          {subValue && <span className="text-xs text-gray-400 font-medium">{subValue}</span>}
        </div>
        {trend && (
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${isBadge ? 'bg-[#FDCBCB] text-[#6A0A1D]' : 'bg-[#DCFCE7] text-[#15803d]'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function SkillBar({ label, percentage }: { label: string, percentage: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[#241919]">{label}</span>
        <span className="text-xs font-bold text-[#6A0A1D]">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
        <div className="h-full bg-[#6A0A1D] rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function Bar({ height, month, active }: { height: string, month: string, active?: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div 
        className={`w-full rounded-t-xl transition-all duration-500 ${active ? 'bg-[#6A0A1D]' : 'bg-[#E5D1D1]'}`} 
        style={{ height }} 
      />
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{month}</span>
    </div>
  );
}

function TestimonialCard({ rating, text, author, role, avatar }: any) {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative group hover:shadow-md transition-shadow">
      <Quote className="absolute top-8 right-8 w-12 h-12 text-[#F3E8E8] group-hover:text-[#6A0A1D]/10 transition-colors" />
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#6A0A1D] text-[#6A0A1D]" />)}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-8 relative z-10 font-medium italic">"{text}"</p>
      <div className="flex items-center gap-4">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
        <div>
          <h4 className="text-sm font-bold text-[#6A0A1D]">{author}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  );
}