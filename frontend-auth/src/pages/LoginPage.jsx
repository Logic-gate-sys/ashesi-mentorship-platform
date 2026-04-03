import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../assets/login-bg.jpg';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const styles = {
        page: {
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#fff',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
        },
        imageContainer: {
            position: 'relative',
            flex: '1.2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        imageWrapper: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderTopRightRadius: '220px',
            borderBottomRightRadius: '220px',
            overflow: 'hidden',
        },
        bgImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: '0.8',
        },
        overlay: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(176, 30, 67, 0.6), rgba(130, 10, 45, 0.7))',
        },
        heroContent: {
            position: 'relative',
            zIndex: 10,
            color: '#fff',
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '450px',
        },
        heroTitle: {
            fontSize: '2.5rem',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '1rem',
            fontFamily: "'Outfit', sans-serif",
        },
        heroSubtitle: {
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '3.5rem',
            opacity: 0.95,
        },
        ctaText: {
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '1.2rem',
        },
        ctaButton: {
            display: 'inline-block',
            padding: '0.9rem 2.8rem',
            border: '2px solid #fff',
            borderRadius: '10px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.9rem',
            transition: 'background 0.3s',
        },
        formSection: {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
        },
        formWrapper: {
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
        },
        formTitle: {
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#333',
            marginBottom: '2.5rem',
            fontFamily: "'Outfit', sans-serif",
        },
        inputBox: {
            position: 'relative',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #dcdcdc',
            borderRadius: '12px',
            padding: '0 1rem',
            height: '52px',
        },
        input: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#444',
            backgroundColor: 'transparent',
        },
        icon: {
            color: '#b01e43',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
        },
        forgotLink: {
            display: 'block',
            textAlign: 'right',
            color: '#b01e43',
            fontSize: '0.8rem',
            fontWeight: '700',
            textDecoration: 'none',
            marginTop: '0.5rem',
            marginBottom: '2.5rem',
        },
        loginBtn: {
            width: '100%',
            padding: '1.1rem',
            backgroundColor: '#b01e43',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(176, 30, 67, 0.4)',
            marginBottom: '2.5rem',
            fontFamily: 'inherit',
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            color: '#b01e43',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '2.5rem',
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            backgroundColor: '#e0e0e0',
        },
        socialRow: {
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
        },
        socialBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
        },
        brandG: { color: '#4285F4' },
        brandO: { color: '#EA4335' },
        brandOO: { color: '#FBBC05' },
        brandGL: { color: '#34A853' },
    };

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/student/dashboard');
    };

    return (
        <div style={styles.page}>
            {/* Left Image Section */}
            <div style={styles.imageContainer}>
                <div style={styles.imageWrapper}>
                    <img src={loginBg} alt="Meeting" style={styles.bgImage} />
                    <div style={styles.overlay} />
                </div>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Discover Your Path. Welcome to Ashesi Mentorship!</h1>
                    <p style={styles.heroSubtitle}>Connect with alumni and peers.</p>
                    <div style={{marginTop: '4rem'}}>
                        <p style={styles.ctaText}>Don't have an account</p>
                        <Link to="/register" style={styles.ctaButton}>Create Account</Link>
                    </div>
                </div>
            </div>

            {/* Right Form Section */}
            <div style={styles.formSection}>
                <div style={styles.formWrapper}>
                    <h2 style={styles.formTitle}>Welcome Back</h2>
                    
                    <form onSubmit={handleLogin}>
                        <div style={styles.inputBox}>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                style={styles.input}
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                required
                            />
                            <div style={styles.icon}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                        </div>

                        <div style={styles.inputBox}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                style={styles.input}
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                            />
                            <div style={{...styles.icon, cursor: 'pointer'}}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                        </div>

                        <a href="#" style={styles.forgotLink}>Forgot Password?</a>

                        <button type="submit" style={styles.loginBtn}>Login</button>
                    </form>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine}></div>
                        <span>Or, log in with:</span>
                        <div style={styles.dividerLine}></div>
                    </div>

                    <div style={styles.socialRow}>
                        <button type="button" style={styles.socialBtn}>
                            <svg viewBox="0 0 24 24" width="22" height="22">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>
                                <span style={styles.brandG}>G</span><span style={styles.brandO}>o</span><span style={styles.brandOO}>o</span><span style={styles.brandG}>g</span><span style={styles.brandGL}>l</span><span style={styles.brandO}>e</span> Workspace
                            </span>
                        </button>
                        <button type="button" style={styles.socialBtn}>
                            <svg viewBox="0 0 24 24" width="22" height="22">
                                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                            </svg>
                            <span>Microsoft</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
