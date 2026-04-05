import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-900 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-lg">AshesiConnect</span>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Alumni Mentorship</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="text-gray-600 font-semibold text-sm hover:text-gray-900">Log in</Link>
                        <Link to="/register" className="bg-red-900 text-white px-6 py-2 rounded-2xl font-bold text-sm hover:shadow-lg transition-shadow">Join Platform</Link>
                    </div>
                </div>
            </nav>

            <section className="pt-40 pb-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 max-w-4xl mx-auto mb-8 leading-tight">
                    Empowering the next generation of <span className="text-red-900">Ashesi Leaders.</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                    A dedicated platform connecting students with alumni mentors to bridge the gap between classroom theory and industry excellence.
                </p>
                <div className="space-x-4">
                    <Link to="/register" className="bg-red-900 text-white px-10 py-4 rounded-2xl font-bold inline-block hover:shadow-lg transition-shadow">Get Started</Link>
                    <Link to="/login" className="border-2 border-gray-200 text-gray-800 px-10 py-4 rounded-2xl font-bold inline-block hover:bg-gray-50">Find a Mentor</Link>
                </div>
            </section>

            <section className="py-16 px-6 max-w-6xl mx-auto">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { title: 'Industry Insights', desc: 'Connect with alumni working in top companies globally and gain first-hand industry knowledge.', icon: '📈' },
                        { title: 'Personalized Coaching', desc: 'Receive one-on-one guidance tailored to your specific career goals and academic journey.', icon: '🎯' },
                        { title: 'Networking', desc: 'Build professional relationships that last beyond graduation and open doors to new opportunities.', icon: '🤝' }
                    ].map((feature, i) => (
                        <div key={i} className="group overflow-hidden rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-red-900 text-2xl text-white shadow-md">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-xl text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="py-16 px-6 border-t border-gray-100 text-center">
                <p className="text-gray-600 text-sm font-medium">2026 Ashesi University.</p>
            </footer>
        </div>
    )
}
