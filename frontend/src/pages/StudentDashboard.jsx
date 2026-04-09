import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import esterImg from '../assets/Ester M.jpeg'
import danielImg from '../assets/Daniel K.jpeg'
import soukoratouImg from '../assets/Soukoratou K.jpeg'
import zeinabImg from '../assets/Zeinab A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: true, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

const quickActions = [
  { title: 'Edit Profile', icon: '👤' },
  { title: 'Explore Alumni', icon: '🎓' },
  { title: 'Check Mentor Request', icon: '📝' },
]

const connections = [
  { name: 'Ester M.', title: 'Economist', status: 'Active', image: esterImg },
  { name: 'Daniel K.', title: 'Software Engineer', status: 'Active', image: danielImg },
]

const suggestions = [
  { name: 'Soukouratou K.', company: '@Google', position: 'Prod Anal', year: '2023', rating: '4.8', image: soukoratouImg },
  { name: 'Zeinab A.', company: '@Aya Data', position: 'FS Dev', year: '2023', rating: '4.7', image: zeinabImg },
]

const updates = [
  { label: 'Alumni Kojo accepted your request', meta: 'Start Messaging', type: 'success' },
  { label: 'New message from Mentor Ester M.', meta: '', type: 'message' },
  { label: 'Upcoming meeting: June 15th', meta: '', type: 'calendar' },
]

const schedule = [
  { date: 'February 12', time: '2:00 PM', person: 'Kwame', link: 'Zoom Meet Link' },
  { date: 'February 12', time: '2:00 PM', person: 'Ayisha', link: 'Zoom Meet Link' },
]

export default function StudentDashboard() {
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

      {/* Main Content Areas */}
      <div className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-row overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)]">

        {/* Middle Column */}
        <div className="flex-1 p-12 overflow-y-auto no-scrollbar">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-1 italic">
              Welcome, Kwesi!<br />Let's find your path
            </h1>
          </header>

          {/* Quick Actions */}
          <section className="mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <div key={action.title} className="bg-white border border-[#e5ccd0] rounded-[24px] p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:scale-[1.05] transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fdf2f2] group-hover:bg-[#7b2228] group-hover:text-white rounded-[16px] flex items-center justify-center text-xl mb-3 text-[#7b2228] transition-all duration-300">
                    {action.icon}
                  </div>
                  <span className="font-extrabold text-[#7b2228] text-xs text-center">{action.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* My Connections */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#0f172a]">My Connections</h2>
              <span className="text-[10px] font-extrabold text-[#7b2228] bg-[#fdf2f2] px-3 py-1 rounded-full">2 connected</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {connections.map((conn) => (
                <div key={conn.name} className="bg-white border border-[#e5ccd0] rounded-[24px] p-5 flex flex-col gap-4 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <img src={conn.image} alt={conn.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#7b2228]/5" />
                    <div>
                      <h3 className="text-lg font-black text-[#0f172a] leading-none mb-1">{conn.name}</h3>
                      <p className="text-xs font-bold text-gray-400">{conn.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] rounded-full text-[9px] font-black uppercase tracking-wider">
                      {conn.status}
                    </span>
                    <button className="px-5 py-2 bg-[#7b2228] text-white rounded-full text-[11px] font-extrabold shadow-md hover:bg-[#5a1620] transition-all">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mentor Search Section */}
          <section className="bg-[#fcf5f5] rounded-[40px] p-8 border border-[#f5e1e2]">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="text-xl text-[#7b2228]">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search mentors..."
                className="w-full bg-white border border-[#e5ccd0] rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#7b2228] font-bold text-[#0f172a] shadow-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {suggestions.map((mentor) => (
                <div key={mentor.name} className="bg-white border border-[#e5ccd0] rounded-[24px] p-5 flex gap-4 hover:shadow-lg transition-all">
                  <img src={mentor.image} alt={mentor.name} className="w-14 h-14 rounded-[16px] object-cover border border-[#7b2228]/10 shadow-sm shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h4 className="text-base font-black text-[#0f172a] leading-none mb-1 truncate">{mentor.name}</h4>
                    <p className="text-[10px] text-gray-400 font-extrabold truncate uppercase">{mentor.company}</p>
                    <p className="text-[10px] text-gray-400 font-extrabold truncate uppercase">{mentor.position}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-[#7b2228] font-black">★ {mentor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="w-[340px] bg-[#f8f9fa] border-l-2 border-gray-50 flex flex-col p-10 overflow-y-auto shrink-0 relative z-10">

          {/* Updates Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#0f172a] mb-8">Updates</h2>
            <div className="space-y-6 relative ml-2">
              <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-[#e5ccd0]/40"></div>
              {updates.map((update, i) => (
                <div key={i} className="flex gap-5 relative z-10">
                  <div className={`w-3.5 h-3.5 rounded-full mt-1 ring-[4px] ring-[#f8f9fa] ${update.type === 'success' ? 'bg-green-500' : update.type === 'message' ? 'bg-[#7b2228]' : 'bg-red-400'}`}></div>
                  <div>
                    <p className="text-sm font-black text-[#0f172a] leading-tight mb-1">{update.label}</p>
                    {update.meta && <button className="text-[11px] font-black text-[#7b2228] hover:underline uppercase tracking-wider">{update.meta}</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Schedule */}
          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#0f172a] mb-6">Schedule</h2>
            <div className="space-y-6">
              {schedule.map((slot, i) => (
                <div key={i} className="flex justify-between items-start pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-black text-[#0f172a]">{slot.date}</p>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{slot.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#0f172a]">{slot.person}</p>
                    <button className="text-[11px] font-extrabold text-[#7b2228] hover:underline mt-0.5">{slot.link}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Give Feedback */}
          <section className="mt-auto bg-white rounded-[24px] p-6 border border-[#e5ccd0] shadow-md">
            <h2 className="text-lg font-black text-[#0f172a] mb-3">Feedback</h2>
            <p className="text-xs font-bold text-gray-400 mb-6 italic">
              "Meeting with Daniel.k"
            </p>
            <div className="flex gap-2.5 mb-6 items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-2xl transition-all cursor-pointer hover:scale-110 ${star <= 3 ? 'text-[#7b2228]' : 'text-gray-100'}`}>★</span>
              ))}
            </div>
            <button className="w-full bg-[#7b2228] text-white py-4 rounded-[12px] font-black text-sm hover:bg-[#5a1620] transition-all uppercase tracking-widest">
              Submit
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}