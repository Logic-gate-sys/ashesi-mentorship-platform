import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'
import kojoImg from '../../assets/Daniel K.jpeg'
import akosuaImg from '../../assets/Soukouratou.jpeg'
import kwabenaImg from '../../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: true, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

export default function AdminDashboard() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar - Consistent with Admin Design */}
      <aside className="w-[280px] bg-[#7b2228] text-white flex flex-col p-8 relative z-10 shrink-0">
        <div className="flex flex-col items-center mb-10 pt-6">
          <img src={logoImg} alt="Ashesi Logo" className="w-16 h-16 mb-4 object-contain" />
          <div className="relative mb-6">
              <img src={adminImg} alt="Sarah Mensah" className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#7b2228] rounded-full"></div>
          </div>
          <h2 className="text-sm font-black text-center mb-1">Sarah Mensah</h2>
          <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest text-center">CAREER SERVICES LEAD, ADMIN</p>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-[16px] transition-all duration-300 ${item.active
                  ? 'bg-white text-[#7b2228] shadow-lg scale-[1.02] z-30 font-black'
                  : 'hover:bg-white/10 opacity-70 hover:opacity-100 font-bold'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
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
              <div>
                <h1 className="text-4xl font-black text-[#5a1620] leading-tight mb-2 italic">Dashboard Oversight: Sarah Mensah (Admin)</h1>
                <p className="text-base font-bold text-gray-400">Monitor and manage the Ashesi mentorship ecosystem.</p>
              </div>
              <button className="text-2xl text-[#7b2228] bg-[#fff5f5] w-12 h-12 rounded-xl flex items-center justify-center relative shadow-sm border border-red-50">
                  🔔
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
          </header>

          {/* Filter Bar */}
          <div className="flex gap-6 mb-12">
              <div className="flex-1 relative">
                  <select className="w-full bg-[#fff5f5] rounded-2xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer border border-transparent hover:border-red-100 transition-all">
                      <option>User Type</option>
                  </select>
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
              </div>
              <div className="flex-1 relative">
                  <select className="w-full bg-[#fff5f5] rounded-2xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer border border-transparent hover:border-red-100 transition-all">
                      <option>Report Type</option>
                  </select>
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
              </div>
              <div className="flex-1 relative">
                  <select className="w-full bg-[#fff5f5] rounded-2xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer border border-transparent hover:border-red-100 transition-all">
                      <option>Verification Status</option>
                  </select>
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
              </div>
          </div>

          <div className="flex gap-14 flex-1 min-h-0">
              
              {/* Left Column - Main Queue */}
              <div className="flex-1 space-y-12">
                  
                  {/* Verification Queue Section */}
                  <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-[#0f172a]">Verification Queue</h2>
                        <span className="bg-[#fff5f5] text-[#7b2228] px-5 py-2 rounded-xl text-[10px] font-black shadow-sm uppercase tracking-tighter border border-red-50">QUEUE: 12</span>
                      </div>
                      
                      <div className="bg-[#fffafa] border-2 border-[#fff5f5] rounded-[48px] p-10 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
                          <div className="flex items-center gap-8">
                              <img src={kojoImg} alt="Kojo" className="w-24 h-24 rounded-[32px] object-cover shadow-xl border-4 border-white" />
                              <div>
                                  <div className="flex items-center gap-3 mb-2">
                                     <h3 className="text-2xl font-black text-[#0f172a]">Kojo Annan</h3>
                                     <span className="bg-[#fef9c3] text-[#a16207] px-4 py-1.5 rounded-lg text-[9px] font-black shadow-sm uppercase tracking-tighter">PENDING VER.</span>
                                  </div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">CS '26 | FAANG Intern Prep</p>
                                  <div className="flex gap-4 mt-8">
                                      <button className="bg-[#7b2228] text-white px-10 py-3.5 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">Approve</button>
                                      <button className="border-2 border-gray-100 text-gray-400 px-10 py-3.5 rounded-2xl font-black text-xs hover:bg-white hover:text-[#7b2228] transition-all">View Profile</button>
                                  </div>
                              </div>
                          </div>
                          <button className="text-[10px] font-black text-[#7b2228] hover:underline uppercase tracking-widest leading-none mb-auto pt-2">Request Info</button>
                      </div>
                  </div>

                  {/* Reported Issues Section */}
                  <div>
                      <h2 className="text-2xl font-black text-[#0f172a] mb-8">Reported Issues</h2>
                      <div className="space-y-4">
                          {[
                              { name: 'Kwabena B.', info: 'FINANCE MENTOR', violation: 'INAPPROPRIATE BEHAVIOR', img: kwabenaImg, target: 'Mentor' },
                              { name: 'Akosua M.', info: "BA '27", violation: 'CONTENT VIOLATION', img: akosuaImg, target: 'Student' },
                              { name: 'Akosua M.', info: "BA '27", violation: 'CONTENT VIOLATION', img: akosuaImg, target: 'Student' },
                              { name: 'Kwabena B.', info: 'FINANCE MENTOR', violation: 'INAPPROPRIATE BEHAVIOR', img: kwabenaImg, target: 'Mentor' }
                          ].map((issue, i) => (
                              <div key={i} className="bg-white border border-gray-50 rounded-[32px] p-6 flex items-center justify-between shadow-sm hover:shadow-lg transition-all group">
                                  <div className="flex items-center gap-6">
                                      <img src={issue.img} alt={issue.name} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                                      <div>
                                          <h4 className="text-[13px] font-black text-[#0f172a] mb-0.5">{issue.name}</h4>
                                          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                              {issue.info} • <span className="text-red-500 font-black">{issue.violation}</span>
                                          </p>
                                      </div>
                                  </div>
                                  <div className="flex gap-4">
                                      <button className="bg-[#5a1620] text-white px-8 py-3 rounded-2xl font-black text-[10px] shadow-lg hover:scale-105 transition-all uppercase tracking-widest">Handle Issue</button>
                                      <button className="border-2 border-gray-50 text-gray-400 px-6 py-3 rounded-2xl font-black text-[10px] hover:border-[#7b2228]/30 transition-all uppercase tracking-widest">Message {issue.target}</button>
                                  </div>
                              </div>
                          ))}
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
                             <p className="text-[11px] font-black text-[#2b2b2b] leading-tight mb-2">Quarterly Review Meeting with Dean</p>
                             <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Reported • 3 months ago</p>
                          </div>
                          <div className="relative pl-6">
                             <div className="absolute left-0 top-1 w-2.5 h-2.5 bg-[#7b2228] rounded-full"></div>
                             <p className="text-[11px] font-black text-[#2b2b2b] leading-tight mb-2">The greenrise vernament meeting with Dean outlined</p>
                             <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Reported • 5 mins ago</p>
                          </div>
                      </div>
                  </div>

                  {/* Upcoming Widget */}
                  <div className="bg-[#fffafa] rounded-[48px] p-10 border border-[#f8f0f0] shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-base font-black text-[#5a1620] flex items-center gap-3">
                            <span>📅</span> Upcoming
                        </h3>
                        <button className="text-[8px] font-black text-gray-300 uppercase tracking-widest hover:underline">ADMIN CALENDAR</button>
                      </div>
                      <div className="space-y-6">
                          {[
                              { day: '22', month: 'JAN', title: 'Quarterly Review Mee...' },
                              { day: '24', month: 'JAN', title: 'Event Seasct Meeting ...' }
                          ].map((ev, i) => (
                              <div key={i} className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 group cursor-pointer hover:border-[#7b2228]/30 transition-all">
                                  <div className="bg-[#7b2228] rounded-xl px-3 py-2 text-center shrink-0 shadow-md">
                                      <p className="text-[7px] font-black text-[#f5e1e2] leading-none mb-1">{ev.month}</p>
                                      <p className="text-base font-black text-white leading-tight">{ev.day}</p>
                                  </div>
                                  <div>
                                      <h4 className="text-[11px] font-black text-[#2b2b2b]">{ev.title}</h4>
                                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">2 days ago</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Quick Tools Widget */}
                  <div className="bg-[#fffafa] rounded-[48px] p-10 border border-[#f8f0f0] shadow-sm space-y-8">
                      <h3 className="text-base font-black text-[#5a1620] flex items-center gap-3 mb-2">
                          <span>🛠</span> Quick Tools
                      </h3>
                      <button className="w-full bg-[#5a1620] text-white py-4 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          <span>⊕</span> Create Announcement
                      </button>
                      <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                         <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Enable New User Signups</h4>
                         <div className="w-14 h-7 bg-[#5a1620] rounded-full relative shadow-inner">
                            <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                         </div>
                      </div>
                  </div>

              </div>

          </div>

        </main>
      </div>
  )
}
