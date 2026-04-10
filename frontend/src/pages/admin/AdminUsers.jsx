import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import adminImg from '../../assets/Ester M.jpeg'
import mentor1Img from '../../assets/Ama M.jpeg'
import student1Img from '../../assets/Daniel K.jpeg'
import student2Img from '../../assets/Soukouratou.jpeg'
import mentor2Img from '../../assets/Prince A.jpeg'

const sidebarItems = [
  { label: 'Oversight', icon: '📋', active: false, path: '/admin-dashboard' },
  { label: 'User Management', icon: '👤', active: true, path: '/admin/users' },
  { label: 'Connection Monitor', icon: '📉', active: false, path: '/admin/connections' },
  { label: 'Analytics', icon: '📊', active: false, path: '/admin/analytics' },
  { label: 'Reported Issues', icon: '⚠️', active: false, path: '/admin/issues' },
  { label: 'Announcements', icon: '📢', active: false, path: '/admin/announcements' },
  { label: 'System Settings', icon: '⚙️', active: false, path: '/admin/settings' },
]

const users = [
    { name: 'Prof. Jane Doe', email: 'jane.doe@academy.edu', role: 'Mentor', field: 'Career Strategy', date: 'Sep 12, 2023', status: 'Active', img: mentor1Img },
    { name: 'Kojo Annan', email: 'kojo.a@student.edu', role: 'Student', field: 'AI Engineer', date: 'Jan 05, 2024', status: 'Pending', img: student1Img },
    { name: 'Akosua Mensah', email: 'akosua.m@student.edu', role: 'Student', field: 'Financial Literacy', date: 'Oct 20, 2023', status: 'Active', img: student2Img },
    { name: 'Kwabena B.', email: 'kwabena.b@faculty.edu', role: 'Mentor', field: 'Creative Writing', date: 'Nov 15, 2023', status: 'Active', img: mentor2Img },
]

export default function AdminUsers() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar - Consistent with Design */}
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
              <h1 className="text-4xl font-black text-[#5a1620] mb-2">User Management</h1>
              <p className="text-base font-bold text-gray-400">Oversee and manage the academic mentorship community</p>
          </header>

          {/* Search & Filters Bar */}
          <div className="space-y-6 mb-12">
              <div className="relative w-full">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                  <input 
                      type="text" 
                      placeholder="Search by name, email, or ID..." 
                      className="w-full bg-[#fffcfc] border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#7b2228]/5 transition-all shadow-sm"
                  />
              </div>
              
              <div className="flex gap-4">
                  <div className="flex-1 relative">
                      <select className="w-full bg-[#fffcfc] border border-gray-100 rounded-xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer">
                          <option>User Role</option>
                      </select>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
                  </div>
                  <div className="flex-1 relative">
                      <select className="w-full bg-[#fffcfc] border border-gray-100 rounded-xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer">
                          <option>Department</option>
                      </select>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
                  </div>
                  <div className="flex-1 relative">
                      <select className="w-full bg-[#fffcfc] border border-gray-100 rounded-xl py-4 px-6 text-[11px] font-black focus:outline-none appearance-none cursor-pointer">
                          <option>Status</option>
                      </select>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</span>
                  </div>
                  <button className="bg-[#fddada] text-[#7b2228] px-10 py-4 rounded-xl font-black text-[11px] flex items-center justify-center gap-2 hover:bg-[#7b2228] hover:text-white transition-all shadow-sm uppercase tracking-widest whitespace-nowrap">
                      <span>🔻</span> Apply Filters
                  </button>
              </div>
          </div>

          {/* User Table Section */}
          <div className="flex-1">
              <div className="bg-[#fff9f9] rounded-t-[32px] overflow-hidden border-x border-t border-gray-50">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#fff5f5]">
                              <th className="px-10 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em]">NAME</th>
                              <th className="px-6 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em]">ROLE</th>
                              <th className="px-6 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em]">MENTORSHIP FIELD</th>
                              <th className="px-6 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em]">JOIN DATE</th>
                              <th className="px-6 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em]">STATUS</th>
                              <th className="px-10 py-6 text-[10px] font-black text-[#7b2228] uppercase tracking-[0.15em] text-center">ACTIONS</th>
                          </tr>
                      </thead>
                      <tbody>
                          {users.map((user, i) => (
                              <tr key={i} className="bg-white border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                                  <td className="px-10 py-6">
                                      <div className="flex items-center gap-5">
                                          <img src={user.img} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" />
                                          <div>
                                              <p className="text-[13px] font-black text-[#0f172a]">{user.name}</p>
                                              <p className="text-[10px] font-bold text-gray-400">{user.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-tighter ${user.role === 'Mentor' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fff1f2] text-[#e11d48]'}`}>
                                          {user.role}
                                      </span>
                                  </td>
                                  <td className="px-6 py-6 font-bold text-[#0f172a] text-xs">
                                      {user.field}
                                  </td>
                                  <td className="px-6 py-6 text-[11px] font-black text-gray-300">
                                      {user.date}
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]'}`}></span>
                                          <span className={`text-[11px] font-black ${user.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>{user.status}</span>
                                      </div>
                                  </td>
                                  <td className="px-10 py-6">
                                      <div className="flex items-center justify-center gap-6 text-xl text-gray-200">
                                          <button className="hover:text-[#7b2228] transition-colors">✎</button>
                                          <button className="hover:text-red-500 transition-colors">🚫</button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Pagination Footer */}
          <footer className="mt-8 flex items-center justify-between px-6">
              <p className="text-[11px] font-bold text-gray-400 italic">Showing 1 to 4 of 128 members</p>
              <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 hover:text-[#7b2228] hover:bg-[#fff5f5]">❮</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6d131b] text-white font-black text-xs shadow-lg">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 font-black text-xs text-gray-400 hover:text-[#7b2228]">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 font-black text-xs text-gray-400 hover:text-[#7b2228]">3</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 hover:text-[#7b2228] hover:bg-[#fff5f5]">❯</button>
              </div>
          </footer>

        </main>
      </div>
  )
}
