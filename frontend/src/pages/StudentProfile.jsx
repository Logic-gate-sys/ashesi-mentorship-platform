import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import kwesiImg from '../assets/Kwesi Mensah.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: true, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

export default function StudentProfile() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800">

      {/* Sidebar - Consistent with Dashboard */}
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
          <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-2">My Profile</h1>
          <div className="flex items-center gap-4">
            <p className="text-base font-bold text-gray-500">Complete your profile to improve recommendations.</p>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[#a93737] font-black text-sm uppercase tracking-wider">Completion: <span className="text-[#0f172a]">70%</span></span>
            </div>
          </div>
          {/* Progress Bars */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-2 flex-1 bg-[#a93737] rounded-full"></div>
            ))}
            {[1, 2].map(idx => (
              <div key={idx} className="h-2 flex-1 bg-gray-100 rounded-full"></div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6 mt-2">

          {/* Profile Picture Section */}
          <section className="bg-white border border-[#e5ccd0] rounded-[32px] p-6 relative hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#0f172a]">Profile Picture</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#dcfce7] rounded-full">
                <span className="text-[10px] font-black text-[#166534]">DONE</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <img src={kwesiImg} alt="Kwesi" className="w-24 h-24 rounded-full object-cover border-2 border-[#7b2228]/10" />
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-[#0f172a]">Kwesi Mensah</h3>
                <button className="bg-[#7b2228] text-white px-5 py-2 rounded-xl font-black text-[11px] shadow-md hover:bg-[#5a1620] transition-all">Upload New</button>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="bg-white border border-[#e5ccd0] rounded-[32px] p-6 relative hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#0f172a]">Education</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#dcfce7] rounded-full">
                <span className="text-[10px] font-black text-[#166534]">MATCHED</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0f172a] mb-0.5">Ashesi University</h3>
              <p className="text-sm font-bold text-gray-500 mb-4">Computer Science, 2029</p>
              <button className="bg-[#7b2228]/5 text-[#7b2228] px-6 py-2 rounded-xl font-black text-[11px] hover:bg-[#7b2228] hover:text-white transition-all">Edit Details</button>
            </div>
          </section>

          {/* Basic Information Section */}
          <section className="bg-white border border-[#e5ccd0] rounded-[32px] p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-black text-[#0f172a] mb-6">Basic Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-black text-gray-400 uppercase">Email</span>
                <span className="text-sm font-bold text-[#0f172a]">kwesi.m@ashesi.edu</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-black text-gray-400 uppercase">Phone</span>
                <span className="text-sm font-bold text-[#0f172a]">+233 574 356</span>
              </div>
              <button className="w-full mt-2 bg-[#7b2228]/5 text-[#7b2228] py-2.5 rounded-xl font-black text-[11px] hover:bg-[#7b2228] hover:text-white transition-all">Update Info</button>
            </div>
          </section>

          {/* Skills & Interest Section */}
          <section className="bg-white border border-[#e5ccd0] rounded-[32px] p-6 hover:shadow-lg transition-all">
            <h2 className="text-xl font-black text-[#0f172a] mb-6">Skills & Interest</h2>
            <div className="flex flex-wrap gap-2">
              {['Python', 'C++', 'UI Design', 'Finance', 'Fintech'].map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-[#fdf2f2] text-[#7b2228] text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm">{tag}</span>
              ))}
            </div>
            <button className="mt-6 text-[10px] font-black text-[#7b2228] hover:underline uppercase tracking-widest">+ Add More</button>
          </section>

        </div>
      </main>
    </div>
  )
}
