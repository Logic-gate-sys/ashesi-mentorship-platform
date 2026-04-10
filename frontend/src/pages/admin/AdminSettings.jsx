import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: true, path: '/admin/settings' },
]

const configs = [
    { section: 'PROGRAM RULES', name: 'Mentor-Mentee Match Limit', config: '3 Mentees per Mentor', status: 'Active', actions: ['Edit', 'Disable'] },
    { section: 'PROGRAM RULES', name: 'Request Acceptance Window', config: '7 Days to Accept', status: 'Active', actions: ['Edit', 'Disable'] },
    { section: 'GOVERNANCE', name: 'Student Registration Toggle', config: 'Signups OPEN (Summer Break)', status: 'Active', actions: ['Change', 'Disable'] },
    { section: 'GOVERNANCE', name: 'Alumni Verification Level', config: 'Standard (ID & Grad Year)', status: 'Active', actions: ['Change', 'Review'] },
    { section: 'GOVERNANCE', name: 'Sub-Admin Role Permissions', config: 'View-Only for Staff', status: 'Active', actions: ['View', 'Configure'] },
    { section: 'NOTIFICATIONS', name: 'Welcome Email Template', config: 'Standard V.2', status: 'Active', actions: ['Preview', 'Edit'] },
    { section: 'NOTIFICATIONS', name: 'Mentor Reminder Cadence', config: '48 Hours Nudge', status: 'Active', actions: ['Edit', 'Disable'] },
]

export default function AdminSettings() {
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
              <h1 className="text-4xl font-black text-[#5a1620] mb-6 italic">System Settings: Governance & Rules</h1>
              <div className="flex gap-10 border-b border-gray-100 mb-8 pb-1">
                  <button className="text-[#5a1620] font-black text-xs relative pb-4 after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-[#5a1620]">Global</button>
                  <button className="text-gray-400 font-bold text-xs pb-4 hover:text-[#5a1620] transition-colors">Security</button>
                  <button className="text-gray-400 font-bold text-xs pb-4 hover:text-[#5a1620] transition-colors">Integrations</button>
              </div>
          </header>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-3 gap-8 mb-14">
              <div className="bg-[#fffafa] rounded-[32px] p-8 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Active Program Rules</p>
                      <h3 className="text-4xl font-black text-[#0f172a] mb-1">12</h3>
                      <p className="text-[10px] font-bold text-green-500">Defined rules</p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner text-[#7b2228]">⚖️</div>
              </div>
              <div className="bg-[#fffafa] rounded-[32px] p-8 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Verified Mentors</p>
                      <h3 className="text-4xl font-black text-[#0f172a] mb-1">185</h3>
                      <p className="text-[10px] font-bold text-green-500">Verified</p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner text-[#7b2228]">🎓</div>
              </div>
              <div className="bg-[#fffafa] rounded-[32px] p-8 flex items-center justify-between shadow-sm border border-red-50/50">
                  <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Pending Requests</p>
                      <h3 className="text-4xl font-black text-[#0f172a] mb-1">44</h3>
                      <p className="text-[10px] font-bold text-orange-500">Requires review</p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner text-[#7b2228]">📋</div>
              </div>
          </div>

          {/* Configuration Panel Section */}
          <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#0f172a] mb-1">Platform Configuration Panel</h2>
                    <p className="text-xs font-bold text-gray-400">Global administrative controls and validation logic.</p>
                  </div>
                  <button className="bg-[#5a1620] text-white px-10 py-4 rounded-full font-black text-xs shadow-xl active:scale-95 transition-all">
                      + New Config Rule
                  </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#fffafa]">
                              <th className="px-10 py-6 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">SECTION</th>
                              <th className="px-6 py-6 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">SETTING NAME</th>
                              <th className="px-6 py-6 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">CURRENT CONFIG</th>
                              <th className="px-6 py-6 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em]">STATUS</th>
                              <th className="px-10 py-6 text-[9px] font-black text-[#7b2228] uppercase tracking-[0.2em] text-center">ACTIONS</th>
                          </tr>
                      </thead>
                      <tbody>
                          {configs.map((cfg, i) => (
                              <tr key={i} className="bg-white border-b border-gray-50 hover:bg-[#fffcfc] transition-colors group">
                                  <td className="px-10 py-7">
                                      <span className="bg-[#fff1f2] text-[#e11d48] px-3.5 py-1.5 rounded-lg text-[8px] font-black tracking-widest leading-none block w-max uppercase italic text-center">
                                          {cfg.section.split(' ')[0]}<br/>{cfg.section.split(' ')[1] || ''}
                                      </span>
                                  </td>
                                  <td className="px-6 py-7 font-bold text-[#0f172a] text-sm">{cfg.name}</td>
                                  <td className="px-6 py-7 font-bold text-gray-400 text-xs italic opacity-80">{cfg.config}</td>
                                  <td className="px-6 py-7">
                                      <div className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                                          <span className="text-[9px] font-black text-green-600 tracking-widest uppercase">{cfg.status}</span>
                                      </div>
                                  </td>
                                  <td className="px-10 py-7">
                                      <div className="flex items-center justify-center gap-3">
                                          <button className="bg-gray-50/50 text-gray-400 px-6 py-2 rounded-xl font-black text-[9px] hover:bg-[#7b2228] hover:text-white transition-all uppercase tracking-widest border border-gray-100">{cfg.actions[0]}</button>
                                          <button className="bg-white border-2 border-red-50 text-[#7b2228] px-6 py-2 rounded-xl font-black text-[9px] hover:bg-red-50/10 transition-all uppercase tracking-widest">{cfg.actions[1]}</button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              
              <div className="mt-8 text-center">
                  <button className="text-[10px] font-black text-[#7b2228] hover:underline uppercase tracking-[0.25em]">
                      View all platform configurations →
                  </button>
              </div>
          </div>

        </main>
      </div>
  )
}
