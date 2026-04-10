import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: false, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: true, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

export default function AdminAnalytics() {
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
              <h1 className="text-4xl font-black text-[#5a1620] italic">Analytics: Mentorship Ecosystem Performance</h1>
          </header>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-12">
              <div className="bg-[#fff5f5] p-1.5 rounded-2xl flex gap-1 shadow-sm border border-red-50">
                  <button className="bg-white text-[#7b2228] px-8 py-3 rounded-xl font-black text-xs shadow-md">Monthly Overview</button>
                  <button className="text-gray-400 px-8 py-3 rounded-xl font-black text-xs hover:text-[#7b2228] transition-colors">By Program</button>
              </div>
              <div className="flex gap-4">
                  <div className="bg-[#fff5f5] rounded-2xl px-6 py-3 flex items-center gap-4 border border-red-50 shadow-sm cursor-pointer">
                      <span className="text-lg">📅</span>
                      <span className="text-[11px] font-black text-[#7b2228]">Oct 2023 - Oct 2024</span>
                  </div>
                  <button className="bg-[#5a1620] text-white px-10 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                      <span>📥</span> Export Report
                  </button>
              </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-8 mb-14">
              <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 shadow-sm relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 bg-[#fff5f5] rounded-2xl flex items-center justify-center text-2xl shadow-inner">🎓</div>
                      <span className="bg-[#dcfce7] text-[#166534] px-4 py-1.5 rounded-lg text-[10px] font-black">+12%</span>
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">ACTIVE MENTORS</p>
                      <h3 className="text-5xl font-black text-[#0f172a]">285</h3>
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 shadow-sm relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 bg-[#fff5f5] rounded-2xl flex items-center justify-center text-2xl shadow-inner">👥</div>
                      <span className="bg-[#dcfce7] text-[#166534] px-4 py-1.5 rounded-lg text-[10px] font-black">+8%</span>
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">ACTIVE MENTEES</p>
                      <h3 className="text-5xl font-black text-[#0f172a]">241</h3>
                  </div>
              </div>
              <div className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 shadow-sm flex items-center gap-10">
                  <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#fecaca" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="40" stroke="#7b2228" strokeWidth="8" strokeDasharray={`${88 * 2.51} 251`} strokeLinecap="round" fill="transparent" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#7b2228] text-base font-black">✔️</span>
                      </div>
                  </div>
                  <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">REQUEST FULFILMENT RATE</p>
                      <h3 className="text-5xl font-black text-[#0f172a] mb-2">88%</h3>
                      <p className="text-[9px] font-black text-[#16a34a] uppercase flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse"></span>
                           Optimized performance
                      </p>
                  </div>
              </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-5 gap-10 flex-1 min-h-0">
              
              {/* Request Volume Stacked Bar Chart */}
              <div className="col-span-3 bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 flex flex-col min-h-0 shadow-sm">
                  <div className="flex justify-between items-baseline mb-12">
                      <div>
                          <h3 className="text-xl font-black text-[#5a1620] italic mb-1">Request Volume & Connections</h3>
                          <p className="text-[10px] font-bold text-gray-400">Performance metric over the last 12 months</p>
                      </div>
                      <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-[#5a1620] rounded-sm"></span>
                              <span className="text-[10px] font-black text-[#0f172a]">Requests</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-[#f5e1e2] rounded-sm"></span>
                              <span className="text-[10px] font-black text-[#0f172a]">Connections</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2 relative">
                      {/* Y-Axis mock */}
                      <div className="absolute left-[-20px] top-0 bottom-8 flex flex-col justify-between text-[10px] font-black text-gray-200 pointer-events-none">
                          <span>100</span>
                          <span>75</span>
                          <span>50</span>
                          <span>25</span>
                          <span>0</span>
                      </div>

                      {[
                          { req: 15, con: 12 }, { req: 30, con: 14 }, { req: 32, con: 12 }, { req: 38, con: 18 },
                          { req: 65, con: 12 }, { req: 80, con: 10 }, { req: 50, con: 15 }, { req: 30, con: 22 },
                          { req: 55, con: 14 }, { req: 70, con: 15 }, { req: 95, con: 10 }, { req: 75, con: 18 }
                      ].map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col gap-0.5 group">
                              <div className="flex flex-col-reverse relative h-[240px]">
                                   <div className="w-full bg-[#5a1620] rounded-sm transition-all duration-700 shadow-md group-hover:brightness-125" style={{ height: `${d.req}%` }}></div>
                                   <div className="w-full bg-[#f5e1e2] rounded-sm transition-all duration-700 group-hover:brightness-105" style={{ height: `${d.con}%` }}></div>
                              </div>
                              <span className="text-[9px] font-black text-gray-300 text-center mt-3 tracking-tighter">
                                  {['SEPT', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'OCT'][i]}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Department Engagement Donut Chart */}
              <div className="col-span-2 bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 flex flex-col shadow-sm">
                  <header className="mb-10">
                      <h3 className="text-xl font-black text-[#5a1620] italic mb-1">Engagement by Department</h3>
                      <p className="text-[10px] font-bold text-gray-400">Breakdown for October</p>
                  </header>
                  
                  <div className="flex-1 flex flex-col items-center justify-center relative scale-110">
                      <div className="relative w-56 h-56">
                          <svg className="w-full h-full transform -rotate-90 origin-center scale-[1.3]">
                              <circle cx="50%" cy="50%" r="48" stroke="#f5e1e2" strokeWidth="16" fill="transparent" />
                              <circle cx="50%" cy="50%" r="48" stroke="#7b2228" strokeWidth="16" strokeDasharray="301" strokeDashoffset={`${301 * (1 - 0.35)}`} strokeLinecap="round" fill="transparent" />
                              <path d="M 50 20 A 30 30 0 0 1 80 50" fill="transparent" stroke="#5a1620" strokeWidth="16" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <h4 className="text-3xl font-black text-[#0f172a]">1,240</h4>
                              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">INTERACTIONS</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-auto">
                      <div className="flex items-center gap-3">
                          <span className="w-3 h-3 bg-[#5a1620] rounded-sm"></span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">CS (35%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="w-3 h-3 bg-[#fecaca] rounded-sm"></span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">BA (25%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="w-3 h-3 bg-[#7b2228] rounded-sm opacity-60"></span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">ENG (20%)</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="w-3 h-3 bg-[#f5e1e2] rounded-sm"></span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">A&S (20%)</span>
                      </div>
                  </div>
              </div>

          </div>

        </main>
      </div>
  )
}
