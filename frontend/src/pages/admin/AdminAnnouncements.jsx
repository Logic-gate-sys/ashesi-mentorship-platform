import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: true, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

const announcements = [
    { title: 'Quarterly Review Reminder', target: 'Mentors Only', author: 'Sarah Mensah', date: 'Oct 12, 2023', priority: 'Normal', engagement: '92%' },
    { title: 'Tech Sector Prep Workshop Info', target: 'Mentees Only', author: 'Dr. Ama Koomson', date: 'Oct 11, 2023', priority: 'Important', engagement: '85%' },
    { title: 'Call for Alumni Mentors - BA Dept', target: 'Alumni Only', author: 'Sarah Mensah', date: 'Oct 08, 2023', priority: 'Normal', engagement: '78%' },
    { title: 'Urgent: Server Maintenance Notice', target: 'All Users', author: 'Sarah Mensah', date: 'Oct 08, 2023', priority: 'Normal', engagement: '78%' },
    { title: 'Urgent: Server Maintenance Notice', target: 'All Users', author: 'System Admin', date: 'Oct 14, 2023', priority: 'Urgent', engagement: '98%' },
]

export default function AdminAnnouncements() {
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
              <h1 className="text-4xl font-black text-[#5a1620] mb-2 italic">Mentorship Announcements & System Notifications</h1>
              <p className="text-base font-bold text-gray-300">Announcement Summary</p>
          </header>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-8 mb-14">
              <div className="bg-white border border-[#f8f8f8] rounded-[24px] p-10 flex items-center justify-between shadow-sm">
                  <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">TOTAL SENT</p>
                      <h3 className="text-5xl font-black text-[#6d131b]">55</h3>
                  </div>
                  <div className="text-3xl text-[#6d131b] opacity-80">✈️</div>
              </div>
              <div className="bg-white border border-[#f8f8f8] rounded-[24px] p-10 flex items-center justify-between shadow-sm">
                  <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">ACTIVE (CURRENT)</p>
                      <h3 className="text-5xl font-black text-[#166534]">18</h3>
                  </div>
                  <div className="text-3xl text-[#166534] opacity-80">📢</div>
              </div>
              <div className="bg-white border border-[#f8f8f8] rounded-[24px] p-10 flex items-center justify-between shadow-sm">
                  <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">DRAFTS</p>
                      <h3 className="text-5xl font-black text-[gray-400]">6</h3>
                  </div>
                  <div className="text-3xl text-gray-300 opacity-60">✉️</div>
              </div>
          </div>

          {/* Table Header Section */}
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#0f172a]">Live Announcements List</h2>
              <div className="relative w-80">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                  <input type="text" placeholder="Search table..." className="w-full bg-[#fcfcfc] border border-gray-100 rounded-full py-3.5 pl-14 pr-6 text-xs font-bold focus:outline-none" />
              </div>
          </div>

          {/* Announcements Table */}
          <div className="flex-1">
              <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm min-w-[1000px]">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#fffcfc]">
                              <th className="px-10 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">TITLE</th>
                              <th className="px-6 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">TARGET AUDIENCE</th>
                              <th className="px-6 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">CREATED BY</th>
                              <th className="px-6 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">DATE SENT</th>
                              <th className="px-6 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">PRIORITY</th>
                              <th className="px-6 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">ENGAGEMENT</th>
                              <th className="px-10 py-7 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">ACTIONS</th>
                          </tr>
                      </thead>
                      <tbody>
                          {announcements.map((ann, i) => (
                              <tr key={i} className="bg-white border-b border-gray-50 hover:bg-[#fffafa] transition-colors group">
                                  <td className="px-10 py-8 font-bold text-[#0f172a] text-sm leading-snug max-w-[200px]">{ann.title}</td>
                                  <td className="px-6 py-8">
                                      <span className="bg-[#fff1f2] text-[#e11d48] px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest leading-none block w-max uppercase italic text-center">
                                          {ann.target.split(' ')[0]}<br/>{ann.target.split(' ')[1] || ''}
                                      </span>
                                  </td>
                                  <td className="px-6 py-8 text-xs font-black text-[#5a1620]">{ann.author}</td>
                                  <td className="px-6 py-8 text-[11px] font-bold text-gray-400">{ann.date}</td>
                                  <td className="px-6 py-8">
                                      <div className="flex items-center gap-2">
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                              ann.priority === 'Normal' ? 'bg-green-500' : 
                                              ann.priority === 'Important' ? 'bg-orange-500' : 
                                              'bg-red-500'
                                          }`}></span>
                                          <span className={`text-[10px] font-black ${
                                              ann.priority === 'Normal' ? 'text-green-600' : 
                                              ann.priority === 'Important' ? 'text-orange-500' : 
                                              'text-red-500'
                                          }`}>{ann.priority}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-8 font-black text-[#0f172a] text-xs">{ann.engagement}</td>
                                  <td className="px-10 py-8">
                                      <div className="flex items-center justify-center gap-6 text-[18px] text-gray-300 transform group-hover:scale-110 transition-transform">
                                          <button className="hover:text-[#6d131b]">👁️</button>
                                          <button className="hover:text-[#6d131b]">✎</button>
                                          <button className="hover:text-red-500">🗑️</button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Footer Navigation */}
          <footer className="mt-10 flex items-center justify-between">
               <button className="bg-[#6d131b] text-white px-10 py-4 rounded-full font-black text-xs shadow-xl flex items-center gap-4 hover:scale-105 transition-all">
                   <span className="text-xl">⊕</span> + CREATE NEW ANNOUNCEMENT
               </button>
               <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">❮</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6d131b] text-white font-black text-xs shadow-lg">1</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">2</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">3</button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300">❯</button>
               </div>
          </footer>

        </main>
      </div>
  )
}
