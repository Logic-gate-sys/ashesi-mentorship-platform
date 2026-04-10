import { Link } from 'react-router-dom'
import logoImg from '../../assets/Ashesi Logo.jpeg'
import mentorImg from '../../assets/Kwesi Mensah.jpeg'

const sidebarItems = [
  { label: 'HOME', icon: '🏠', active: false, path: '/alumni-dashboard' },
  { label: 'MENTORSHIP REQUESTS', icon: '🤝', active: false, path: '/alumni/requests' },
  { label: 'MY MENTEES', icon: '👥', active: false, path: '/alumni/mentees' },
  { label: 'MESSAGES', icon: '📧', active: false, path: '/alumni/messages' },
  { label: 'MEETINGS', icon: '📅', active: false, path: '/alumni/meetings' },
  { label: 'PROFILE SETTINGS', icon: '⚙️', active: true, path: '/alumni/profile' },
  { label: 'FEEDBACKS', icon: '⭐', active: false, path: '/alumni/feedback' },
]

export default function AlumniProfile() {
  return (
    <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

      {/* Sidebar - Consistent with Alumni/Ashesi Design */}
      <aside className="w-[280px] bg-[#7b2228] text-white flex flex-col p-8 relative z-10 shrink-0">
        <div className="flex flex-col items-center mb-10 pt-6">
          <img src={logoImg} alt="Ashesi Logo" className="w-16 h-16 mb-4 object-contain" />
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
              <span className="tracking-wide text-[10px] uppercase font-black">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-4">
          <Link to="/login" className="flex items-center gap-4 px-6 py-4 rounded-[16px] bg-white/10 hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-widest group">
            <span className="text-xl group-hover:translate-x-1 transition-transform">📤</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-l-[80px] relative z-20 flex flex-col overflow-hidden shadow-[-30px_0_50px_rgba(0,0,0,0.1)] p-12 overflow-y-auto no-scrollbar">
          
          <header className="mb-10">
              <h1 className="text-3xl font-black text-[#5a1620] mb-2 italic">Profile Settings: Kwame Mensah (Alumni Mentor)</h1>
          </header>

          <div className="grid grid-cols-12 gap-8">
              
              {/* Primary Profile Section */}
              <div className="col-span-12 lg:col-span-7 grid grid-rows-auto gap-8">
                  
                  {/* Avatar & Basic Info Card */}
                  <div className="bg-[#fffafa] rounded-[48px] p-10 flex items-center gap-8 shadow-sm border border-red-50 relative group">
                      <div className="relative">
                          <img src={mentorImg} alt="Kwame Mensah" className="w-32 h-32 rounded-[40px] object-cover border-4 border-white shadow-xl" />
                          <button className="absolute -top-2 -right-2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-[#7b2228] hover:scale-110 transition-transform">✎</button>
                      </div>
                      <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                              <div>
                                  <h2 className="text-3xl font-black text-[#0f172a] mb-1">Kwame Mensah</h2>
                                  <p className="text-xs font-bold text-gray-400">kwame.mensah@alumninetwork.edu</p>
                              </div>
                              <button className="text-gray-300 hover:text-[#7b2228] transition-colors">🖊️</button>
                          </div>
                          <span className="bg-[#fee2e2] text-[#7b2228] px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">SENIOR MENTOR</span>
                          <div className="flex gap-8 mt-6">
                              <div>
                                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">LAST LOGIN</p>
                                  <p className="text-[11px] font-black text-[#0f172a]">Today, 09:42 AM</p>
                              </div>
                              <div>
                                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">PROFILE UPDATED</p>
                                  <p className="text-[11px] font-black text-[#0f172a]">Jan 12, 2024</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Mentorship Philosophy Card */}
                  <div className="bg-[#fcfcfc] rounded-[48px] p-10 shadow-sm border border-gray-50 flex flex-col gap-8 relative">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-black text-[#5a1620] max-w-[200px] italic">Mentorship Philosophy & Interests</h3>
                          <button className="bg-[#fff5f5] text-[#7b2228] px-6 py-2 rounded-xl text-[9px] font-black flex items-center gap-2 hover:bg-[#7b2228] hover:text-white transition-all">✎ Edit</button>
                      </div>
                      
                      <div>
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Career Industries</p>
                          <div className="flex flex-wrap gap-2">
                              {['Telecom', 'Engineering', 'IT', 'Software Development'].map(tag => (
                                  <span key={tag} className="bg-white border-2 border-[#fff5f5] px-5 py-2 rounded-2xl text-[10px] font-bold text-gray-500">{tag}</span>
                              ))}
                          </div>
                      </div>

                      <div>
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Career Goals</p>
                          <div className="flex flex-wrap gap-2">
                              {['Career Transitions', 'System Design', 'editable'].map(tag => (
                                  <span key={tag} className="bg-white border-2 border-[#fff5f5] px-5 py-2 rounded-2xl text-[10px] font-bold text-gray-500 italic">{tag}</span>
                              ))}
                          </div>
                      </div>

                      <div className="mt-4">
                          <p className="text-[10px] font-black text-[#0f172a] uppercase mb-4 tracking-tighter">My Mentorship Style: What Students Can Expect</p>
                          <div className="bg-[#fffafa] border-2 border-[#fee2e2]/30 p-8 rounded-[32px] italic text-[13px] font-bold text-gray-500 leading-relaxed">
                              "I believe in practical guidance and real-world projects. I offer structured check-ins, and active access to enhances and connection to real world material."
                          </div>
                      </div>
                  </div>
              </div>

              {/* Story & Side Info Section */}
              <div className="col-span-12 lg:col-span-5 grid grid-rows-auto gap-8">
                  
                  {/* Bio Card */}
                  <div className="bg-[#fffafa] rounded-[48px] p-10 shadow-sm border border-red-50 flex flex-col gap-6 relative">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="text-xl font-black text-[#0f172a] mb-1">My Story: Alumni</h3>
                              <p className="text-3xl font-black text-[#5a1620] italic">Bio</p>
                          </div>
                          <button className="flex flex-col items-center gap-1 group">
                              <span className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-xs group-hover:scale-110 transition-transform">🖊️</span>
                              <span className="text-[8px] font-black text-[#7b2228] uppercase tracking-tighter">Edit Story</span>
                          </button>
                      </div>
                      <p className="text-[13px] font-medium text-gray-400 leading-7">
                          A passionate engineer with a journey that began at Ashesi. I'm dedicated to helping the next generation and enthusiasts guidance and educational to environmental concerns about in next generation, is for student-interest reading.
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                      {/* Professional History Snippet */}
                      <div className="col-span-2 bg-white rounded-[40px] p-10 shadow-xl border border-gray-50 flex flex-col min-h-[500px] relative">
                         <div className="flex flex-col gap-1 mb-10">
                            <h3 className="text-xl font-black text-[#0f172a]">Professional Details</h3>
                            <p className="text-2xl font-black text-[#5a1620] italic">& Experience</p>
                         </div>
                         
                         <div className="bg-[#fffcfc] border-2 border-red-50/20 p-8 rounded-[32px] flex-1">
                             <div className="flex justify-between items-start mb-6">
                                 <h4 className="text-lg font-black text-[#0f172a]">Career History &<br/>Key Projects</h4>
                                 <button className="text-[10px] font-black text-[#7b2228] flex items-center gap-2">🖊️ Edit Career Details</button>
                             </div>
                             
                             <div className="space-y-6">
                                 <div>
                                     <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Company: MTN Ghana</p>
                                     <p className="text-xs font-black text-gray-500">Job Title: Senior Network Engineer</p>
                                 </div>
                                 <div>
                                     <p className="text-[10px] font-black text-gray-300 uppercase mb-3">Key Professional Projects:</p>
                                     <ul className="text-xs font-bold text-gray-400 space-y-2 list-inside list-disc">
                                         <li>Project: Submarine Cable Landing</li>
                                         <li>Project: Comprehensive Development</li>
                                         <li>Project: Serious Professionals Development</li>
                                     </ul>
                                 </div>
                                 <div className="pt-4">
                                     <p className="text-[10px] font-black text-gray-300 uppercase mb-3 text-center">Career Highlights:</p>
                                     <ul className="text-xs font-bold text-gray-400 space-y-4">
                                         <li className="flex items-center gap-4 group">
                                             <span className="w-1.5 h-1.5 bg-[#7b2228] rounded-full"></span>
                                             <span>Highlight: IEEE Africa Innovation Award</span>
                                         </li>
                                         <li className="flex items-center gap-4 group">
                                             <span className="w-1.5 h-1.5 bg-[#7b2228] rounded-full"></span>
                                             <span>Highlight: IEEE Africa Innovation Award</span>
                                         </li>
                                     </ul>
                                 </div>
                             </div>
                             
                             <button className="mt-10 w-full bg-[#fff5f5] text-[#7b2228] py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#7b2228] hover:text-white transition-all shadow-sm">
                                🖊️ Edit Career Details
                             </button>
                         </div>
                      </div>

                      {/* Side Small Details */}
                      <div className="col-span-2 flex flex-col gap-8">
                          
                          {/* Personal Details */}
                          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 relative group">
                              <div className="flex justify-between items-start mb-10">
                                  <h3 className="text-2xl font-black text-[#0f172a]">Personal Details</h3>
                                  <button className="text-[9px] font-black text-[#7b2228] flex items-center gap-2">🖊️ Edit</button>
                              </div>
                              <div className="grid grid-cols-2 gap-y-10">
                                  <div>
                                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1 tracking-tighter">PHONE NUMBER</p>
                                      <p className="text-[11px] font-black text-[#0f172a]">***********</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1 tracking-tighter">LOCATION</p>
                                      <p className="text-[11px] font-black text-[#0f172a]">Accra, Ghana</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1 tracking-tighter">MAJOR/DEPARTMENT</p>
                                      <span className="bg-gray-50 px-5 py-2 rounded-2xl text-[10px] font-black text-gray-500 uppercase">Engineering</span>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1 tracking-tighter">YEAR OF GRADUATION</p>
                                      <span className="bg-gray-50 px-5 py-2 rounded-2xl text-[10px] font-black text-gray-500">2005</span>
                                  </div>
                              </div>
                          </div>

                          {/* Verification Log */}
                          <div className="bg-[#fffafa] rounded-[40px] p-10 shadow-sm border border-red-50 flex flex-col gap-8">
                              <h3 className="text-2xl font-black text-[#5a1620] italic text-center">Verification Status & Account Log</h3>
                              <div className="space-y-6">
                                  <div className="flex justify-between items-center text-[11px]">
                                      <span className="font-bold text-gray-400">Grads Year Year Verified</span>
                                      <span className="font-black text-[#0f172a] flex items-center gap-2">Status: <span className="text-[#16a34a]">✓ Yes</span></span>
                                  </div>
                                  <div className="flex justify-between items-center text-[11px]">
                                      <span className="font-bold text-gray-400">ID Verified</span>
                                      <span className="font-black text-[#0f172a] flex items-center gap-2">Status: <span className="text-[#16a34a]">✓ Yes</span></span>
                                  </div>
                                  <div className="pt-4 border-t border-red-100/50 flex justify-between items-center text-[11px]">
                                      <span className="font-bold text-gray-400">Account Created</span>
                                      <span className="font-black text-gray-500">Date: "2022-09-01"</span>
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

              </div>

          </div>

        </main>
      </div>
  )
}
