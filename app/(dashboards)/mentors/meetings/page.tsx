"use client";
import { Plus, Search, Calendar, Video, MessageSquare, Clock, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MeetingsScreen() {
  return (
    <div className="flex-1  p-10  no-scrollbar rounded-tl-[60px] ml-[-60px] ">
      {/* --- PAGE HEADER --- */}
      <header className="flex justify-between items-start mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-serif font-bold text-[#6A0A1D] mb-4">My Mentorship Availability</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Create, view, and manage your availability slots for the upcoming weeks. Keep your schedule updated to help students find the best times for guidance.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Search className="text-gray-400" />
           <div className="w-10 h-10 rounded-full bg-gray-200 border border-white overflow-hidden shadow-sm">
              <img src="https://i.pravatar.cc/150?u=dr_araba" alt="Profile" />
           </div>
        </div>
      </header>

      {/* --- SUB-NAVIGATION & ACTION --- */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-2 bg-[#F3E8E8]/50 p-1.5 rounded-[22px] border border-[#6A0A1D]/5">
           <button className="px-6 py-2.5 bg-[#6A0A1D] text-white rounded-[18px] text-xs font-bold shadow-md">Availability (4)</button>
           {['Mentee Bookings', 'Upcoming Meetings', 'Reschedule', 'Past Meetings'].map(tab => (
             <button key={tab} className="px-5 py-2.5 text-gray-500 text-xs font-bold hover:text-[#6A0A1D] transition-colors">
               {tab}
             </button>
           ))}
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-[#6A0A1D] text-white rounded-[20px] text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
          <Plus size={18} /> Create New Availability Slot
        </button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-12 gap-12">
        
        {/* LEFT: CALENDAR PICKER (3/12) */}
        <div className="col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#6A0A1D]">October 2023</h3>
            <div className="flex gap-4 text-gray-400">
              <ChevronLeft className="cursor-pointer" size={20} />
              <ChevronRight className="cursor-pointer" size={20} />
            </div>
          </div>
          {/* Simple Grid Calendar Mockup */}
          <div className="grid grid-cols-7 gap-y-4 text-center mb-8">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <span key={day} className="text-[10px] font-bold text-gray-300 tracking-tighter">{day}</span>
            ))}
            {/* Calendar Numbers with logic for Active/Booked */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <div key={day} className="relative py-2 flex justify-center items-center">
                <span className={`text-xs font-bold ${day === 24 ? 'bg-[#6A0A1D] text-white w-8 h-8 rounded-full flex items-center justify-center' : 'text-gray-400'}`}>
                  {day}
                </span>
                {day === 26 && <div className="absolute inset-0 m-auto w-8 h-8 border-2 border-[#6A0A1D] rounded-full" />}
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
               <div className="w-2.5 h-2.5 bg-[#6A0A1D] rounded-full" /> Booked Session
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
               <div className="w-2.5 h-2.5 border-2 border-[#6A0A1D] rounded-full" /> Available Slot
            </div>
          </div>
        </div>

        {/* CENTER: SLOTS LIST (6/12) */}
        <div className="col-span-6 space-y-6">
          <h3 className="text-xl font-bold text-[#241919] mb-4">Available & Booked Time Slots</h3>
          
          {/* BOOKED SLOT CARD */}
          <div className="bg-white rounded-[30px] border-l-[6px] border-[#6A0A1D] p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?u=kojob" className="w-14 h-14 rounded-2xl border shadow-sm" alt="Kojo" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-[#241919]">Kojo B.</h4>
                  <span className="bg-[#241919] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Booked</span>
                </div>
                <p className="text-xs text-gray-400">Major: Computer Science '25</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#6A0A1D] mb-1">Oct 24, 2023</p>
              <p className="text-xs font-medium text-gray-400">10:30 AM - 11:30 AM</p>
            </div>
            <div className="flex gap-2 ml-4">
               <button className="p-2.5 bg-[#6A0A1D] text-white rounded-xl shadow-md"><Video size={16} /></button>
               <button className="p-2.5 bg-[#F3E8E8] text-[#6A0A1D] rounded-xl"><MessageSquare size={16} /></button>
            </div>
          </div>

          {/* AVAILABLE SLOT CARD */}
          <AvailabilitySlot time="10:00 AM - 11:00 AM" type="Zoom Meeting" />
          <AvailabilitySlot time="01:00 PM - 02:00 PM" type="In-person (Office 402)" />
          <AvailabilitySlot time="10:00 AM - 11:00 AM" type="Zoom Meeting" />
        </div>

        {/* RIGHT: SIDEBAR UPDATES (3/12) */}
        <div className="col-span-3 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[#241919] mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#6A0A1D]" /> Upcoming
            </h3>
            <MeetingDetailCard 
              name="Kojo B. (CS '26)" 
              status="Confirmed" 
              time="10:30-11:30 AM" 
              date="Oct 24, 2024"
              avatar="https://i.pravatar.cc/150?u=kojo26"
              isActionable
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#241919] mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gray-200" /> Past
            </h3>
            <MeetingDetailCard 
              name="Akosua A. (BA '27)" 
              status="Completed" 
              time="02:00-03:00 PM" 
              date="Oct 20, 2024"
              avatar="https://i.pravatar.cc/150?u=akosua27"
              isMuted
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function AvailabilitySlot({ time, type }: { time: string, type: string }) {
  return (
    <div className="bg-[#F0FDF4] rounded-[24px] p-6 flex items-center justify-between border border-transparent hover:border-green-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600">
           <Video size={20} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-xs font-bold text-gray-500">Oct 26, 2023</h4>
            <span className="bg-[#DCFCE7] text-[#15803d] text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Available</span>
          </div>
          <p className="text-xs font-bold text-[#241919]">Type: {type}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-bold text-[#6A0A1D]">{time}</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-[#241919] uppercase">
             <Edit2 size={12} /> Edit
           </button>
           <button className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase">
             <Trash2 size={12} /> Delete
           </button>
        </div>
      </div>
    </div>
  );
}

function MeetingDetailCard({ name, status, time, date, avatar, isActionable, isMuted }: any) {
  return (
    <div className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-[#DCFCE7] text-[#15803d]'}`}>
           {status}
         </span>
      </div>
      <div className="flex items-center gap-4 mb-4">
         <img src={avatar} className="w-16 h-16 rounded-2xl object-cover" />
         <div>
            <h4 className="font-bold text-[#241919] text-sm">{name}</h4>
            <div className="space-y-1 mt-1">
               <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                 <Calendar size={10} /> {date}
               </p>
               <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                 <Clock size={10} /> {time}
               </p>
            </div>
         </div>
      </div>
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
         {isActionable ? (
           <>
            <button className="w-full py-3 bg-[#6A0A1D] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md">Join Zoom Meeting</button>
            <button className="w-full py-3 border border-[#6A0A1D] text-[#6A0A1D] rounded-xl text-[10px] font-bold uppercase tracking-widest">Send Message</button>
           </>
         ) : (
           <div className="flex gap-2">
              <button className="flex-1 py-3 bg-[#F3E8E8] text-[#6A0A1D] rounded-xl text-[10px] font-bold uppercase tracking-widest">View Notes</button>
              <button className="flex-1 py-3 border border-[#F3E8E8] text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest">Rate Meeting</button>
           </div>
         )}
      </div>
    </div>
  );
}