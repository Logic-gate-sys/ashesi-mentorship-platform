"use client";

import React, { useState } from 'react';
import { Search, Bell, Info, Video, Paperclip, Send, Star, Clock, Calendar } from 'lucide-react';

/**
 * MESSAGING HUB DASHBOARD
 * Tailored for the Ashesi University Mentor Portal
 */

export default function MessagingDashboard() {
  return (
    <div className="flex-1 bg-[#F9F9F9] min-h-screen p-8 overflow-hidden flex flex-col">
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-serif font-bold text-[#6A0A1D]">
          Welcome Back, Kwesi! Let's Connect.
        </h1>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: CONVERSATIONS (3/12) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <h2 className="text-xl font-bold text-[#6A0A1D] px-2">Conversations</h2>
          <div className="space-y-3">
            {chats.map((chat, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-4 p-4 rounded-[24px] cursor-pointer transition-all ${i === 0 ? 'bg-white shadow-sm border border-[#6A0A1D]/10' : 'hover:bg-white/50'}`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <img src={chat.avatar} alt={chat.name} />
                  {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[#241919] truncate">{chat.name}</p>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE CHAT (6/12) */}
        <div className="col-span-6 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg text-[#241919]">Kojo Annan</p>
              <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
              </span>
            </div>
            <div className="flex gap-4 text-gray-400">
              <Video className="w-5 h-5 cursor-pointer hover:text-[#6A0A1D]" />
              <Info className="w-5 h-5 cursor-pointer hover:text-[#6A0A1D]" />
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar">
            <Message text="Hey Kwesi, have you had a chance to look at the new mentorship curriculum?" isUser={false} />
            <Message text="Just reviewing it now. It looks incredibly comprehensive." isUser={true} />
            <Message text="Great! Let's touch base on it tomorrow after the project review." isUser={false} />
            <Message text="Sounds good. Talk to you soon!" isUser={true} />
          </div>

          <div className="p-6 bg-white">
            <div className="relative flex items-center gap-3 bg-[#FAF8F8] p-2 rounded-full border border-gray-100">
              <button className="p-3 text-gray-400 hover:text-[#6A0A1D]"><Paperclip className="w-5 h-5" /></button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="bg-[#6A0A1D] p-3 rounded-full text-white shadow-md hover:brightness-110">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UTILITY WIDGETS (3/12) */}
        <div className="col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          
          {/* Updates Feed */}
          <div className="bg-[#FDF1F2] rounded-[30px] p-6 border border-black/5">
            <h3 className="text-sm font-bold text-[#6A0A1D] flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4" /> Updates Feed
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6A0A1D] mt-1.5" />
                <p className="text-xs text-gray-600"><span className="font-bold">New Mentee Request</span>: Amaa requested a meeting.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5" />
                <p className="text-xs text-gray-600"><span className="font-bold">Career Fair 2024</span>: Alumni session starts in 2 days.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-[#FDF1F2] rounded-[30px] p-6 border border-black/5">
            <h3 className="text-sm font-bold text-[#6A0A1D] flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" /> Upcoming Schedule
            </h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6A0A1D]" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Meeting</span>
                <span className="text-[10px] font-bold text-[#6A0A1D]">June 15</span>
              </div>
              <p className="text-sm font-bold text-[#241919] mb-3">Project Review with Akosua</p>
              <p className="text-[10px] text-gray-500 mb-4 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 2:00 PM - 3:00 PM
              </p>
              <button className="w-full py-2 border border-[#6A0A1D] text-[#6A0A1D] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#6A0A1D] hover:text-white transition-all">
                Join Video Call
              </button>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-[#FDF1F2] rounded-[30px] p-6 border border-black/5">
            <h3 className="text-sm font-bold text-[#6A0A1D] mb-2">Give Feedback</h3>
            <p className="text-[10px] text-gray-500 mb-4">How was your last messaging session with Kojo?</p>
            <div className="flex justify-center gap-1 mb-5">
              {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= 4 ? 'fill-[#6A0A1D] text-[#6A0A1D]' : 'text-gray-300'}`} />)}
            </div>
            <button className="w-full py-3 bg-[#6A0A1D] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg">
              Rate Session
            </button>
          </div>

          {/* Status Toggle */}
          <div className="bg-white rounded-[30px] p-5 border border-black/5 flex flex-col gap-3">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-green-500 uppercase">Available</p>
                  <p className="text-xs font-bold text-[#241919]">Open to Mentorship</p>
                </div>
                <div className="w-10 h-5 bg-[#6A0A1D] rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
             </div>
             <div className="pt-3 border-t">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Weekly Hours</p>
               <p className="text-[10px] text-gray-600">Tue, Thu: 4:00 PM - 6:00 PM</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Message({ text, isUser }: { text: string, isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-5 rounded-[24px] text-sm shadow-sm ${isUser ? 'bg-[#6A0A1D] text-white rounded-tr-none' : 'bg-[#F3E8E8] text-[#241919] rounded-tl-none'}`}>
        {text}
      </div>
    </div>
  );
}

const chats = [
  { name: "Kojo Annan", lastMsg: "Sounds good...", time: "10:42 AM", online: true, avatar: "https://i.pravatar.cc/150?u=kojo" },
  { name: "Akosua John", lastMsg: "The raw data...", time: "Yesterday", online: false, avatar: "https://i.pravatar.cc/150?u=akosua" },
  { name: "Ama K.", lastMsg: "I really appreciated...", time: "1 day ago", online: false, avatar: "https://i.pravatar.cc/150?u=ama" },
  { name: "Joseph M.", lastMsg: "Last time I did...", time: "2 days ago", online: false, avatar: "https://i.pravatar.cc/150?u=joseph" },
];