import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerBg from '../assets/register-bg.jpg';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        bio: '', 
        linkedin: '', 
        role: '', 
        profilePic: null 
    });
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
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
        formSection: {
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
        },
        formWrapper: {
            width: '100%',
            maxWidth: '380px',
            textAlign: 'center',
        },
        stepText: {
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#b01e43',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '0.5rem',
        },
        stepIndicator: {
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
        },
        dot: (active) => ({
            width: '30px',
            height: '4px',
            borderRadius: '50px',
            backgroundColor: active ? '#b01e43' : '#eee',
            transition: 'background-color 0.3s',
        }),
        formTitle: {
            fontSize: '2.5rem',
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
        textareaBox: {
            position: 'relative',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            border: '1.5px solid #dcdcdc',
            borderRadius: '12px',
            padding: '1rem',
            minHeight: '110px',
        },
        textarea: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#444',
            backgroundColor: 'transparent',
            resize: 'none',
            fontFamily: 'inherit',
        },
        input: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
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
        fileInputWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
        },
        avatarPreview: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#f9f9f9',
            border: '2px dashed #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        uploadText: {
            fontSize: '0.8rem',
            fontWeight: '600',
            color: '#b01e43',
            cursor: 'pointer',
        },
        btnRow: {
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
            marginBottom: '2rem',
        },
        nextBtn: {
            flex: 2,
            padding: '1.1rem',
            backgroundColor: '#b01e43',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 8px 20px rgba(176, 30, 67, 0.3)',
        },
        backBtn: {
            flex: 1,
            padding: '1.1rem',
            backgroundColor: 'transparent',
            color: '#b01e43',
            border: '1.5px solid #b01e43',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
        },
        imageSection: {
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
            borderTopLeftRadius: '220px',
            borderBottomLeftRadius: '220px',
            overflow: 'hidden',
        },
        bgImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: '0.9',
        },
        overlay: {
            position: 'absolute',
            inset: 0,
            background: 'rgba(176, 30, 67, 0.75)',
        },
        heroContent: {
            position: 'relative',
            zIndex: 10,
            color: '#fff',
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '500px',
        },
        heroTitle: {
            fontSize: '2.8rem',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '1rem',
            fontFamily: "'Outfit', sans-serif",
        },
        heroSubtitle: {
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '4rem',
            fontFamily: "'Outfit', sans-serif",
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1.5px solid #ddd',
            borderRadius: '12px',
            marginTop: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 100,
            overflow: 'hidden',
        },
        option: {
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
        },
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({...form, profilePic: file});
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else navigate('/login');
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div style={styles.page}>
            <div style={styles.formSection}>
                <div style={styles.formWrapper}>
                    <div style={styles.stepText}>Step {step} of 4</div>
                    <div style={styles.stepIndicator}>
                        <div style={styles.dot(step >= 1)} />
                        <div style={styles.dot(step >= 2)} />
                        <div style={styles.dot(step >= 3)} />
                        <div style={styles.dot(step >= 4)} />
                    </div>
                    
                    <h1 style={styles.formTitle}>Registration</h1>
                    
                    <div style={{minHeight: '230px'}}>
                        {step === 1 && (
                            <div className="step-content">
                                <div style={styles.inputBox}>
                                    <input type="text" placeholder="Username" style={styles.input} value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                                </div>
                                <div style={styles.inputBox}>
                                    <input type="email" placeholder="Email" style={styles.input} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <div style={styles.inputBox}>
                                    <input type="password" placeholder="Password" style={styles.input} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                </div>
                                <div style={styles.inputBox}>
                                    <input type="password" placeholder="Confirm Password" style={styles.input} required />
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <div style={styles.textareaBox}>
                                    <textarea placeholder="Short Bio (e.g. your professional interests)" style={styles.textarea} value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
                                </div>
                                <div style={styles.inputBox}>
                                    <input type="url" placeholder="LinkedIn Profile Link" style={styles.input} value={form.linkedin} onChange={(e) => setForm({...form, linkedin: e.target.value})} />
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="step-content">
                                <div style={styles.fileInputWrapper}>
                                    <label style={styles.avatarPreview}>
                                        {previewUrl ? <img src={previewUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>}
                                        <input type="file" style={{display:'none'}} onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <span style={styles.uploadText}>Upload Picture (Optional)</span>
                                </div>
                                <div style={{...styles.inputBox, cursor: 'pointer', marginBottom:'0'}} onClick={() => setIsRoleOpen(!isRoleOpen)}>
                                    <div style={{ flex: 1, textAlign: 'left', color: form.role ? '#333' : '#999', fontSize: '1rem', fontWeight: '500' }}>{form.role || 'Final Step: Choose Role'}</div>
                                    <div style={styles.icon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11l-5-5-5 5M17 18l-5-5-5 5" /></svg></div>
                                    {isRoleOpen && <div style={styles.dropdown}><div style={styles.option} onClick={() => {setForm({...form, role: 'Student'}); setIsRoleOpen(false);}}>Student</div><div style={{...styles.option, borderTop: '1px solid #f9f9f9'}} onClick={() => {setForm({...form, role: 'Alumni / Mentor'}); setIsRoleOpen(false);}}>Alumni / Mentor</div><div style={{...styles.option, borderTop: '1px solid #f9f9f9'}} onClick={() => {setForm({...form, role: 'Admin'}); setIsRoleOpen(false);}}>Admin</div></div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.btnRow}>
                        {step > 1 && <button type="button" style={styles.backBtn} onClick={prevStep}>Back</button>}
                        <button type="button" style={styles.nextBtn} onClick={nextStep}>{step === 4 ? 'Complete' : 'Continue'}</button>
                    </div>

                    <div style={{...styles.divider, marginBottom: '0.5rem'}}><div style={styles.dividerLine}></div><span>Or login with:</span><div style={styles.dividerLine}></div></div>
                    <div style={styles.socialRow}>
                        <button type="button" style={styles.socialBtn}><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg><span>Google</span></button>
                        <button type="button" style={styles.socialBtn}><svg viewBox="0 0 24 24" width="20" height="20"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg><span>Microsoft</span></button>
                    </div>
                </div>
            </div>
            
            <div style={styles.imageSection}>
                <div style={styles.imageWrapper}>
                    <img src={registerBg} alt="Hero" style={styles.bgImage} />
                    <div style={styles.overlay} />
                </div>
                <div style={styles.heroContent}>
                    <h2 style={styles.heroTitle}>Discover your Path.</h2>
                    <h3 style={styles.heroSubtitle}>Welcome Back!</h3>
                    <p style={styles.ctaText}>Already have an account?</p>
                    <Link to="/login" style={styles.loginBtn}>Login</Link>
                </div>
            </div>
        </div>
    );
}
