import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import amaImg from '../assets/Ama M.jpeg'
import johnImg from '../assets/Daniel K.jpeg'
import zeidImg from '../assets/Prince A.jpeg'
import matthewImg from '../assets/Kwesi Mensah.jpeg'
import naomiImg from '../assets/Jessica A.jpeg'
import fatoumaImg from '../assets/Dounia D.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: true, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

const requestStats = [
  { label: 'Pending', count: 3, color: 'bg-[#7b2228]', textColor: 'text-white' },
  { label: 'Accepted', count: 2, color: 'bg-[#a3d9a5]', textColor: 'text-[#166534]' },
  { label: 'Declined', count: 0, color: 'bg-[#f8b4b4]', textColor: 'text-[#991b1b]' },
]

const recentRequests = [
  {
    name: 'Ama K.',
    role: 'Associate Professor, Sociology',
    org: 'University of Ghana',
    date: 'Oct 24, 2023',
    time: '10:30 AM GMT',
    status: 'Awaiting Response',
    type: 'pending',
    image: amaImg
  },
  {
    name: 'John S.',
    role: 'AI Engineer',
    org: 'Google',
    date: 'Oct 15, 2026',
    time: '10:30 PM GMT',
    status: 'Awaiting Response',
    type: 'pending',
    image: johnImg
  },
  {
    name: 'Zeid M.',
    role: 'Chief Editorial Lead',
    org: 'Cambridge Academic Press',
    date: 'Oct 22, 2023',
    time: '02:15 PM EST',
    status: '! Respond by Oct 28',
    type: 'urgent',
    image: zeidImg
  },
  {
    name: 'Matthew M.',
    role: 'Business Analyst',
    org: 'Nestle LTD',
    date: 'Jan 22, 2026',
    time: '02:15 PM EST',
    status: '! Respond by Oct 28',
    type: 'urgent',
    image: matthewImg
  },
  {
    name: 'Naomi S.',
    role: 'Entrepreneur',
    org: 'Startup Advisor',
    date: 'Oct 22, 2023',
    time: '02:15 PM EST',
    status: '! Respond by Oct 28',
    type: 'urgent',
    image: naomiImg
  },
  {
    name: 'Fatouma Z.',
    role: 'Data Analyst',
    org: 'Ecobank',
    date: 'Oct 22, 2023',
    time: '02:15 PM EST',
    status: '! Respond by Oct 28',
    type: 'urgent',
    image: fatoumaImg
  },
]

export default function MyRequests() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800">

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#7b2228] text-white flex flex-col p-8 relative z-10 shrink-0">
        <div className="flex flex-col items-center mb-12 pt-6">
          <img src={logoImg} alt="Ashesi Logo" className="w-16 h-16 mb-3 object-contain" />
          <h2 className="text-sm font-black tracking-[0.2em] text-center leading-tight uppercase">ASHESI<br />UNIVERSITY</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[16px] transition-all duration-300 ${item.active
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

        <header className="mb-8">
          <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-2">My Requests</h1>
          <p className="text-lg font-bold text-gray-500">Discover and connect with a mentor experienced in your field.</p>
        </header>

        {/* Statistics Pills */}
        <div className="flex gap-4 mb-10">
          {requestStats.map((stat) => (
            <div key={stat.label} className={`${stat.color} ${stat.textColor} px-8 py-2.5 rounded-full font-black text-sm shadow-md transition-transform hover:scale-105 cursor-default`}>
              {stat.label} ({stat.count})
            </div>
          ))}
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          {recentRequests.map((req, i) => (
            <div key={i} className="bg-white border border-[#f0f0f0] rounded-[32px] p-6 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-5">
                <img
                  src={req.image}
                  alt={req.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#7b2228]/5 shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black text-[#0f172a]">{req.name}</h3>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${req.type === 'urgent' ? 'bg-orange-50 text-[#9a3412]' : 'bg-transparent text-gray-400'}`}>
                      {req.type === 'pending' && <span className="w-1.5 h-1.5 bg-[#7b2228] rounded-full"></span>}
                      <span className="text-[10px] font-black uppercase tracking-wider">{req.status}</span>
                    </div>
                  </div>
                  <p className="text-sm font-black text-gray-500">{req.role}</p>
                  <p className="text-xs font-bold text-gray-300 mb-3">{req.org}</p>

                  <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <span>📅</span>
                      <span>{req.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🕒</span>
                      <span>{req.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-auto">
                <button className="flex-1 border border-[#e5ccd0] text-[#7b2228] py-3 rounded-[12px] font-black text-xs hover:bg-[#7b2228] hover:text-white transition-all">
                  Withdraw
                </button>
                <button className="flex-1 bg-[#7b2228] text-white py-3 rounded-[12px] font-black text-xs hover:bg-[#5a1620] transition-all shadow-sm">
                  Resend
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
