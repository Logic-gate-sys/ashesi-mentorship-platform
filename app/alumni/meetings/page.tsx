'use client'

import Image from 'next/image'
import doctorImg from '@/public/assets/Ama M.jpeg'
import kojoImg from '@/public/assets/Daniel K.jpeg'
import akosuaImg from '@/public/assets/Soukouratou.jpeg'

export default function AlumniMeetings() {
  return (
    <div className="w-full bg-white p-12 overflow-y-auto">
      
      {/* Top Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="relative w-96">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search bookings..." className="w-full bg-[#fff5f5] rounded-full py-4 pl-14 pr-6 text-xs font-bold focus:outline-none" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-6 text-xl text-gray-400">
            <button className="relative">
              🔔
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button>🕒</button>
          </div>
          <div className="text-right">
            <h4 className="text-[11px] font-black text-[#0f172a] leading-none mb-1">Dr. Araba Mensah</h4>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SENIOR EDITOR</p>
          </div>
          <Image src={doctorImg} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-[#fff5f5] shadow-sm ml-2" width={40} height={40} />
        </div>
      </header>

      <header className="mb-8">
        <h1 className="text-4xl font-black text-[#5a1620] italic mb-2">My Mentorship Availability</h1>
        <p className="text-sm font-bold text-gray-500 max-w-3xl">Create, view, and manage your availability slots for the upcoming weeks. Keep your schedule updated to help students find the best times for guidance.</p>
      </header>

      {/* Action Tabs & Call to Action */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex gap-4">
          <button className="bg-[#5a1620] text-white px-8 py-3 rounded-full font-black text-xs shadow-lg">Availability (4)</button>
          <button className="bg-[#f8f9fa] text-gray-400 px-8 py-3 rounded-full font-black text-xs hover:bg-gray-100 transition-colors">Mentee Bookings</button>
          <button className="bg-[#f8f9fa] text-gray-400 px-8 py-3 rounded-full font-black text-xs hover:bg-gray-100 transition-colors">Upcoming Meetings</button>
          <button className="bg-[#f8f9fa] text-gray-400 px-8 py-3 rounded-full font-black text-xs hover:bg-gray-100 transition-colors">Reschedule</button>
          <button className="bg-[#f8f9fa] text-gray-400 px-8 py-3 rounded-full font-black text-xs hover:bg-gray-100 transition-colors">Past Meetings</button>
        </div>
        <button className="bg-[#5a1620] text-white px-10 py-4 rounded-full font-black text-xs shadow-xl hover:scale-105 transition-all">
          + Create New Availability Slot
        </button>
      </div>

      <div className="flex gap-14 flex-1">
        
        {/* Left Column - Calendar */}
        <div className="w-[300px] shrink-0">
          <div className="bg-[#fff5f5] rounded-[48px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-[#5a1620]">October 2023</h3>
              <div className="flex gap-4">
                <button className="text-[#5a1620] font-black">❮</button>
                <button className="text-[#5a1620] font-black">❯</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 text-center mb-6">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <span key={day} className="text-[10px] font-black text-gray-400">{day}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {[24, 25, 26, 27, 28, 29, 30].map(d => <span key={d} className="text-xs font-bold text-gray-200">{d}</span>)}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map(d => {
                const isBooked = [24].includes(d)
                const isAvailable = d === 26
                
                return (
                  <div key={d} className="flex flex-col items-center justify-center relative h-8">
                    <span className={`text-[11px] font-black z-10 ${isBooked ? 'text-white' : 'text-[#2b2b2b]'}`}>
                      {d}
                    </span>
                    {isBooked && <div className="absolute inset-0 bg-[#5a1620] rounded-full scale-125 shadow-md"></div>}
                    {isAvailable && <div className="absolute inset-0 border-2 border-[#7b2228] rounded-full scale-125"></div>}
                  </div>
                )
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-red-100 flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">CALENDAR LEGEND</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#5a1620] rounded-full shadow-sm"></span>
                  <span className="text-[10px] font-bold text-gray-500">Booked Session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#7b2228] rounded-full"></span>
                  <span className="text-[10px] font-bold text-gray-500">Available Slot</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Slots */}
        <div className="flex-1 space-y-8">
          <h3 className="text-2xl font-black text-[#5a1620] mb-8">Available & Booked Time Slots</h3>
          
          {/* Booked Slot */}
          <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#7b2228]"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <Image src={kojoImg} alt="Kojo" className="w-14 h-14 rounded-xl object-cover shadow-md border-2 border-white" width={56} height={56} />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-black text-[#0f172a]">Kojo B.</h4>
                    <span className="bg-[#2b2b2b] text-white px-3 py-1 rounded-lg text-[9px] font-black shadow-sm">BOOKED</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">Major: Computer Science &apos;25</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-[#7b2228]">Oct 24, 2023</p>
                <p className="text-[10px] font-black text-gray-300">10:30 AM - 11:30 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#5a1620] text-white px-8 py-3 rounded-2xl font-black text-[10px] shadow-lg hover:scale-105 transition-all">Join Meeting</button>
              <button className="border-2 border-red-50 text-[#7b2228] px-8 py-3 rounded-2xl font-black text-[10px] hover:bg-[#fff5f5]">Send Message</button>
              <button className="bg-gray-50 text-gray-400 px-8 py-3 rounded-2xl font-black text-[10px] ml-auto">Edit Booking</button>
            </div>
          </div>

          {/* Available Slots */}
          {[
            { type: 'Zoom Meeting', time: '10:00 AM - 11:00 AM', icon: '📹' },
            { type: 'In-person (Office 402)', time: '01:00 PM - 02:00 PM', icon: '🏢' },
            { type: 'Zoom Meeting', time: '10:00 AM - 11:00 AM', icon: '📹' }
          ].map((slot, i) => (
            <div key={i} className="bg-white border-2 border-[#fff5f5] rounded-[32px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#f0fdf4]/50 border border-[#dcfce7] rounded-xl flex items-center justify-center text-xl shadow-inner">{slot.icon}</div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-[11px] font-black text-[#0f172a]">Oct 26, 2023</h4>
                    <span className="bg-[#dcfce7] text-[#166534] px-4 py-1 rounded-lg text-[8px] font-black shadow-sm">AVAILABLE</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-300">Type: {slot.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-[11px] font-black text-[#7b2228]">{slot.time}</p>
                  <div className="flex justify-end gap-3 mt-2">
                    <button className="text-[9px] font-black text-gray-300 hover:text-[#7b2228] uppercase">✎ Edit</button>
                    <button className="text-[9px] font-black text-gray-300 hover:text-red-500 uppercase">🗑 Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-[340px] space-y-10">
          
          {/* Upcoming Widget */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-300 pl-4 border-l-4 border-red-500 italic">Upcoming</h3>
            <div className="bg-[#fff5f5] rounded-[48px] p-8 border border-red-50/50 shadow-sm relative overflow-hidden group">
              <div className="flex items-start justify-between mb-6">
                <span className="bg-[#dcfce7] text-[#166534] px-5 py-1.5 rounded-lg text-[9px] font-black shadow-sm">Confirmed</span>
                <Image src={kojoImg} alt="Kojo" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" width={64} height={64} />
              </div>
              <h4 className="text-base font-black text-[#0f172a] mb-6">Kojo B. (CS &apos;26)</h4>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-base">📅</span>
                  <p className="text-[11px] font-bold text-gray-400">Oct 24, 2024</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base">🕒</span>
                  <p className="text-[11px] font-bold text-gray-400">10:30-11:30 AM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base">📹</span>
                  <p className="text-[11px] font-bold text-gray-400">Type: Zoom</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-[#5a1620] text-white py-4 rounded-[20px] font-black text-xs shadow-xl active:scale-95 transition-all">Join Zoom Meeting</button>
                <button className="w-full border-2 border-[#7b2228] text-[#7b2228] py-4 rounded-[20px] font-black text-xs hover:bg-[#7b2228] hover:text-white transition-all">Send Message</button>
              </div>
            </div>
          </div>

          {/* Past Widget */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-300 pl-4 border-l-4 border-gray-100 italic">Past</h3>
            <div className="bg-gray-50/50 rounded-[48px] p-8 border border-gray-100 shadow-sm relative overflow-hidden opacity-80">
              <div className="flex items-start justify-between mb-6">
                <span className="bg-gray-100 text-gray-400 px-5 py-1.5 rounded-lg text-[9px] font-black shadow-sm">Completed</span>
                <Image src={akosuaImg} alt="Akosua" className="w-16 h-16 rounded-2xl object-cover grayscale opacity-50" width={64} height={64} />
              </div>
              <h4 className="text-base font-black text-[#0f172a] mb-6">Akosua A. (BA &apos;27)</h4>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-base">📅</span>
                  <p className="text-[11px] font-bold text-gray-400">Oct 20, 2024</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base">🕒</span>
                  <p className="text-[11px] font-bold text-gray-400">02:00-03:00 PM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base">📹</span>
                  <p className="text-[11px] font-bold text-gray-400">Type: Zoom</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#fff5f5] text-[#7b2228] py-4 rounded-[20px] font-black text-[10px]">View Notes</button>
                <button className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-[20px] font-black text-[10px]">Rate Meeting</button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
