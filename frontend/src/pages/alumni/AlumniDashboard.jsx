import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import doctorImg from '../../assets/Ama M.jpeg'
import student1Img from '../../assets/Daniel K.jpeg'
import student2Img from '../../assets/Soukouratou.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: true, path: '/alumni-dashboard' },
  { label: 'Mentorship Requests', icon: '📋', active: false, path: '/alumni/requests' },
  { label: 'My Mentees', icon: '👥', active: false, path: '/alumni/mentees' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Profile Settings', icon: '⚙️', active: false, path: '/profile' },
  { label: 'Feedbacks', icon: '⭐', active: false, path: '/feedback' },
]

export default function AlumniDashboard() {
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
          
          {/* Top Header */}
          <header className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-2 italic">Welcome Back, Dr. Ama Koomson!</h1>
                <p className="text-base font-bold text-gray-500">Ready to guide the next generation of scholars?</p>
              </div>
              <div className="flex items-center gap-6">
                  <button className="text-2xl text-gray-400 hover:text-[#7b2228] relative">
                      🔔
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center gap-4 text-right">
                      <div>
                          <h4 className="text-sm font-black text-[#0f172a]">Dr. Ama Koomson</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Associate Professor</p>
                      </div>
                      <img src={doctorImg} alt="Doctor" className="w-12 h-12 rounded-xl object-cover border-2 border-[#fff5f5] shadow-sm" />
                  </div>
              </div>
          </header>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-[#fff5f5] rounded-[40px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                      <p className="text-[10px] font-black text-[#7b2228] uppercase tracking-[0.2em] mb-2 opacity-60">ACTIVE MENTEES</p>
                      <h3 className="text-5xl font-black text-[#0f172a]">3</h3>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">👥</div>
              </div>
              <div className="bg-[#fff5f5] rounded-[40px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all group border border-[#f5e1e2]">
                  <div>
                      <p className="text-[10px] font-black text-[#7b2228] uppercase tracking-[0.2em] mb-2 opacity-60">PENDING REQUESTS</p>
                      <h3 className="text-5xl font-black text-[#0f172a]">2</h3>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">🤝</div>
              </div>
              <div className="bg-[#fff5f5] rounded-[40px] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                      <p className="text-[10px] font-black text-[#7b2228] uppercase tracking-[0.2em] mb-2 opacity-60">HOURS MENTORED</p>
                      <h3 className="text-5xl font-black text-[#0f172a]">45</h3>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">🕒</div>
              </div>
          </div>

          <div className="flex gap-10 flex-1 min-h-0">
              
              {/* Left Column - Tasks/Requests */}
              <div className="flex-1 space-y-10">
                  
                  {/* Mentorship Requests Section */}
                  <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-[#0f172a]">Mentorship Requests</h2>
                        <button className="text-xs font-black text-[#7b2228] hover:underline uppercase tracking-widest">View All Requests</button>
                      </div>
                      
                      <div className="space-y-4">
                          {[
                              { name: 'Student Kojo Annan', year: "CS '26", quote: '"I am deeply inspired by your research on equitable tech..', img: student1Img },
                              { name: 'Student Akosua Mensah', year: "BA '27", quote: '"Pursuing a career in impact investment, I believe your...', img: student2Img }
                          ].map((req, i) => (
                              <div key={i} className="bg-[#fffafa] border border-[#f5e1e2] rounded-[32px] p-6 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300">
                                  <div className="flex items-center gap-6">
                                      <img src={req.img} alt={req.name} className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white" />
                                      <div>
                                          <h4 className="text-base font-black text-[#0f172a]">{req.name} <span className="text-[10px] text-gray-400 font-bold ml-2">({req.year})</span></h4>
                                          <p className="text-xs font-bold text-gray-400 italic mt-1">{req.quote}</p>
                                          <div className="flex gap-3 mt-4">
                                              <button className="bg-[#166534] text-white px-8 py-2.5 rounded-xl font-black text-[10px] shadow-lg hover:bg-[#14532d] transition-all">Accept</button>
                                              <button className="border-2 border-[#7b2228] text-[#7b2228] px-8 py-2.5 rounded-xl font-black text-[10px] hover:bg-[#7b2228] hover:text-white transition-all">Decline</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Active Mentees Section */}
                  <div>
                    <h2 className="text-2xl font-black text-[#0f172a] mb-6">Active Mentees</h2>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                        {[
                            { name: 'Akosua', role: 'FINANCE MENTOR', img: student2Img },
                            { name: 'Kwabena', role: 'TECH MENTOR', img: student1Img }
                        ].map((mentee, i) => (
                            <div key={i} className="min-w-[280px] bg-white border border-[#f0f0f0] rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7b2228]"></div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#7b2228]/5 rounded-full flex items-center justify-center text-lg">👤</div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#2b2b2b]">{mentee.name}</h4>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{mentee.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-[#5a1620] text-white py-3.5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs shadow-lg hover:bg-[#7b2228] transition-all">
                                    <span>▷</span> Message
                                </button>
                            </div>
                        ))}
                    </div>
                  </div>

              </div>

              {/* Right Sidebar Widgets */}
              <div className="w-[320px] space-y-8">
                  
                  {/* Updates Widget */}
                  <div className="bg-[#fffafa] rounded-[40px] p-8 border border-[#f8f0f0] shadow-sm">
                      <h3 className="text-base font-black text-[#5a1620] mb-6 flex items-center gap-3">
                          <span>📢</span> Updates
                      </h3>
                      <div className="space-y-6">
                          <div className="relative pl-6">
                              <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-[#7b2228] rounded-full"></div>
                              <p className="text-[11px] font-black text-[#2b2b2b]">Kojo Annan sent a request</p>
                              <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase">2 hours ago</p>
                          </div>
                          <div className="relative pl-6">
                              <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-[#7b2228] rounded-full"></div>
                              <p className="text-[11px] font-black text-[#2b2b2b]">New message from Akosua</p>
                              <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase">Yesterday</p>
                          </div>
                      </div>
                  </div>

                  {/* Upcoming Widget */}
                  <div className="bg-[#fffafa] rounded-[40px] p-8 border border-[#f8f0f0] shadow-sm">
                      <h3 className="text-base font-black text-[#5a1620] mb-6 flex items-center gap-3">
                          <span>📅</span> Upcoming
                      </h3>
                      <div className="space-y-4">
                          {[
                              { day: '22', month: 'JUN', title: 'Meeting with Akosua' },
                              { day: '25', month: 'JUN', title: 'Quarterly Review' }
                          ].map((ev, i) => (
                              <div key={i} className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 group cursor-pointer hover:border-[#7b2228]/50 transition-all">
                                  <div className="bg-[#fff5f5] rounded-xl px-3 py-2 text-center shrink-0 border border-[#f5e1e2]">
                                      <p className="text-[8px] font-black text-gray-400 leading-none">{ev.month}</p>
                                      <p className="text-base font-black text-[#5a1620] leading-tight">{ev.day}</p>
                                  </div>
                                  <div>
                                      <h4 className="text-[11px] font-black text-[#2b2b2b]">{ev.title}</h4>
                                      <button className="text-[8px] font-black text-[#7b2228] hover:underline uppercase tracking-widest mt-1">Link to Meeting</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Status Toggle Widget */}
                  <div className="bg-[#fffafa] rounded-[32px] p-6 border border-[#f8f0f0] shadow-sm flex items-center justify-between">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">STATUS</p>
                        <h4 className="text-xs font-black text-[#2b2b2b]">Open to Mentorship</h4>
                     </div>
                     <div className="w-14 h-7 bg-[#5a1620] rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>

              </div>

          </div>

        </main>
      </div>
  )
}
