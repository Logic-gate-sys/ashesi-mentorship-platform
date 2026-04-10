import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: true, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

const reports = [
    { id: '#RPT-8291', reporter: 'Samuel Ansah', entity: 'Dr. Sarah Mensah', type: 'Mentor', issue: 'Inappropriate Conduct', date: 'Oct 24, 2023', status: 'ACTIVE' },
    { id: '#RPT-8288', reporter: 'Akua Owusu', entity: 'John Doe', type: 'Mentee', issue: 'Spamming / Harassment', date: 'Oct 22, 2023', status: 'INVESTIGATION' },
    { id: '#RPT-8284', reporter: 'Prof. James Tetteh', entity: 'Grace Lamptey', type: 'Mentee', issue: 'Plagiarism / Content Violation', date: 'Oct 19, 2023', status: 'CLOSED' },
]

export default function AdminIssues() {
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
              <h1 className="text-4xl font-black text-[#5a1620] italic">Reported Issues Management</h1>
          </header>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-8 mb-14">
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">TOTAL FLAGS</p>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">42</h3>
                      <p className="text-[10px] font-bold text-red-500 italic">~ 12% increase this week</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-inner text-red-500">⚠️</div>
              </div>
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ACTIVE INVESTIGATIONS</p>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">18</h3>
                      <p className="text-[10px] font-bold text-gray-300">In progress by compliance team</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-inner text-[#7b2228]">🤝</div>
              </div>
              <div className="bg-[#fff5f5] rounded-[48px] p-10 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">CLOSED ISSUES</p>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-1">24</h3>
                      <p className="text-[10px] font-bold text-green-500 italic">✓ Resolved last 30 days</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-inner text-green-500">📈</div>
              </div>
          </div>

          {/* Issue Table Section */}
          <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-[#5a1620] italic">Reported Connections & Flagged Activity</h2>
                  <div className="flex gap-4">
                      <div className="relative w-80">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                          <input type="text" placeholder="Search issues..." className="w-full bg-[#fffcfc] rounded-full py-3.5 pl-14 pr-6 text-xs font-bold focus:outline-none border border-gray-50 focus:border-[#7b2228]" />
                      </div>
                      <button className="bg-[#fffcfc] border border-gray-100 px-8 py-3 rounded-full font-black text-xs text-gray-400 shadow-sm flex items-center gap-4 hover:border-[#7b2228] hover:text-[#7b2228]">
                          <span>🔻</span> Filter
                      </button>
                  </div>
              </div>

              <div className="bg-[#fffcfc] rounded-[48px] border border-gray-50 shadow-sm overflow-hidden mb-8">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#fffafa]">
                              <th className="px-10 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">ISSUE ID</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">REPORTER NAME</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">FLAGGED ENTITY</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">ISSUE TYPE</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">DATE REPORTED</th>
                              <th className="px-6 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em]">STATUS</th>
                              <th className="px-10 py-7 text-[9px] font-black text-[#5a1620] uppercase tracking-[0.2em] text-center">ACTIONS</th>
                          </tr>
                      </thead>
                      <tbody>
                          {reports.map((rpt, i) => (
                              <tr key={i} className="bg-white border-b border-gray-50 hover:bg-red-50/10 transition-colors group">
                                  <td className="px-10 py-8 font-black text-red-500 text-[13px]">{rpt.id}</td>
                                  <td className="px-6 py-8">
                                      <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                          <span className="text-xs font-black text-[#0f172a]">{rpt.reporter}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-8">
                                      <div className="flex items-center gap-3 mb-1">
                                          <span className="text-[13px] font-black text-gray-600">{rpt.entity}</span>
                                          <span className="bg-gray-50 text-[8px] font-black text-gray-300 px-3 py-1 rounded-md uppercase tracking-tighter">{rpt.type}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-8">
                                      <span className="bg-[#f3f4f6]/50 px-4 py-1.5 rounded-full text-[9px] font-black text-gray-400 border border-gray-100">
                                          {rpt.issue}
                                      </span>
                                  </td>
                                  <td className="px-6 py-8 text-xs font-bold text-gray-400">{rpt.date}</td>
                                  <td className="px-6 py-8">
                                      <div className="flex items-center gap-2">
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                              rpt.status === 'ACTIVE' ? 'bg-red-500' : 
                                              rpt.status === 'INVESTIGATION' ? 'bg-orange-400' : 
                                              'bg-green-500'
                                          }`}></span>
                                          <span className={`text-[9px] font-black tracking-widest ${
                                              rpt.status === 'ACTIVE' ? 'text-red-500' : 
                                              rpt.status === 'INVESTIGATION' ? 'text-orange-400' : 
                                              'text-green-500'
                                          }`}>
                                              {rpt.status}
                                          </span>
                                      </div>
                                  </td>
                                  <td className="px-10 py-8">
                                      <div className="flex items-center justify-center gap-6 text-[18px] text-gray-300">
                                          <button className="hover:text-[#7b2228] transition-colors">👁️</button>
                                          <button className="hover:text-[#7b2228] transition-colors">💬</button>
                                          <button className="hover:text-[#7b2228] transition-colors">📥</button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              <div className="flex items-center justify-between px-10">
                  <p className="text-[11px] font-bold text-gray-300 italic">Showing 1-10 of 42 reports</p>
                  <div className="flex items-center gap-2">
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">❮</button>
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6d131b] text-white font-black text-xs shadow-lg">1</button>
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">2</button>
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">3</button>
                       <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">❯</button>
                  </div>
              </div>
          </div>

          {/* Bottom Widgets Row */}
          <div className="grid grid-cols-5 gap-10 mt-12 mb-4">
              <div className="col-span-3 bg-[#6d131b] rounded-[48px] p-10 relative overflow-hidden group shadow-xl">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 translate-y-10"></div>
                  <h3 className="text-2xl font-black text-white mb-6 italic">Compliance Policy Update</h3>
                  <p className="text-sm font-bold text-[#f5e1e2] mb-12 max-w-2xl leading-relaxed">
                      The new academic integrity framework has been implemented. Please ensure all active investigations regarding plagiarism are cross-referenced with the updated Chapter 4 protocols.
                  </p>
                  <button className="text-[11px] font-black text-[#f5e1e2] uppercase tracking-[0.2em] flex items-center gap-4 hover:gap-8 transition-all">
                      VIEW DOCUMENTATION <span>↗</span>
                  </button>
              </div>

              <div className="col-span-2 bg-[#fff5f5] rounded-[48px] p-10 border border-red-100/50 shadow-sm relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-black text-[#5a1620] flex items-center gap-3 italic">High Priority Flag</h3>
                      <span className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-[9px] font-black shadow-lg uppercase tracking-tighter">CRITICAL</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mb-12 leading-relaxed italic">
                      "Frequent connection terminations detected in the Engineering department."
                  </p>
                  <div className="flex gap-4">
                      <button className="flex-1 bg-[#5a1620] text-white py-4 rounded-2xl font-black text-[10px] shadow-lg active:scale-95 transition-all">INVESTIGATE LINK</button>
                      <button className="flex-1 border-2 border-red-100/30 text-[#5a1620] py-4 rounded-2xl font-black text-[10px] hover:bg-white transition-all">DISMISS NOTICE</button>
                  </div>
              </div>
          </div>

        </main>
      </div>
  )
}
