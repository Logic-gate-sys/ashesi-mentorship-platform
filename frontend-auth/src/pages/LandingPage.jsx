import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-inter text-[#333]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-[#eee] py-4 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#b01e43] rounded-xl flex items-center justify-center shadow-lg shadow-[#b01e43]/20">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-[#1a1a1a] text-xl leading-tight">AshesiConnect</span>
                            <span className="text-[0.65rem] font-bold text-[#888] uppercase tracking-widest">Alumni Mentorship</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="hidden md:block text-[#666] font-semibold text-sm hover:text-[#b01e43] transition-colors">Log in</Link>
                        <Link to="/register" className="bg-[#b01e43] text-white py-2.5 px-6 rounded-xl font-bold text-sm hover:scale-105 transition-transform">Join Platform</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-extrabold text-[#1a1a1a] mb-8 leading-[1.1]">
                        Empowering the next generation of <span className="text-[#b01e43]">Ashesi Leaders.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-12 leading-relaxed">
                        A dedicated platform connecting students with alumni mentors to bridge the gap between classroom theory and industry excellence.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full md:w-auto bg-[#b01e43] text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-[#b01e43]/25 hover:scale-[1.02] active:scale-95 transition-all">
                            Get Started
                        </Link>
                        <Link to="/login" className="w-full md:w-auto border-2 border-[#eee] text-[#333] py-4 px-10 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors">
                            Find a Mentor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Industry Insights', desc: 'Connect with alumni working in top companies globally and gain first-hand industry knowledge.', color: 'bg-[#FFEFE5]' },
                        { title: 'Personalized Coaching', desc: 'Receive one-on-one guidance tailored to your specific career goals and academic journey.', color: 'bg-[#F0EFFF]' },
                        { title: 'Networking', desc: 'Build professional relationships that last beyond graduation and open doors to new opportunities.', color: 'bg-[#FFF9E5]' }
                    ].map((feature, i) => (
                        <div key={i} className="p-12 bg-white rounded-3xl border border-[#eee] hover:shadow-2xl hover:shadow-black/5 transition-all duration-300">
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl mb-8`}></div>
                            <h3 className="font-extrabold text-2xl mb-4 leading-tight">{feature.title}</h3>
                            <p className="text-[#666] leading-relaxed line-clamp-3">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-[#eee] text-center">
                <p className="text-[#888] text-sm font-medium">© 2026 Ashesi University. All rights reserved.</p>
            </footer>
        </div>
    )
}
