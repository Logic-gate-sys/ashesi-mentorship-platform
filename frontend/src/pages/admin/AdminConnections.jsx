import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: true, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

const connections = [
    { mentee: 'Kojo Annan', mentor: 'Dr. Ama Koomson', date: 'Oct 12, 2023', area: 'equitable tech', activity: 'Meeting (2h ago)', status: 'ACTIVE' },
    { mentee: 'Akosua Mensah', mentor: 'Kwabena B.', date: 'Sept 28, 2023', area: 'Impact Investment', activity: 'Message (1d ago)', status: 'ACTIVE' },
    { mentee: 'Akosua Mensah', mentor: 'Kwabena B.', date: 'Sept 28, 2023', area: 'Impact Investment', activity: 'Message (1d ago)', status: 'PENDING' },
    { mentee: 'Akosua Mensah', mentor: 'Ba 27', date: 'Oct 12, 2023', area: 'Impact Investment', activity: 'Message (1d ago)', status: 'PENDING' },
    { mentee: 'Akosua Mensah', mentor: 'Brang Menson', date: 'Oct 12, 2023', area: 'Impact Investment', activity: 'Message (1d ago)', status: 'CLOSED' },
    { mentee: 'Akosua Mensah', mentor: 'Kwabena B.', date: 'Oct 12, 2023', area: 'Impact Investment', activity: 'Message (1d ago)', status: 'CLOSED' },
]

export default function AdminConnections() {
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
          
          <header className="mb-10">
              <h1 className="text-4xl font-black text-[#6d131b] mb-2 italic">Connection Monitor: Overview</h1>
              <p className="text-base font-bold text-gray-300">Real-time monitoring and management of all mentorship connections.</p>
          </header>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-3 gap-8 mb-14">
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center gap-10 shadow-sm border border-red-50/50">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-inner text-[#7b2228]">👥</div>
                  <div>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">285</h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">TOTAL CONNECTIONS</p>
                  </div>
              </div>
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center gap-10 shadow-sm border border-red-50/50">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-inner text-[#7b2228]">🤝</div>
                  <div>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">241</h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ACTIVE CONNECTIONS</p>
                  </div>
              </div>
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center gap-10 shadow-sm border border-red-50/50">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-inner text-[#7b2228]">✔️</div>
                  <div>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">44</h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PENDING REQUESTS</p>
                  </div>
              </div>
          </div>

          {/* Live Connections Section */}
          <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-[#6d131b] italic">Live Connections List</h2>
                  <div className="relative w-80">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                      <input type="text" placeholder="Search connections..." className="w-full bg-[#fffcfc] rounded-full py-3.5 pl-14 pr-6 text-xs font-bold focus:outline-none border border-gray-50 focus:border-[#7b2228]" />
                  </div>
              </div>

              <div className="bg-[#fffcfc] rounded-[48px] border border-gray-50 shadow-sm overflow-hidden min-w-[1000px]">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#fffafa]">
                              <th className="px-10 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">MENTEE NAME</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">MENTOR NAME</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">CONNECTION DATE</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">FOCUS AREA</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">LAST ACTIVITY</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">STATUS</th>
                              <th className="px-10 py-7 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em] text-center">ACTIONS</th>
                          </tr>
                      </thead>
                      <tbody>
                          {connections.map((c, i) => (
                              <tr key={i} className="bg-white border-b border-gray-50 hover:bg-red-50/10 transition-colors group">
                                  <td className="px-10 py-6 font-black text-[#7b2228] text-sm italic">{c.mentee}</td>
                                  <td className="px-6 py-6 font-black text-[#0f172a] text-[13px]">{c.mentor}</td>
                                  <td className="px-6 py-6 text-xs font-bold text-gray-400">{c.date}</td>
                                  <td className="px-6 py-6 text-xs font-bold text-gray-500 italic">{c.area}</td>
                                  <td className="px-6 py-6 text-xs font-black text-gray-400 italic opacity-80">{c.activity}</td>
                                  <td className="px-6 py-6">
                                      <span className={`px-5 py-2 rounded-full text-[9px] font-black tracking-tighter shadow-sm flex items-center justify-center gap-2 w-28 ${
                                          c.status === 'ACTIVE' ? 'bg-[#16a34a] text-white' : 
                                          c.status === 'PENDING' ? 'bg-[#eab308] text-white font-bold' : 
                                          'bg-[#64748b] text-white opacity-60'
                                      }`}>
                                          <span className={`w-1.5 h-1.5 bg-white rounded-full ${c.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></span>
                                          {c.status}
                                      </span>
                                  </td>
                                  <td className="px-10 py-6">
                                      <div className="flex items-center justify-center gap-6 text-[18px] text-gray-300">
                                          <button className="hover:text-[#7b2228] transition-colors">👁️</button>
                                          <button className="hover:text-[#7b2228] transition-colors">💬</button>
                                          {c.status !== 'CLOSED' && (
                                              <button className="hover:text-red-500 transition-colors text-xl">⊗</button>
                                          )}
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

        </main>
      </div>
  )
}
