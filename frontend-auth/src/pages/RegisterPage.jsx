import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerBg from '../assets/Register background.jpeg';

export default function RegisterPage() {
    const [form, setForm] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: '' 
    });
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen w-full bg-white font-inter overflow-hidden">
            {/* Left Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-r-[160px] lg:-mr-40 relative z-20 shadow-2xl">
                <div className="w-full max-w-[380px] text-center pt-10">
                    <h1 className="text-4xl font-bold text-[#333] mb-12">Registration</h1>
                    
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                className="w-full border-2 border-[#b01e43]/20 rounded-xl py-3.5 px-5 pr-12 text-gray-700 outline-none focus:border-[#b01e43] transition-colors font-medium placeholder:text-gray-400"
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b01e43]">
                                <div className="w-8 h-8 rounded-full bg-[#b01e43]/5 flex items-center justify-center border border-[#b01e43]/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full border-2 border-[#b01e43]/20 rounded-xl py-3.5 px-5 pr-12 text-gray-700 outline-none focus:border-[#b01e43] transition-colors font-medium placeholder:text-gray-400"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b01e43]">
                                <div className="w-8 h-8 rounded-full bg-[#b01e43]/5 flex items-center justify-center border border-[#b01e43]/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full border-2 border-[#b01e43]/20 rounded-xl py-3.5 px-5 pr-12 text-gray-700 outline-none focus:border-[#b01e43] transition-colors font-medium placeholder:text-gray-400"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b01e43]">
                                <div className="w-8 h-8 rounded-full bg-[#b01e43]/5 flex items-center justify-center border border-[#b01e43]/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative pt-2">
                            <select 
                                className="w-full border-2 border-[#b01e43]/20 rounded-xl py-3.5 px-5 pr-12 text-gray-700 outline-none focus:border-[#b01e43] transition-colors appearance-none bg-transparent font-medium"
                                value={form.role}
                                onChange={(e) => setForm({...form, role: e.target.value})}
                                required
                            >
                                <option value="" disabled>Choose Role</option>
                                <option value="Student">Student</option>
                                <option value="Mentor">Alumni / Mentor</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b01e43] mt-1 pointer-events-none">
                                <div className="w-8 h-8 rounded-full bg-[#b01e43]/5 flex items-center justify-center border border-[#b01e43]/20">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11l5-5 5 5M7 18l5-5 5 5" /></svg>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4.5 bg-[#b01e43] text-white rounded-2xl font-bold text-xl shadow-xl shadow-[#b01e43]/40 hover:scale-[1.01] active:scale-95 transition-all mt-10">
                            Registration
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-4 my-10">
                        <div className="flex-1 h-[1.5px] bg-gray-200"></div>
                        <span className="text-[#b01e43] text-[0.9rem] font-bold whitespace-nowrap">Or login with:</span>
                        <div className="flex-1 h-[1.5px] bg-gray-200"></div>
                    </div>

                    <div className="flex justify-center flex-wrap gap-8">
                        <button className="flex items-center gap-3 text-gray-600 font-bold hover:text-[#b01e43] transition-colors">
                            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-6 h-6" />
                            <span className="text-lg">Google Workspace</span>
                        </button>
                        <button className="flex items-center gap-3 text-gray-600 font-bold hover:text-[#b01e43] transition-colors">
                            <div className="flex flex-wrap w-6 h-6">
                                <rect x="0" y="0" className="w-[11px] h-[11px] bg-[#F25022] mr-[2px] mb-[2px]"/>
                                <rect x="0" y="0" className="w-[11px] h-[11px] bg-[#7FBA00] mb-[2px]"/>
                                <rect x="0" y="0" className="w-[11px] h-[11px] bg-[#00A4EF] mr-[2px]"/>
                                <rect x="0" y="0" className="w-[11px] h-[11px] bg-[#FFB900]"/>
                            </div>
                            <span className="text-lg">Microsoft</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="relative flex-[1.4] hidden lg:flex items-center justify-center">
                <img src={registerBg} alt="Mentorship" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#b01e43]/40" />
                <div className="relative z-10 text-white text-center p-12 max-w-lg">
                    <h1 className="text-4xl font-bold mb-2 leading-tight">Discover your Path.</h1>
                    <h2 className="text-3xl font-bold mb-6 italic leading-tight">Welcome Back!</h2>
                    <div className="mt-8">
                        <p className="text-sm font-semibold mb-6">Already have on account?</p>
                        <Link to="/login" className="inline-block px-10 py-3 border-2 border-white rounded-xl text-white font-bold transition-all hover:bg-white hover:text-[#b01e43]">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
