import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import doctorImg from '../../assets/Ama M.jpeg'
import kojoImg from '../../assets/Daniel K.jpeg'
import akosuaImg from '../../assets/Soukouratou.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/alumni-dashboard' },
  { label: 'Mentorship Requests', icon: '📋', active: false, path: '/alumni/requests' },
  { label: 'My Mentees', icon: '👥', active: true, path: '/alumni/mentees' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Profile Settings', icon: '⚙️', active: false, path: '/profile' },
  { label: 'Feedbacks', icon: '⭐', active: false, path: '/feedback' },
]

export default function AlumniMentees() {
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
              <div className="max-w-xl">
                <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-2 italic">Welcome Back, Dr. Ama Koomson!</h1>
                <p className="text-base font-bold text-gray-500">View and manage your current mentee relationships.</p>
              </div>
              <div className="flex items-center gap-6">
                  <div className="flex gap-4 text-2xl text-gray-400">
                      <button className="relative">
                          🔔
                          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                      </button>
                      <button className="opacity-60">🕒</button>
                  </div>
                  <img src={doctorImg} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              </div>
          </header>

          {/* Search Bar */}
          <div className="relative mb-12">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                  type="text" 
                  placeholder="Search mentees, documents, or notes..." 
                  className="w-full bg-[#fff5f5] rounded-full py-5 pl-14 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#7b2228]/10"
              />
          </div>

          <div className="flex gap-14 flex-1 min-h-0">
              
              {/* Left Column - Mentees List */}
              <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black text-[#0f172a]">Active Mentees (2)</h2>
                     <button className="text-[10px] font-black text-[#7b2228] hover:underline uppercase tracking-widest flex items-center gap-2">View Archive <span>→</span></button>
                  </div>
                  
                  <div className="space-y-8">
                      {[
                          { 
                            name: 'Kojo Annan', 
                            major: "CS '26 • COMPUTER SCIENCE", 
                            focus: ['FAANG Internships', 'Python Projects'], 
                            progress: 3, 
                            total: 4, 
                            img: kojoImg 
                          },
                          { 
                            name: 'Akosua Mensah', 
                            major: "BA '27 • BUSINESS ADMINISTRATION", 
                            focus: ['Career Planning', 'Interview Prep'], 
                            progress: 1, 
                            total: 3, 
                            img: akosuaImg 
                          }
                      ].map((m, i) => (
                          <div key={i} className="bg-white border-2 border-[#fff5f5] rounded-[48px] p-10 flex items-center justify-between shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                              <div className="flex items-center gap-8">
                                  <div className="relative">
                                     <img src={m.img} alt={m.name} className="w-24 h-24 rounded-[32px] object-cover shadow-xl border-4 border-white" />
                                     <span className="absolute -bottom-2 -right-2 bg-[#dcfce7] text-[#166534] text-[8px] font-black px-3 py-1 rounded-lg shadow-sm">ACTIVE</span>
                                  </div>
                                  <div>
                                      <div className="flex items-center justify-between mb-1">
                                         <h3 className="text-2xl font-black text-[#0f172a]">{m.name}</h3>
                                         <button className="text-[9px] font-black text-[#7b2228] hover:underline uppercase tracking-widest ml-4">View Profile</button>
                                      </div>
                                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">{m.major}</p>
                                      
                                      <div className="flex gap-10">
                                          <div>
                                              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">FOCUS AREAS</p>
                                              <div className="flex gap-2">
                                                  {m.focus.map(tag => (
                                                      <span key={tag} className="px-5 py-1.5 bg-[#fdf2f2] text-[#7b2228] text-[9px] font-black rounded-full uppercase tracking-tighter">{tag}</span>
                                                  ))}
                                              </div>
                                          </div>
                                          <div className="flex-1 min-w-[150px]">
                                              <div className="flex justify-between items-baseline mb-2">
                                                 <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">MENTORSHIP GOAL PROGRESS</p>
                                                 <p className="text-[9px] font-black text-gray-400">{m.progress} of {m.total} Complete</p>
                                              </div>
                                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                  <div className="h-full bg-[#7b2228]" style={{ width: `${(m.progress/m.total)*100}%` }}></div>
                                              </div>
                                          </div>
                                      </div>

                                      <div className="flex gap-4 mt-8">
                                          <button className="bg-[#5a1620] text-white px-10 py-4 rounded-full font-black text-xs shadow-xl active:scale-95 transition-all">Schedule Meeting</button>
                                          <button className="border-2 border-gray-100 text-[#0f172a] px-10 py-4 rounded-full font-black text-xs hover:bg-gray-50 transition-all">Message</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Right Sidebar Widgets */}
              <div className="w-[360px] space-y-10">
                  
                  {/* Profile Status Widget */}
                  <div className="bg-[#7b2228] rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                          <p className="text-[10px] font-black text-[#f5e1e2] uppercase tracking-widest">PROFILE STATUS</p>
                          <div className="w-12 h-6 bg-white/20 rounded-full relative shadow-inner">
                              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                          </div>
                      </div>
                      <h3 className="text-xl font-black mb-4 italic">Accepting Requests</h3>
                      <div className="bg-white/10 rounded-2xl p-6 border border-white/5 inline-block min-w-[180px]">
                          <p className="text-[8px] font-black text-[#f5e1e2] uppercase tracking-widest mb-1 opacity-60">AVAILABLE HOURS</p>
                          <p className="text-sm font-black tracking-tight">6:00pm - 7:00pm</p>
                      </div>
                  </div>

                  {/* Recent Updates Widget */}
                  <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">RECENT UPDATES</h3>
                      <div className="space-y-6">
                          <div className="flex items-start gap-5 group cursor-pointer">
                              <div className="w-10 h-10 bg-[#fff5f5] rounded-xl flex items-center justify-center text-lg shadow-sm border border-[#f5e1e2]">📄</div>
                              <div>
                                  <p className="text-[11px] font-black text-[#2b2b2b] group-hover:text-[#7b2228] transition-colors">New note on Kojo Annan</p>
                                  <p className="text-[9px] font-bold text-gray-400 mt-0.5">2 hours ago</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-5 group cursor-pointer">
                              <div className="w-10 h-10 bg-[#fff5f5] rounded-xl flex items-center justify-center text-lg shadow-sm border border-[#f5e1e2]">↩️</div>
                              <div>
                                  <p className="text-[11px] font-black text-[#2b2b2b] group-hover:text-[#7b2228] transition-colors">Last message from you</p>
                                  <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Yesterday at 4:12 PM</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Notifications Widget */}
                  <div className="bg-[#fffafa] rounded-[48px] p-10 border-2 border-red-50/50 shadow-sm space-y-8">
                      <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8">NOTIFICATIONS</h3>
                      <div className="space-y-8">
                          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden group">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
                              <p className="text-[11px] font-black text-[#2b2b2b] leading-relaxed mb-4">Akosua Mensah booked a session for Tuesday.</p>
                              <p className="text-[9px] font-black text-[#7b2228] uppercase tracking-[0.15em] opacity-80">ACTION REQUIRED</p>
                          </div>
                          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 opacity-60">
                              <p className="text-[11px] font-bold text-gray-500 leading-relaxed mb-4">New message from Mentor Ama regarding curriculum.</p>
                              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.15em]">JUST NOW</p>
                          </div>
                      </div>
                  </div>

                  {/* Milestones Summary Widget */}
                  <div className="pt-6 border-t border-gray-100">
                      <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-6">MILESTONES SUMMARY</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center text-[11px] font-black">
                              <span className="text-gray-500">Kojo Annan</span>
                              <span className="text-[#0f172a] bg-gray-50 px-3 py-1 rounded-lg">3/4 MET</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-black">
                              <span className="text-gray-500">Akosua Mensah</span>
                              <span className="text-[#0f172a] bg-gray-50 px-3 py-1 rounded-lg">1/3 MET</span>
                          </div>
                      </div>
                  </div>

              </div>

          </div>

        </main>
      </div>
  )
}
