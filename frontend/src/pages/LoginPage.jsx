import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../assets/login background.jpeg';

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-tr-[220px] rounded-br-[220px]">
                <img src={loginBg} alt="Login background" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-red-950/30 backdrop-blur-sm"></div>
                <div className="relative z-10 text-white text-center px-10 lg:px-16 max-w-lg">
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">Discover Your Path. Welcome to Ashesi Mentorship!</h1>
                    <p className="text-base font-medium text-white/90 mb-12">Connect with alumni and peers.</p>
                    <Link to="/register" className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-red-900">Create Account</Link>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Welcome Back</h2>
                    <form onSubmit={handleLogin} className="space-y-6 bg-white px-4 py-6 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 h-14 bg-white">
                            <input
                                type="text"
                                placeholder="Username"
                                className="flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-900 opacity-70">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>

                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 h-14 bg-white">
                            <input
                                type="password"
                                placeholder="Password"
                                className="flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-900 opacity-70">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-sm font-semibold text-red-900 hover:underline">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full rounded-2xl bg-red-900 py-4 text-base font-bold text-white transition hover:bg-red-800">Login</button>

                        <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span>Or, log in with:</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <div className="flex justify-center gap-6 pt-2 text-sm font-semibold text-gray-700">
                            <button type="button" className="flex items-center gap-2 text-gray-700 hover:text-red-900">
                                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/></svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center gap-2 text-gray-700 hover:text-red-900">
                                <svg viewBox="0 0 24 24" width="18" height="18"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
                                Microsoft
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
