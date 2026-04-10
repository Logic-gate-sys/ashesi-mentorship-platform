import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import doctorImg from '../assets/Ama M.jpeg'
import kojoImg from '../assets/Daniel K.jpeg'
import akosuaImg from '../assets/Soukouratou.jpeg'
import alexImg from '../assets/Prince A.jpeg'
import aminaImg from '../assets/Jessica A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/alumni-dashboard' },
  { label: 'Mentorship Requests', icon: '📋', active: false, path: '/alumni/requests' },
  { label: 'My Mentees', icon: '👥', active: false, path: '/alumni/mentees' },
  { label: 'Messages', icon: '💬', active: true, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Profile Settings', icon: '⚙️', active: false, path: '/profile' },
  { label: 'Feedbacks', icon: '⭐', active: false, path: '/feedback' },
]

const recentChats = [
    { name: 'Kojo A.', role: 'Mentee', last: 'Thanks for your ...', time: 'Yesterday', img: kojoImg },
    { name: 'Kojo A.', role: 'Mentee', last: 'Thanks for your ...', time: '1 hour', img: kojoImg },
]

const conversations = [
    { name: 'Kojo Annon', last: 'Sounds good...', time: '10:42 AM', active: true, img: kojoImg },
    { name: 'Akosua John', last: 'The raw data....', time: 'Yesterday', active: false, img: akosuaImg },
    { name: 'Ama K.', last: 'I really appreciated....', time: '1 day ago', active: false, img: doctorImg },
    { name: 'Joseph M.', last: 'Last time I did...', time: '2 days ago', active: false, img: alexImg },
    { name: 'Kadidja A.', last: 'The pitch video...', time: '3 days ago', active: false, img: aminaImg },
]

export default function Messages() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar */}
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

      {/* Main Container */}
      <div className="flex-1 bg-white rounded-l-[80px] relative z-20 shadow-[-30px_0_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden p-12 overflow-y-auto no-scrollbar">
          
          {/* Header Row */}
          <header className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-black text-[#6d131b] italic">Welcome Back, Kwesi! Let's Connect.</h1>
              <div className="flex items-center gap-6">
                <div className="relative w-64">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input type="text" placeholder="Search Messages..." className="w-full bg-[#fff5f5] rounded-full py-3 pl-10 pr-4 text-[11px] font-bold focus:outline-none" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xl text-red-500">🔔</span>
                    <img src={doctorImg} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                </div>
              </div>
          </header>

          {/* Top Quick Messages Carousel */}
          <div className="flex gap-6 mb-12">
              {recentChats.map((chat, i) => (
                  <div key={i} className="bg-[#fff5f5] rounded-[32px] p-4 flex items-center gap-6 shadow-sm border border-red-50/50 w-[320px] hover:shadow-lg transition-all">
                      <img src={chat.img} className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white" />
                      <div className="flex-1">
                          <h4 className="text-xs font-black text-[#0f172a]">{chat.name} ({chat.role})</h4>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{chat.last}</p>
                          <p className="text-[8px] font-black text-gray-300 mt-2 uppercase">{chat.time}</p>
                      </div>
                      <button className="bg-[#7b2228] text-white px-5 py-2 rounded-xl text-[9px] font-black shadow-lg">Message</button>
                  </div>
              ))}
          </div>

          <div className="flex gap-10 flex-1 min-h-0">
              
              {/* Center Column - Messenger */}
              <div className="flex-1 flex gap-4">
                  
                  {/* Conversations Sidebar */}
                  <div className="w-[300px] space-y-4">
                      <h3 className="text-xl font-black text-[#7b2228] mb-6">Conversations</h3>
                      {conversations.map((c, i) => (
                          <div key={i} className={`p-5 rounded-[40px] flex items-center gap-4 transition-all duration-300 group cursor-pointer ${c.active ? 'bg-[#fff5f5] shadow-lg border border-red-50' : 'border-2 border-[#f0f0f0] hover:border-[#7b2228]/50'}`}>
                              <img src={c.img} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-0.5">
                                      <h4 className="text-[11px] font-black text-[#0f172a] truncate">{c.name}</h4>
                                      <span className="text-[8px] font-bold text-gray-300 uppercase">{c.time}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 truncate leading-tight">{c.last}</p>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 bg-white border border-[#f0f0f0] rounded-[48px] shadow-sm flex flex-col overflow-hidden">
                      <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <h4 className="text-base font-black text-[#0f172a]">Kojo Annan</h4>
                              <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  <span className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Online</span>
                              </div>
                          </div>
                          <div className="flex gap-6 text-xl text-gray-300">
                             <button className="hover:text-[#7b2228]">📹</button>
                             <button className="hover:text-[#7b2228]">ℹ️</button>
                          </div>
                      </div>

                      <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-6">
                          <div className="max-w-[80%] bg-[#fdf2f2] p-6 rounded-[30px] rounded-tl-none border border-[#f5e1e2]">
                              <p className="text-xs font-bold text-[#0f172a] leading-relaxed">Hey Kwesi, have you had a chance to look at the new mentorship curriculum?</p>
                          </div>
                          <div className="max-w-[80%] ml-auto bg-[#7b2228] p-6 rounded-[30px] rounded-tr-none text-white shadow-xl">
                              <p className="text-xs font-bold leading-relaxed">Just reviewing it now. It looks incredibly comprehensive.</p>
                          </div>
                          <div className="max-w-[80%] bg-[#fdf2f2] p-6 rounded-[30px] rounded-tl-none border border-[#f5e1e2]">
                              <p className="text-xs font-bold text-[#0f172a] leading-relaxed">Great! Let's touch base on it tomorrow after the project review.</p>
                          </div>
                          <div className="max-w-[80%] ml-auto bg-[#7b2228] p-6 rounded-[30px] rounded-tr-none text-white shadow-xl">
                              <p className="text-xs font-bold leading-relaxed">Sounds good. Talk to you soon!</p>
                          </div>
                      </div>

                      <div className="p-8">
                          <div className="bg-[#fff5f5] rounded-full px-8 py-5 flex items-center gap-4 border border-transparent focus-within:border-[#7b2228] shadow-inner">
                              <button className="text-xl text-gray-300">📎</button>
                              <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-xs font-bold focus:outline-none" />
                              <button className="bg-[#7b2228] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl">➤</button>
                          </div>
                      </div>
                  </div>

              </div>

              {/* Right Sidebar Widgets */}
              <div className="w-[320px] space-y-8">
                  
                  {/* Updates Feed Widget */}
                  <div className="bg-[#fff5f5] rounded-[48px] p-8 space-y-8 border border-red-50/50 shadow-sm relative overflow-hidden">
                      <h3 className="text-base font-black text-[#7b2228] flex items-center gap-3 italic">
                          <span>🔔</span> Updates Feed
                      </h3>
                      <div className="space-y-8">
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-1 w-2 h-2 bg-red-800 rounded-full"></div>
                            <p className="text-[11px] font-black text-[#0f172a] leading-tight">New Mentee Request</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1">Amaa (Freshman) requested a meeting.</p>
                         </div>
                         <div className="relative pl-6 opacity-40">
                            <div className="absolute left-0 top-1 w-2 h-2 bg-gray-300 rounded-full"></div>
                            <p className="text-[11px] font-bold text-gray-500 leading-tight">Career Fair 2024</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1">Alumni networking session starts in 2 days.</p>
                         </div>
                      </div>
                  </div>

                  {/* Upcoming Schedule Widget */}
                  <div className="bg-[#fff5f5] rounded-[48px] p-8 border border-red-50/50 shadow-sm">
                      <h3 className="text-base font-black text-[#7b2228] flex items-center gap-3 mb-6 italic">
                          <span>📅</span> Upcoming Schedule
                      </h3>
                      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7b2228]"></div>
                          <div className="flex justify-between items-baseline mb-4">
                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">MEETING</p>
                             <p className="text-xs font-black text-[#7b2228]">June 15</p>
                          </div>
                          <h4 className="text-sm font-black text-[#0f172a] mb-2 leading-tight">Project Review with Akosua</h4>
                          <p className="text-[10px] font-black text-gray-400 flex items-center gap-2 mb-6">
                              <span>🕒</span> 2:00 PM - 3:00 PM
                          </p>
                          <button className="w-full py-3.5 border-2 border-[#7b2228] text-[#7b2228] rounded-2xl font-black text-[10px] hover:bg-[#7b2228] hover:text-white transition-all uppercase tracking-widest leading-none">
                              Join Video Call
                          </button>
                      </div>
                  </div>

                  {/* Give Feedback Widget */}
                  <div className="bg-[#fff5f5] rounded-[48px] p-8 shadow-sm border border-red-50/50">
                      <h3 className="text-base font-black text-[#7b2228] mb-6 italic">Give Feedback</h3>
                      <p className="text-[10px] font-bold text-gray-500 text-center mb-6 leading-relaxed">
                          How was your last messaging session with Kojo?
                      </p>
                      <div className="flex justify-center gap-2 text-xl text-[#7b2228] mb-8">
                         <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-20">★</span>
                      </div>
                      <button className="w-full bg-[#5a1620] text-white py-4 rounded-3xl font-black text-[10px] shadow-xl hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
                          Rate last messaging session
                      </button>
                  </div>

                  {/* Open to Mentorship Switch */}
                  <div className="bg-[#f0fdf4]/30 rounded-[32px] p-6 flex flex-col gap-4 border border-[#dcfce7]">
                      <div className="flex items-center justify-between">
                          <div>
                              <h4 className="text-xs font-black text-[#0f172a] leading-none mb-1">Open to Mentorship</h4>
                              <p className="text-[8px] font-black text-[#166534] uppercase tracking-widest">Currently Available</p>
                          </div>
                          <div className="w-12 h-6 bg-[#166534] rounded-full relative shadow-inner">
                             <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                          </div>
                      </div>
                      <div className="pt-4 border-t border-[#dcfce7]">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">WEEKLY HOURS</p>
                          <p className="text-[10px] font-black text-[#166534] italic">Tue, Thu: 4:00 PM - 6:00 PM</p>
                      </div>
                  </div>

              </div>

          </div>

      </div>
    </div>
  )
}
