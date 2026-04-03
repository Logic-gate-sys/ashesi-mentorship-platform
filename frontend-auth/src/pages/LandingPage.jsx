import { Link } from 'react-router-dom'

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        fontFamily: "'Inter', sans-serif",
        color: '#333',
        textAlign: 'left'
    },
    nav: {
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        padding: '1rem 1.5rem'
    },
    navInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'between'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    logoBox: {
        width: '40px',
        height: '40px',
        backgroundColor: '#b01e43',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(176, 30, 67, 0.2)'
    },
    logoText: {
        display: 'flex',
        flexDirection: 'column'
    },
    hero: {
        padding: '10rem 1.5rem 5rem',
        textAlign: 'center'
    },
    heroTitle: {
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontWeight: '800',
        color: '#1a1a1a',
        maxWidth: '900px',
        margin: '0 auto 2rem',
        lineHeight: 1.1
    },
    primaryText: {
        color: '#b01e43'
    },
    heroSub: {
        fontSize: '1.25rem',
        color: '#666',
        maxWidth: '650px',
        margin: '0 auto 3rem',
        lineHeight: 1.6
    },
    btnPrimary: {
        backgroundColor: '#b01e43',
        color: '#fff',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
        boxShadow: '0 10px 20px rgba(176, 30, 67, 0.2)',
        transition: 'transform 0.2s'
    },
    btnOutline: {
        border: '2px solid #eee',
        color: '#333',
        padding: '1rem 2.5rem',
        borderRadius: '12px',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
        marginLeft: '1rem'
    },
    section: {
        padding: '6rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
    }
};

export default function LandingPage() {
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <div style={{...styles.navInner, display: 'flex', justifyContent: 'space-between'}}>
                    <div style={styles.logo}>
                        <div style={styles.logoBox}>
                            <span style={{color: '#fff', fontWeight: 'bold', fontSize: '1.2rem'}}>A</span>
                        </div>
                        <div style={styles.logoText}>
                            <span style={{fontWeight: '800', color: '#1a1a1a', fontSize: '1.2rem'}}>AshesiConnect</span>
                            <span style={{fontSize: '0.65rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px'}}>Alumni Mentorship</span>
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                        <Link to="/login" style={{textDecoration: 'none', color: '#666', fontWeight: '600', fontSize: '0.9rem'}}>Log in</Link>
                        <Link to="/register" style={{...styles.btnPrimary, padding: '0.6rem 1.5rem', fontSize: '0.9rem', boxShadow: 'none'}}>Join Platform</Link>
                    </div>
                </div>
            </nav>

            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>
                    Empowering the next generation of <span style={styles.primaryText}>Ashesi Leaders.</span>
                </h1>
                <p style={styles.heroSub}>
                    A dedicated platform connecting students with alumni mentors to bridge the gap between classroom theory and industry excellence.
                </p>
                <div>
                    <Link to="/register" style={styles.btnPrimary}>Get Started</Link>
                    <Link to="/login" style={styles.btnOutline}>Find a Mentor</Link>
                </div>
            </section>

            <section style={styles.section}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
                    {[
                        { title: 'Industry Insights', desc: 'Connect with alumni working in top companies globally and gain first-hand industry knowledge.', color: '#FFEFE5' },
                        { title: 'Personalized Coaching', desc: 'Receive one-on-one guidance tailored to your specific career goals and academic journey.', color: '#F0EFFF' },
                        { title: 'Networking', desc: 'Build professional relationships that last beyond graduation and open doors to new opportunities.', color: '#FFF9E5' }
                    ].map((feature, i) => (
                        <div key={i} style={{padding: '3rem', backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #eee'}}>
                            <div style={{width: '60px', height: '60px', backgroundColor: feature.color, borderRadius: '15px', marginBottom: '2rem'}}></div>
                            <h3 style={{fontWeight: '800', fontSize: '1.5rem', marginBottom: '1rem'}}>{feature.title}</h3>
                            <p style={{color: '#666', lineHeight: 1.6}}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer style={{padding: '4rem 1.5rem', borderTop: '1px solid #eee', textAlign: 'center'}}>
                <p style={{color: '#888', fontSize: '0.9rem', fontWeight: '500'}}>© 2026 Ashesi University. All rights reserved.</p>
            </footer>
        </div>
    )
}

