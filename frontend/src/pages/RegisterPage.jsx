import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerBg from '../assets/Register background.jpeg';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        course: '',
        graduationYear: '',
        phoneNumber: '',
        linkedinUrl: '',
        role: '',
        profilePicture: null,
        profilePicturePreview: null,
        bio: ''
    });
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const navigate = useNavigate();

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({
                    ...form,
                    profilePicture: file,
                    profilePicturePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
        else {
            alert('Registration Completed! Welcome to AshesiConnect!');
            navigate('/login');
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            <div className="flex flex-1 items-center justify-center px-8 py-12">
                <div className="w-full max-w-xl bg-white p-10 rounded-tr-[180px] rounded-br-[180px] border border-gray-200 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Step {step} of 5</div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-10">Registration</h1>

                    <div className="space-y-4">
                        {step === 1 && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Course/Program"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.course}
                                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Graduation Year (e.g., 2024)"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.graduationYear}
                                    onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                    required
                                />
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full border border-gray-300 px-4 py-3 text-left text-sm text-gray-900 focus:outline-none focus:border-red-900"
                                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    >
                                        {form.role || 'Choose Role'}
                                    </button>
                                    {isRoleOpen && (
                                        <div className="absolute inset-x-0 top-full mt-2 rounded-xl border border-gray-300 bg-white text-sm shadow-lg">
                                            {['Student', 'Alumni', 'Mentor'].map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50"
                                                    onClick={() => { setForm({ ...form, role }); setIsRoleOpen(false); }}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <input
                                    type="url"
                                    placeholder="LinkedIn URL (optional)"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900"
                                    value={form.linkedinUrl}
                                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                                />
                                <textarea
                                    placeholder="Brief bio/about yourself (optional)"
                                    rows="4"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-900 resize-none"
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                />
                            </>
                        )}

                        {step === 5 && (
                            <>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-32 w-32 rounded-full border border-gray-300 bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {form.profilePicturePreview ? (
                                            <img src={form.profilePicturePreview} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="48" height="48" className="text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        )}
                                    </div>
                                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-red-900 px-6 py-3 text-sm font-bold text-red-900 hover:bg-red-50">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                                        Upload Photo
                                    </label>
                                </div>
                                <div className="space-y-2 rounded-3xl border border-gray-300 p-4 text-sm text-gray-700">
                                    <p><span className="font-semibold text-gray-900">Email:</span> {form.email}</p>
                                    <p><span className="font-semibold text-gray-900">Name:</span> {form.firstName} {form.lastName}</p>
                                    <p><span className="font-semibold text-gray-900">Course:</span> {form.course}</p>
                                    <p><span className="font-semibold text-gray-900">Grad Year:</span> {form.graduationYear}</p>
                                    <p><span className="font-semibold text-gray-900">Role:</span> {form.role}</p>
                                    <p><span className="font-semibold text-gray-900">Phone:</span> {form.phoneNumber}</p>
                                    {form.linkedinUrl && <p><span className="font-semibold text-gray-900">LinkedIn:</span> {form.linkedinUrl}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <div className="flex gap-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="button"
                                className="flex-1 rounded-full bg-red-900 px-5 py-3 text-sm font-bold text-white hover:bg-red-800"
                                onClick={nextStep}
                            >
                                {step === 5 ? 'Complete Registration' : 'Continue'}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span>Or login with:</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        <div className="flex justify-center gap-6 text-sm font-semibold text-gray-700">
                            <button type="button" className="flex items-center gap-2 text-gray-700 hover:text-red-900">
                                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/></svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center gap-2 text-gray-700 hover:text-red-900">
                                <svg viewBox="0 0 24 24" width="18" height="18"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
                                Microsoft
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-tl-[220px] rounded-bl-[220px]">
                <img src={registerBg} alt="Register background" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-red-950/30 backdrop-blur-sm"></div>
                <div className="relative z-10 text-white text-center px-10 lg:px-16 max-w-lg">
                    <h2 className="text-5xl font-bold leading-tight mb-6">Discover your Path.</h2>
                    <h3 className="text-4xl font-semibold mb-10">Welcome Back!</h3>
                    <p className="text-base text-white/85 mb-12">Already have an account?</p>
                    <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-red-900">Login</Link>
                </div>
            </div>
        </div>
    );
}
