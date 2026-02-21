import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    Calendar,
    ClipboardCheck,
    Grid,
    ShieldCheck,
    Zap,
    Award,
    ChevronRight,
    Github,
    Twitter,
    Linkedin
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div style={{ background: 'var(--background-color)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
            {/* Navbar */}
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 100,
                backdropFilter: 'blur(10px)',
                background: 'rgba(var(--surface-rgb), 0.8)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.25rem' }}>
                    <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                        <GraduationCap size={24} />
                    </div>
                    <span>ExamPro</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
                    <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>About</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn"
                        style={{ background: 'var(--primary-color)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '10rem 2rem 6rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top right, rgba(var(--primary-rgb), 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(var(--secondary-rgb), 0.05), transparent 40%)'
            }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span style={{
                        background: 'rgba(var(--primary-rgb), 0.1)',
                        color: 'var(--primary-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        ✨ The Future of Examination Management
                    </span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', margin: '1.5rem 0', letterSpacing: '-1px' }}>
                        Manage Exams with <br />
                        <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Precision & Intelligence</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                        From automated seating arrangements to real-time notifications.
                        The all-in-one platform for educational institutions to conduct exams seamlessly.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2.5rem', borderRadius: '3rem', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            Get Started Free <ChevronRight size={18} />
                        </button>
                        <button className="btn" style={{ padding: '1rem 2.5rem', borderRadius: '3rem', fontSize: '1rem', fontWeight: '600', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                            View Demo
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '6rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Everything you need</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Powerful tools designed for smooth institutional operations</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    {[
                        { icon: Grid, title: 'Smart Seating', desc: 'AI-driven automated seating arrangements with robust conflict resolution.', color: 'var(--primary-color)' },
                        { icon: ClipboardCheck, title: 'Live Attendance', desc: 'Real-time attendance tracking for exam coordinators and students.', color: 'var(--success-color)' },
                        { icon: Calendar, title: 'Dynamic Timetable', desc: 'Automatic schedule generation with instant push notifications for updates.', color: '#f97316' },
                        { icon: ShieldCheck, title: 'Secure Exams', desc: 'Role-based access control and encrypted data storage for high security.', color: '#ef4444' },
                        { icon: Zap, title: 'Instant Results', desc: 'Automated result compilation and professional certificate generation.', color: '#eab308' },
                        { icon: Award, title: 'Certificate Gen', desc: 'Generate high-quality PDF certificates for students instantly.', color: '#ec4899' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="card"
                            style={{ padding: '2rem', background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ background: `rgba(${feature.title === 'Smart Seating' ? 'var(--primary-rgb)' : '59, 130, 246'}, 0.1)`, width: '50px', height: '50px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <feature.icon size={24} style={{ color: feature.color }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                                <GraduationCap size={24} />
                            </div>
                            <span>ExamPro</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Empowering institutions with smart examination management solutions.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Product</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>Security</li>
                            <li>Demo</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Github size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                            <Twitter size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                            <Linkedin size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    © 2026 ExamPro. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
