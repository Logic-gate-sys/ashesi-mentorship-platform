import { Link } from 'react-router-dom'
import Image from 'next/image'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import doctorImg from '../../assets/Ama M.jpeg'
import student1Img from '../../assets/Daniel K.jpeg'
import student2Img from '../../assets/Soukouratou.jpeg'
import student3Img from '../../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/alumni-dashboard' },
  { label: 'Mentorship Requests', icon: '📋', active: false, path: '/alumni/requests' },
  { label: 'My Mentees', icon: '👥', active: false, path: '/alumni/mentees' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/alumni/meetings' },
  { label: 'Profile Settings', icon: '⚙️', active: false, path: '/profile' },
  { label: 'Feedbacks', icon: '⭐', active: true, path: '/alumni/feedback' },
]

export default function AlumniFeedback() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar - Consistent with Design */}
      <aside className="w-[280px] bg-[#7b2228] text-white flex flex-col p-8 relative z-10 shrink-0">
        <div className="flex flex-col items-center mb-10 pt-6">
          <Image src={logoImg} alt="Ashesi Logo" className="w-16 h-16 mb-3 object-contain" width={64} height={64} />
          <h2 className="text-sm font-black tracking-[0.2em] text-center leading-tight uppercase">ASHESI<br />UNIVERSITY</h2>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-[16px] transition-all duration-300 ${item.active
                  ? 'bg-[#5a1620] shadow-lg scale-[1.02] z-30'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100 font-bold'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="tracking-wide text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-4">
          <Link to="/login" className="flex items-center gap-4 px-6 py-4 rounded-[16px] bg-white/10 hover:bg-white/20 transition-all font-black text-xs group">
            <span className="text-xl group-hover:translate-x-1 transition-transform">📤</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
          {/* Top Header */}
          <header className="flex items-center justify-between mb-8">
              <div className="relative w-96">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input type="text" placeholder="Search mentorship records..." className="w-full bg-[#fff5f5] rounded-full py-4 pl-14 pr-6 text-xs font-bold focus:outline-none" />
              </div>
              <div className="flex items-center gap-8">
                  <span className="text-xl text-red-500">🔔</span>
                  <div className="text-right">
                      <h4 className="text-[11px] font-black text-[#0f172a] leading-none mb-1">Dr. Elena K.</h4>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SENIOR MENTOR</p>
                  </div>
                  <img src={doctorImg} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              </div>
          </header>

          <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-black text-[#5a1620] italic mb-2">Mentee Feedback</h1>
                <p className="text-base font-bold text-gray-400">Refining academic growth through impactful peer guidance.</p>
              </div>
              <div className="flex gap-4">
                  <button className="bg-white border-2 border-[#fff5f5] text-[#5a1620] px-8 py-3 rounded-full font-black text-xs shadow-sm">Pending Feedback</button>
                  <button className="bg-gray-50/10 text-gray-400 px-8 py-3 rounded-full font-black text-xs">Feedback Given</button>
                  <button className="bg-[#5a1620] text-white px-10 py-3 rounded-full font-black text-xs shadow-xl ml-4">VIEW IMPACT REPORTS</button>
              </div>
          </div>

          {/* Impact Stats Cards Row */}
          <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="bg-white border-2 border-[#fff5f5] rounded-[32px] p-8 shadow-sm">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">TOTAL MENTEES</p>
                  <div className="flex items-baseline gap-4">
                      <h3 className="text-4xl font-black text-[#0f172a]">42</h3>
                      <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-1 rounded-md">+12%</span>
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[32px] p-8 shadow-sm">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">TOTAL HOURS</p>
                  <div className="flex items-baseline gap-4">
                      <h3 className="text-4xl font-black text-[#0f172a]">320</h3>
                      <span className="text-gray-400 text-xs font-bold uppercase">Sessions</span>
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[32px] p-8 shadow-sm">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">AVERAGE RATING</p>
                  <div className="flex items-baseline gap-4">
                      <h3 className="text-4xl font-black text-[#0f172a]">4.9</h3>
                      <span className="bg-[#fda4af]/30 text-[#e11d48] text-[9px] font-black px-3 py-1 rounded-md">TOP 1%</span>
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[32px] p-8 shadow-sm">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">OUTCOMES</p>
                  <div className="flex items-baseline gap-4">
                      <h3 className="text-4xl font-black text-[#0f172a]">38</h3>
                      <span className="text-gray-400 text-xs font-bold uppercase">Grants</span>
                  </div>
              </div>
          </div>

          {/* Analytics Row */}
          <div className="grid grid-cols-2 gap-10 mb-12">
              <div className="bg-[#fff5f5] rounded-[48px] p-10 shadow-sm border border-red-50/50">
                  <h3 className="text-xl font-black text-[#5a1620] mb-8 italic">Skills Transferred</h3>
                  <div className="space-y-8">
                      {[
                          { label: 'Python & Data Science', value: 88 },
                          { label: 'Research Methodology', value: 94 },
                          { label: 'Leadership & Mentoring', value: 72 },
                          { label: 'Academic Writing', value: 65 }
                      ].map(skill => (
                          <div key={skill.label}>
                              <div className="flex justify-between items-baseline mb-3 font-black">
                                  <p className="text-xs text-[#2b2b2b]">{skill.label}</p>
                                  <p className="text-xs text-[#5a1620]">{skill.value}%</p>
                              </div>
                              <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner">
                                  <div className="h-full bg-[#5a1620] rounded-full" style={{ width: `${skill.value}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 shadow-sm">
                  <div className="flex justify-between items-baseline mb-10">
                      <h3 className="text-xl font-black text-[#5a1620] italic">Impact Progression</h3>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">SESSION ENGAGEMENT (MONTHLY)</p>
                  </div>
                  <div className="h-48 flex items-end justify-between gap-3 px-4">
                      {[30, 45, 60, 80, 50, 90, 100, 110, 120, 95, 130].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                              <div 
                                  className={`w-full rounded-xl transition-all duration-500 shadow-sm ${i === 6 ? 'bg-[#5a1620] scale-110 shadow-xl' : 'bg-[#7b2228]/40 hover:bg-[#7b2228]/60'}`} 
                                  style={{ height: `${h}%` }}
                              ></div>
                              <span className={`text-[8px] font-black uppercase ${i === 6 ? 'text-[#5a1620]' : 'text-gray-300'}`}>
                                  {['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'][i]}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Voices from Mentees Section */}
          <div className="mb-10">
              <h2 className="text-3xl font-black text-[#5a1620] mb-8 italic">Voices from Mentees</h2>
              <div className="grid grid-cols-3 gap-8">
                  {[
                      { 
                        name: 'Marcus Thorne', 
                        role: 'PHD CANDIDATE, CS', 
                        quote: "Elena's guidance on my doctoral thesis was transformative. She didn't just teach me Python; she taught me how to think like a scientist and tackle...",
                        img: student1Img
                      },
                      { 
                        name: 'Sarah Jenkins', 
                        role: 'RESEARCH ASSOCIATE', 
                        quote: "I went from struggling with methodology to winning a department research grant. The structured feedback sessions were exactly what I...",
                        img: student2Img
                      },
                      { 
                        name: 'David Okafor', 
                        role: 'JUNIOR FACULTY', 
                        quote: "The clarity she brings to complex academic writing is unmatched. My publication rate has doubled since we started our monthly reviews and dee...",
                        img: student3Img
                      }
                  ].map((voice, i) => (
                      <div key={i} className="bg-white border border-[#f0f0f0] rounded-[48px] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                          <div className="text-[#f5e1e2] text-8xl font-serif absolute right-8 top-6 opacity-30 group-hover:opacity-60 transition-opacity italic">{"\""}</div>
                          <div className="flex gap-1 text-[#7b2228] mb-6">
                              {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                          </div>
                          <p className="text-xs font-bold text-gray-500 leading-[1.8] italic mb-10 relative z-10 line-clamp-4">
                              "{voice.quote}"
                          </p>
                          <div className="flex items-center gap-5 mt-auto border-t border-gray-50 pt-8">
                              <Image src={voice.img} alt={voice.name} className="w-12 h-12 rounded-2xl object-cover shadow-md" width={48} height={48} />
                              <div className="min-w-0">
                                  <h4 className="text-sm font-black text-[#0f172a] truncate">{voice.name}</h4>
                                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest truncate">{voice.role}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

        </main>
      </div>
  )
}
