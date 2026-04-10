import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import doctorImg from '../../assets/Ama M.jpeg'
import kojoImg from '../../assets/Daniel K.jpeg'
import akosuaImg from '../../assets/Soukouratou.jpeg'
import kwabenaImg from '../../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/alumni-dashboard' },
  { label: 'Mentorship Requests', icon: '📋', active: true, path: '/alumni/requests' },
  { label: 'My Mentees', icon: '👥', active: false, path: '/alumni/mentees' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Profile Settings', icon: '⚙️', active: false, path: '/profile' },
  { label: 'Feedbacks', icon: '⭐', active: false, path: '/feedback' },
]

export default function AlumniRequests() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar - Consistent with Design */}
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
            <span className="text-xl group-hover:translate-x-1 transition-transform">📤</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
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
                  <img src={doctorImg} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
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
                              <img src={kojoImg} alt="Kojo" className="w-24 h-24 rounded-[32px] object-cover shadow-xl border-4 border-white" />
                              <div>
                                  <h2 className="text-2xl font-black text-[#0f172a] mb-2">Student Kojo Annan (CS '26)</h2>
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
                          "Hello Professor, I've been following your research on neural networks for agricultural yields. I'm currently a junior and would love your guidance on my capstone project focusing on predictive modeling for local cocoa farmers..."
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
                              <img src={akosuaImg} alt="Akosua" className="w-12 h-12 rounded-xl object-cover shadow-md" />
                              <div>
                                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Akosua Mensah (BA '27)</h3>
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
                              <img src={kwabenaImg} alt="Kwabena" className="w-12 h-12 rounded-xl object-cover shadow-md" />
                              <div>
                                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Kwabena Boahen (EE '25)</h3>
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
                                  <h3 className="text-sm font-black text-[#2b2b2b]">Student Rangul J. (CS '26)</h3>
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

        </main>
      </div>
  )
}
