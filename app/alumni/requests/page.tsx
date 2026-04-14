'use client'

import Image from 'next/image'
import doctorImg from '@/public/assets/Ama M.jpeg'
import kojoImg from '@/public/assets/Daniel K.jpeg'
import akosuaImg from '@/public/assets/Soukouratou.jpeg'
import kwabenaImg from '@/public/assets/Prince A.jpeg'

export default function AlumniRequests() {
  return (
    <div className="w-full bg-white p-12 overflow-y-auto">
      
      {/* Top Search & Profile Bar */}
      <header className="flex items-center justify-between mb-10">
        <div className="relative w-[400px]">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search requests..." 
            className="w-full bg-[#fff5f5] rounded-full py-4 pl-14 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7b2228]/10"
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-6 text-2xl text-gray-400">
            <button className="relative">
              🔔
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button>✉️</button>
          </div>
          <Image src={doctorImg} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" width={40} height={40} />
        </div>
      </header>

      <div className="flex gap-10">
        
        {/* Left Column - Detailed Requests */}
        <div className="flex-1 space-y-10">
          <header>
            <h1 className="text-4xl font-black text-[#7b2228] leading-tight mb-2 italic">Incoming Mentorship Requests</h1>
            <p className="text-base font-bold text-gray-500">Review and respond to students seeking guidance in your field.</p>
          </header>

          {/* Main Featured Request */}
          <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-8">
                <Image src={kojoImg} alt="Kojo" className="w-24 h-24 rounded-[32px] object-cover shadow-xl border-4 border-white" width={96} height={96} />
                <div>
                  <h2 className="text-2xl font-black text-[#0f172a] mb-2">Student Kojo Annan (CS &apos;26)</h2>
                  <div className="flex gap-2">
                    <span className="px-5 py-1.5 bg-[#f5e1e2] text-[#7b2228] text-[9px] font-black rounded-full uppercase tracking-tighter shadow-sm">PYTHON</span>
                    <span className="px-5 py-1.5 bg-[#f5e1e2] text-[#7b2228] text-[9px] font-black rounded-full uppercase tracking-tighter shadow-sm">MACHINE LEARNING</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-[#fef9c3] text-[#a16207] px-6 py-2 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-2 mb-2 uppercase">
                  <span className="w-2 h-2 bg-[#a16207] rounded-full"></span> PENDING
                </span>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">2 HOURS AGO</p>
              </div>
            </div>

            <p className="text-sm font-bold text-gray-600 leading-relaxed mb-10 italic">
              "Hello Professor, I&apos;ve been following your research on neural networks for agricultural yields. I&apos;m currently a junior and would love your guidance on my capstone project focusing on predictive modeling for local cocoa farmers..."
            </p>

            <div className="flex gap-4">
              <button className="bg-[#5a1620] text-white px-12 py-4 rounded-full font-black text-xs shadow-xl active:scale-95 transition-all">ACCEPT REQUEST</button>
              <button className="border-2 border-[#7b2228] text-[#7b2228] px-12 py-4 rounded-full font-black text-xs hover:bg-[#7b2228] hover:text-white transition-all">DECLINE</button>
            </div>
          </div>

          {/* Request List */}
          <div className="space-y-4">
            {/* Akosua Mensah */}
            <div className="bg-[#fffafa] rounded-[32px] p-6 flex items-center justify-between border border-[#f5e1e2] hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <Image src={akosuaImg} alt="Akosua" className="w-12 h-12 rounded-xl object-cover shadow-md" width={48} height={48} />
                <div>
                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Akosua Mensah (BA &apos;27)</h3>
                  <p className="text-[10px] font-bold text-gray-400">Marketing Strategy & Consumer Behavior</p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <span className="bg-[#fef9c3] text-[#a16207] px-5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-2 uppercase tracking-tighter shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#a16207] rounded-full"></span> PENDING
                </span>
                <span className="text-gray-300 font-bold">❯</span>
              </div>
            </div>

            {/* Kwabena Boahen */}
            <div className="bg-[#f0fdf4]/50 rounded-[32px] p-6 flex items-center justify-between border border-[#dcfce7] hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <Image src={kwabenaImg} alt="Kwabena" className="w-12 h-12 rounded-xl object-cover shadow-md" width={48} height={48} />
                <div>
                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Kwabena Boahen (EE &apos;25)</h3>
                  <p className="text-[10px] font-bold text-gray-400">Renewable Energy Systems</p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <span className="bg-[#dcfce7] text-[#166534] px-5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-2 uppercase tracking-tighter shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#166534] rounded-full"></span> CONNECTED
                </span>
                <span className="text-gray-300 font-bold">❯</span>
              </div>
            </div>

            {/* Rangul J. */}
            <div className="bg-red-50/30 rounded-[32px] p-6 flex items-center justify-between border border-red-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-400 flex items-center justify-center font-black text-sm shadow-md">RJ</div>
                <div>
                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Rangul J. (CS &apos;26)</h3>
                  <p className="text-[10px] font-bold text-red-300">Full Stack Development</p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <span className="bg-red-100/50 text-red-500 px-5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-2 uppercase tracking-tighter shadow-sm">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> DECLINED
                </span>
                <span className="text-gray-300 font-bold">❯</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-[340px] space-y-10">
          
          {/* Updates Widget */}
          <div className="bg-[#fffafa] rounded-[48px] p-10 border border-[#f8f0f0] shadow-sm">
            <h3 className="text-base font-black text-[#5a1620] mb-8 flex items-center gap-3">
              <span>🔔</span> Updates
            </h3>
            <div className="space-y-8">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-[#7b2228] rounded-full"></div>
                <p className="text-[11px] font-black text-[#2b2b2b] leading-tight mb-1">Weekly Report: 3 of your mentees published research drafts.</p>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">TODAY, 09:41 AM</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
                <p className="text-[11px] font-bold text-gray-400 leading-tight mb-1">Meeting Reminder: Kwaku Osei at 2:00 PM in Lab A.</p>
                <p className="text-[9px] font-bold text-gray-200 uppercase tracking-widest">YESTERDAY</p>
              </div>
            </div>
          </div>

          {/* Mentorship Goals Widget */}
          <div className="bg-[#7b2228] rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-base font-black mb-8 relative z-10">Mentorship Goals</h3>
            <div className="flex gap-4 relative z-10">
              <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/5">
                <p className="text-[9px] font-black text-[#f5e1e2] uppercase tracking-widest mb-1">ACTIVE MENTEES</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">12</span>
                  <span className="text-xs font-bold opacity-40">/15</span>
                </div>
              </div>
              <div className="flex-1 bg-white/10 rounded-3xl p-6 border border-white/5">
                <p className="text-[9px] font-black text-[#f5e1e2] uppercase tracking-widest mb-1">WEEKLY HOURS</p>
                <h4 className="text-3xl font-black">6.5</h4>
              </div>
            </div>
          </div>

          {/* Profile Status Widget */}
          <div className="bg-[#fffafa] rounded-[48px] p-10 border border-[#f8f0f0] shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl opacity-60">👤</span>
                <div>
                  <h4 className="text-xs font-black text-[#2b2b2b] uppercase tracking-widest leading-none mb-1">PROFILE STATUS</h4>
                  <p className="text-[10px] font-bold text-gray-400">Open to Mentorship</p>
                </div>
              </div>
              <div className="w-14 h-7 bg-[#5a1620] rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-100">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>🕒</span> AVAILABLE HOURS SUMMARY:
              </p>
              <p className="text-xs font-black text-[#7b2228] text-center">6:00pm - 7:00pm</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
