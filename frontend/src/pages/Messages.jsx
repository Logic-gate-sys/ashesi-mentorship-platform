import { Link } from 'react-router-dom'
import logoImg from '../assets/Ashesi Logo.jpeg'
import amaImg from '../assets/Ama M.jpeg'
import alexImg from '../assets/Daniel K.jpeg'
import fredImg from '../assets/Prince A.jpeg'
import aminaImg from '../assets/Jessica A.jpeg'
import ahmadImg from '../assets/Kwesi Mensah.jpeg'
import halimaImg from '../assets/Dounia D.jpeg'

const sidebarItems = [
    { label: 'Home', icon: '🏠', active: false, path: '/dashboard' },
    { label: 'My Profile', icon: '👤', active: false, path: '/profile' },
    { label: 'Find a Mentor', icon: '🔍', active: false, path: '/find-mentor' },
    { label: 'My Requests', icon: '📋', active: false, path: '/requests' },
    { label: 'Messages', icon: '💬', active: true, path: '/messages' },
    { label: 'Meetings', icon: '📅', active: false, path: '/meetings' },
    { label: 'Feedback', icon: '⭐', active: false, path: '/feedback' },
]

const contacts = [
    { name: 'Ama K.', role: 'Software Engineer @ Google', lastMsg: 'Thanks for the feedback on my...', status: 'ONLINE', active: false, image: amaImg },
    { name: 'Alex O.', role: 'Product Manager @ Microsoft', lastMsg: 'I\'ve attached the project roadmap...', status: '10:15 AM', unread: 1, active: true, image: alexImg },
    { name: 'Fred M.', role: 'Entrepreneur & Investor', lastMsg: 'Let\'s connect next Tuesday for the...', status: 'YESTERDAY', active: false, image: fredImg },
    { name: 'Amina K.', role: 'Business Analyst @ Bank of America', lastMsg: 'Have you identified what...', status: 'ONLINE', active: false, image: aminaImg },
    { name: 'Ahmad N.', role: 'Game Designer', lastMsg: 'I really appreciate our last...', status: 'YESTERDAY', active: false, image: ahmadImg },
    { name: 'Halima S.', role: 'Business Lawyer', lastMsg: 'Does our next meeting...', status: 'YESTERDAY', active: false, image: halimaImg },
]

export default function Messages() {
    return (
        <div className="h-screen w-full bg-[#7b2228] flex flex-row items-stretch overflow-hidden text-gray-800 font-arial">

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

            {/* Main Container - Concave curve on the boundary */}
            <div className="flex-1 bg-white rounded-l-[80px] relative z-20 shadow-[-30px_0_50px_rgba(0,0,0,0.1)] flex flex-row overflow-hidden">

                {/* Contacts Panel */}
                <div className="w-[380px] border-r border-gray-100 flex flex-col pt-12 pb-8 bg-[#fdf8f8]">
                    <div className="px-10 mb-8">
                        <h1 className="text-3xl font-black text-[#7b2228] mb-6">Messages</h1>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <span className="text-lg text-gray-400">🔍</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-white border border-gray-200 rounded-full py-4 pl-14 pr-6 text-xs focus:outline-none focus:border-[#7b2228] shadow-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {contacts.map((contact, i) => (
                            <div key={i} className={`px-8 py-5 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${contact.active ? 'bg-white border-[#7b2228] shadow-sm' : 'border-transparent hover:bg-white/50'
                                }`}>
                                <div className="relative shrink-0">
                                    <img src={contact.image} alt={contact.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                    {contact.status === 'ONLINE' && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-base font-black text-[#0f172a] truncate">{contact.name}</h3>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${contact.unread ? 'text-[#7b2228]' : 'text-gray-300'}`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400 mb-1 truncate">{contact.role}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[11px] text-gray-500 truncate leading-tight">{contact.lastMsg}</p>
                                        {contact.unread && <span className="w-5 h-5 bg-[#7b2228] text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{contact.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat window */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat header */}
                    <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between shadow-sm relative z-10">
                        <div className="flex items-center gap-4">
                            <img src={contacts[1].image} alt="Alex" className="w-12 h-12 rounded-full object-cover shadow-md" />
                            <div>
                                <h2 className="text-lg font-black text-[#0f172a] leading-tight">Alex O.</h2>
                                <p className="text-xs font-bold text-gray-400">Product Manager • Microsoft</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-gray-400">
                            <button className="hover:text-[#7b2228] transition-colors text-xl">📹</button>
                            <button className="hover:text-[#7b2228] transition-colors text-xl">📞</button>
                            <button className="hover:text-[#7b2228] transition-colors text-xl">⋮</button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.98]">

                        <div className="flex justify-center mb-4">
                            <span className="px-6 py-2 bg-gray-50 rounded-full text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Today, October 24</span>
                        </div>

                        {/* Received Message */}
                        <div className="flex items-start gap-4 max-w-[80%]">
                            <img src={contacts[1].image} alt="Alex" className="w-10 h-10 rounded-full object-cover shadow-sm mt-1" />
                            <div>
                                <div className="bg-[#fdf4f4] p-6 rounded-[30px] rounded-tl-none border border-[#f5e1e2] shadow-sm">
                                    <p className="text-sm font-medium leading-relaxed">Hi Kofi! I hope you're having a productive morning. I've been reviewing the mentorship goals we set last week.</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 ml-2 mt-2 inline-block">10:12 AM</span>
                            </div>
                        </div>

                        {/* Sent Message */}
                        <div className="flex items-start gap-4 max-w-[80%] ml-auto flex-row-reverse">
                            <div className="text-right">
                                <div className="bg-[#7b2228] p-6 rounded-[30px] rounded-tr-none shadow-xl">
                                    <p className="text-sm font-medium text-white text-left">Morning Alex! Yes, everything is moving along well. I'm actually finishing up that research proposal right now.</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 mr-2 mt-2 inline-block">10:14 AM</span>
                            </div>
                        </div>

                        {/* Received Message with attachment */}
                        <div className="flex items-start gap-4 max-w-[80%]">
                            <img src={contacts[1].image} alt="Alex" className="w-10 h-10 rounded-full object-cover shadow-sm mt-1" />
                            <div>
                                <div className="bg-[#fdf4f4] p-6 rounded-[30px] rounded-tl-none border border-[#f5e1e2] shadow-sm">
                                    <p className="text-sm font-medium leading-relaxed mb-4">That's great to hear. I've attached the project roadmap for the next quarter. Take a look when you can and let's discuss during our 1:1.</p>
                                    <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 group cursor-pointer hover:border-[#7b2228] transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <p className="text-xs font-black text-[#0f172a]">Q4_Roadmap_Final.pdf</p>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase">2.4 MB</p>
                                            </div>
                                        </div>
                                        <span className="text-xl text-gray-300 group-hover:text-[#7b2228] transition-colors">📥</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 ml-2 mt-2 inline-block">10:15 AM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="px-10 py-10 bg-white">
                        <div className="relative flex items-center gap-4">
                            <div className="flex-1 bg-gray-50 rounded-full px-8 py-5 flex items-center border border-transparent focus-within:border-[#7b2228] transition-all shadow-inner">
                                <button className="text-xl text-gray-300 hover:text-[#7b2228] transition-colors mr-4">📎</button>
                                <input
                                    type="text"
                                    placeholder="Type a message to Alex..."
                                    className="w-full bg-transparent text-sm font-medium focus:outline-none"
                                />
                            </div>
                            <button className="w-16 h-16 bg-[#7b2228] text-white rounded-full flex items-center justify-center text-2xl shadow-2xl hover:bg-[#5a1620] hover:scale-105 active:scale-95 transition-all">
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
