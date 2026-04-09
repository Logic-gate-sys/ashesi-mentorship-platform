import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import amaImg from '../assets/Ama M.jpeg'
import mentor1Img from '../assets/Daniel K.jpeg'
import mentor2Img from '../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: true, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

export default function Meetings() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#7b2228] text-white flex flex-col p-8 relative z-10 shrink-0">
        <div className="flex flex-col items-center mb-10 pt-6">
          <img src={logoImg} alt="Ashesi Logo" className="w-16 h-16 mb-3 object-contain" />
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
            <span className="text-xl group-hover:translate-x-1 transition-transform">➡️</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
          <header className="mb-10">
            <h1 className="text-4xl font-black text-[#7b2228] leading-tight mb-2">Upcoming, Past Meetings & Booking</h1>
            <p className="text-base font-bold text-gray-500">Book new time slots from your available mentors or view your scheduled meetings.</p>
          </header>

          {/* Top Tabs */}
          <div className="flex gap-6 mb-12">
              <button className="bg-[#5a1620] text-white px-10 py-4 rounded-full font-black text-sm shadow-xl hover:scale-[1.02] transition-all">
                  Book New Meeting
              </button>
              <button className="border-2 border-[#f0f0f0] text-gray-500 px-10 py-4 rounded-full font-black text-sm hover:border-[#7b2228]/30 transition-all">
                  My Scheduled Meetings
              </button>
              <button className="border-2 border-[#f0f0f0] text-gray-500 px-10 py-4 rounded-full font-black text-sm hover:border-[#7b2228]/30 transition-all">
                  My Meetings History
              </button>
          </div>

          <div className="flex gap-10 flex-1 min-h-0">
              
              {/* Left & Middle Column */}
              <div className="flex-1 flex gap-10">
                  
                  {/* Calendar Mockup */}
                  <div className="w-[340px] bg-[#fff5f5] rounded-[40px] p-8 shadow-sm h-fit">
                      <div className="flex justify-between items-center mb-8">
                          <h3 className="text-xl font-black text-[#5a1620]">October 2023</h3>
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
                          {[24, 25, 26, 27, 28, 29, 30].map(d => <span key={d} className="text-xs font-bold text-gray-300">{d}</span>)}
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(d => {
                              const isAvailable = [3, 6, 10, 12, 19, 25, 28].includes(d);
                              const isSelected = d === 26;
                              const hasIndicator = [2, 24, 30].includes(d);
                              
                              return (
                                  <div key={d} className="flex flex-col items-center justify-center relative h-8">
                                      <span className={`text-xs font-black z-10 ${isSelected ? 'text-white' : 'text-[#2b2b2b]'} ${!isAvailable && !isSelected ? 'opacity-40' : ''}`}>
                                          {d}
                                      </span>
                                      {isSelected && <div className="absolute inset-0 bg-[#5a1620] rounded-full scale-125"></div>}
                                      {isAvailable && !isSelected && <div className="absolute inset-x-2 inset-y-0.5 bg-[#dcfce7] rounded-md -z-0"></div>}
                                      {hasIndicator && <div className="absolute -bottom-1 w-1 h-1 bg-red-500 rounded-full"></div>}
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Booking Slots */}
                  <div className="flex-1 space-y-6">
                      <h3 className="text-2xl font-black text-[#5a1620] mb-8">Confirm Booking: October 26th</h3>
                      
                      <div className="bg-white border-2 border-[#f8f8f8] rounded-[32px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-6 text-[#2b2b2b]">
                              <div className="w-14 h-14 bg-[#fff5f5] rounded-2xl flex items-center justify-center text-2xl">📍</div>
                              <div>
                                  <h4 className="text-lg font-black mb-1">In-person (Ashesi Campus, Faculty Block RM 201)</h4>
                                  <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                                      <span>🕒 02:00 PM - 03:00 PM</span>
                                      <button className="underline hover:text-[#7b2228]">View Mentor Profile</button>
                                  </div>
                              </div>
                          </div>
                          <button className="bg-[#5a1620] text-white px-8 py-4 rounded-full font-black text-xs shrink-0 shadow-lg">Book This Slot</button>
                      </div>

                      <div className="bg-white border-2 border-[#f8f8f8] rounded-[32px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-6 text-[#2b2b2b]">
                              <div className="w-14 h-14 bg-[#fff5f5] rounded-2xl flex items-center justify-center text-2xl">📹</div>
                              <div>
                                  <h4 className="text-lg font-black mb-1">Zoom (Online)</h4>
                                  <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                                      <span>🕒 10:00 AM - 11:00 AM</span>
                                      <button className="underline hover:text-[#7b2228]">View Mentor Profile</button>
                                  </div>
                              </div>
                          </div>
                          <button className="bg-[#5a1620] text-white px-8 py-4 rounded-full font-black text-xs shrink-0 shadow-lg">Book This Slot</button>
                      </div>
                      
                      {/* Pagination for Slots */}
                      <div className="flex justify-end items-center gap-4 mt-12 py-4">
                          <span className="text-xs font-bold text-gray-300">Previous</span>
                          <button className="w-10 h-10 bg-[#5a1620] text-white rounded-full font-black text-sm shadow-lg">1</button>
                          <button className="w-10 h-10 hover:bg-gray-50 rounded-full font-black text-sm text-gray-400">2</button>
                          <span className="text-gray-300">❯</span>
                      </div>
                  </div>

              </div>

              {/* Right Sidebar Widgets */}
              <div className="w-[320px] space-y-8 pb-10">
                  
                  {/* Upcoming Sessions Widget */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-black text-[#5a1620]">Upcoming Sessions</h3>
                      <div className="bg-white border border-[#f0f0f0] rounded-[32px] p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                             <div className="relative">
                                <img src={amaImg} className="w-12 h-12 rounded-xl object-cover" alt="Ama K." />
                             </div>
                             <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">BOOKED</span>
                          </div>
                          <h4 className="text-base font-black text-[#2b2b2b]">Ama K.</h4>
                          <p className="text-[10px] font-bold text-gray-400 mb-4">Software Engineer @ Google</p>
                          
                          <div className="bg-[#fff5f5] rounded-2xl p-4 mb-6">
                              <div className="flex items-center gap-3">
                                  <span className="text-base">📅</span>
                                  <div className="text-[10px]">
                                      <p className="font-black text-gray-400 uppercase tracking-widest text-[8px]">TIME & DATE</p>
                                      <p className="font-black text-[#5a1620]">Monday, April 15 • 2:00 PM - 2:30</p>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex gap-2 mb-4">
                              <button className="flex-1 py-3 border-2 border-[#f8f8f8] rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-50 uppercase">Reschedule</button>
                              <button className="flex-1 py-3 border-2 border-[#f8f8f8] rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-50 uppercase">Cancel</button>
                          </div>
                          
                          <button className="w-full bg-[#5a1620] text-white py-4 rounded-[20px] font-black text-xs shadow-xl active:scale-95 transition-all">
                              Join Meeting
                          </button>
                      </div>
                  </div>

                  {/* Past Meetings Widget */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-black text-[#5a1620]">Past Meetings</h3>
                      <div className="space-y-4">
                          {[
                              { name: 'Ama K.', date: 'Oct 15, 2023', img: mentor1Img },
                              { name: 'Ama K.', date: 'Oct 15, 2023', img: mentor2Img }
                          ].map((m, i) => (
                              <div key={i} className="bg-white border border-[#f0f0f0] rounded-[32px] p-5 shadow-sm relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7b2228]"></div>
                                  <div className="flex items-start justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                          <img src={m.img} className="w-10 h-10 rounded-xl object-cover" alt={m.name} />
                                          <div>
                                              <h4 className="text-xs font-black text-[#2b2b2b]">Mentor {m.name}</h4>
                                              <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-[8px] font-black text-[#166534]">COMPLETED</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-[10px] font-black text-[#2b2b2b]">{m.date}</p>
                                          <p className="text-[8px] font-bold text-gray-400 uppercase">02:30 PM In-Person</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-3">
                                      <button className="flex-1 py-2.5 bg-[#f5e1e2] rounded-xl text-[9px] font-black text-[#7b2228] uppercase">View Notes</button>
                                      <button className="flex-1 py-2.5 bg-[#5a1620] text-white rounded-xl text-[9px] font-black uppercase">Rate Meeting</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

              </div>

          </div>

        </main>
      </div>
  )
}
