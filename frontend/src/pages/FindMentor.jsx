import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import amaImg from '../assets/Ama M.jpeg'
import zeinabImg from '../assets/Zeinab A.jpeg'
import soukoratouImg from '../assets/Soukoratou K.jpeg'
import princeImg from '../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: true, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

const mentors = [
  { name: 'Ama M.', role: 'Software Eng @Aya Data', years: '2021 - 2026', rating: 4.1, image: amaImg },
  { name: 'Zeinab A.', role: 'Accountant @Ecobank', years: '2002 - 2006', rating: 3.8, image: zeinabImg },
  { name: 'Soukouratou K.', role: 'Product Analyst @Google', years: '2020 - 2024', rating: 3.9, image: soukoratouImg },
  { name: 'Prince A.', role: 'AI Eng @ByteForge', years: '2008 - 2012', rating: 4.5, image: princeImg },
]

export default function FindMentor() {
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
            <span className="text-xl group-hover:translate-x-1 transition-transform">➡️</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
          <header className="mb-10">
            <h1 className="text-4xl font-black text-[#0f172a] leading-tight mb-2">Find a Mentor</h1>
            <p className="text-lg font-bold text-gray-500">Connect with experienced alumni mentors.</p>
          </header>

          {/* Search and Filters Section */}
          <section className="bg-[#fcf5f5] rounded-[32px] p-8 border border-[#f5e1e2] mb-10">
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <span className="text-xl text-gray-400">🔍</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name, company..." 
                        className="w-full bg-white border border-[#e5ccd0] rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#7b2228] font-bold text-[#0f172a] shadow-sm"
                    />
                </div>
                <button className="bg-[#7b2228] text-white px-8 py-4 rounded-full font-black text-xs shadow-md hover:bg-[#5a1620] transition-all">
                    Search
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {['Industry', 'Class Year', 'Location'].map((label) => (
                    <div key={label} className="bg-white border border-[#7b2228]/10 px-5 py-2 rounded-full text-[10px] font-black text-[#7b2228] hover:border-[#7b2228] transition-all cursor-pointer shadow-sm">
                        {label} ᐁ
                    </div>
                ))}
            </div>
          </section>

          {/* Results Grid */}
          <section className="flex-1">
            <h2 className="text-2xl font-black text-[#0f172a] mb-8">Available Mentors</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              {mentors.map((mentor, i) => (
                <div key={i} className="bg-white border border-[#e5ccd0] rounded-[32px] p-6 flex items-center gap-6 hover:shadow-xl transition-all group">
                    <img 
                      src={mentor.image} 
                      alt={mentor.name} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#7b2228]/5 shadow-md shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-[#0f172a] leading-none mb-1 truncate">{mentor.name}</h3>
                      <p className="text-xs font-bold text-gray-400 mb-1 truncate">{mentor.role}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[11px] font-black text-[#7b2228]">★ {mentor.rating}</span>
                        <span className="text-[10px] text-gray-300 font-bold ml-auto">{mentor.years}</span>
                      </div>
                      <button className="w-full mt-4 bg-[#7b2228] text-white py-2.5 rounded-xl font-black text-[10px] shadow-sm hover:bg-[#5a1620] transition-all uppercase tracking-widest">
                        Request
                    </button>
                    </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
  )
}
