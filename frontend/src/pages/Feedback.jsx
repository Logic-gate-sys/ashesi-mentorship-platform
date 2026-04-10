import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import amaImg from '../assets/Ama M.jpeg'
import mentor1Img from '../assets/Daniel K.jpeg'

const sidebarItems = [
  { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
  { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
  { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
  { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
  { label: 'Messages', icon: '💬', active: false, path: '/messages' },
  { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
  { label: 'Feedback', icon: '⭐', active: true, path: '/feedback' },
]

export default function Feedback() {
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
            <span className="text-xl group-hover:translate-x-1 transition-transform">➡️</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#f8f9fa] rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
          <header className="mb-10">
            <h1 className="text-4xl font-black text-[#5a1620] leading-tight mb-2 italic">Share Your Feedback, Kwesi!</h1>
            <p className="text-base font-bold text-gray-500 max-w-2xl">Your insights help our community grow. Take a moment to review your recent mentoring sessions and track your overall impact.</p>
          </header>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-10">
              <button className="bg-[#7b2228] text-white px-8 py-2.5 rounded-full font-black text-xs shadow-md">
                  Pending Feedback
              </button>
              <button className="bg-[#ebe3e3] text-gray-400 px-8 py-2.5 rounded-full font-black text-xs hover:bg-gray-200 transition-colors">
                  Feedback Given
              </button>
              <button className="bg-[#ebe3e3] text-gray-400 px-8 py-2.5 rounded-full font-black text-xs hover:bg-gray-200 transition-colors">
                  Impact
              </button>
              <button className="bg-[#ebe3e3] text-gray-400 px-8 py-2.5 rounded-full font-black text-xs hover:bg-gray-200 transition-colors ml-6">
                  View Mentor's feedback
              </button>
          </div>

          <div className="space-y-6 flex-1 min-h-0">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">AWAITING YOUR RATING</h3>
              
              {/* Rating Cards */}
              <div className="space-y-4 max-w-4xl">
                  {[
                      { name: 'Ama K.', role: 'Senior Research Fellow • Session: 2h', img: amaImg },
                      { name: 'Kwabena B.', role: 'Executive Strategy Director • Session: 1.5h', img: mentor1Img }
                  ].map((mentor, i) => (
                      <div key={i} className="bg-white rounded-[32px] p-6 flex items-center justify-between shadow-sm border border-gray-50 hover:shadow-md transition-all">
                          <div className="flex items-center gap-6">
                              <img src={mentor.img} alt={mentor.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#fff5f5]" />
                              <div>
                                  <h4 className="text-xl font-black text-[#2b2b2b] mb-1">{mentor.name}</h4>
                                  <p className="text-xs font-bold text-gray-400 mb-2">{mentor.role}</p>
                                  <div className="flex gap-1 text-[#7b2228] text-lg">
                                      {Array(5).fill(0).map((_, i) => (
                                          <span key={i} className="opacity-30">☆</span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <button className="bg-[#5a1620] text-white px-10 py-3 rounded-full font-black text-xs shadow-lg hover:scale-105 transition-all active:scale-95">
                              GIVE RATING
                          </button>
                      </div>
                  ))}
              </div>

              {/* Call to Action Banner */}
              <div className="mt-12 bg-[#8c2a33] rounded-[48px] p-12 text-white relative overflow-hidden flex items-center justify-between max-w-4xl shadow-2xl group">
                  <div className="relative z-10 max-w-lg">
                      <h2 className="text-4xl font-black mb-4 leading-tight italic">Give Detailed Feedback</h2>
                      <p className="text-sm font-bold opacity-80 mb-10 leading-relaxed">
                          Help our mentors improve by providing written critiques on their research methodologies and leadership approach.
                      </p>
                      <div className="flex items-center gap-8">
                          <button className="bg-white text-[#7b2228] px-10 py-4 rounded-full font-black text-sm shadow-xl hover:bg-gray-50 transition-all uppercase tracking-wide">
                              Write Review
                          </button>
                          <button className="flex items-center gap-2 font-black text-xs hover:translate-x-1 transition-transform uppercase tracking-widest text-[#f5e1e2]">
                              View Impact Metrics <span>→</span>
                          </button>
                      </div>
                  </div>
                  
                  {/* Graphic Element */}
                  <div className="absolute right-0 top-0 bottom-0 w-[400px] opacity-10 flex items-center justify-center pointer-events-none group-hover:opacity-20 transition-opacity">
                      <span className="text-[200px]">📝</span>
                  </div>
              </div>

          </div>

        </main>
      </div>
  )
}
