import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, Play, CheckCircle, Clock, Grid, Megaphone, User, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../../components/WelcomeScreen';
import ThemeToggle from '../../components/ThemeToggle';
import { generateResultPdf } from '../../utils/PdfGenerator';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const { exams, getAttempts } = useExam();
    const { notices } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const [attempts, setAttempts] = useState([]);
    const [showWelcome, setShowWelcome] = useState(location.state?.fromLogin || false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'

    useEffect(() => {
        if (showWelcome) {
            const timer = setTimeout(() => {
                setShowWelcome(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWelcome]);

    useEffect(() => {
        if (user) {
            getAttempts(user._id).then(data => setAttempts(data));
        }
    }, [user, getAttempts]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getExamStatus = (examId) => {
        // In MongoDB attempt.examId might be an object due to populate, or just ID
        const attempt = attempts.find(a => {
            const id = typeof a.examId === 'object' ? a.examId._id : a.examId;
            return id === examId;
        });
        return attempt ? attempt : null;
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
        const attempt = getExamStatus(exam._id);
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'completed' && attempt) ||
            (filterStatus === 'pending' && !attempt);
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <AnimatePresence>
                {showWelcome && (
                    <WelcomeScreen
                        name={user?.name}
                        onComplete={() => setShowWelcome(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
            >
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--secondary-color)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Student Dashboard</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', padding: '0.15rem 0.5rem', background: 'var(--border-color)', borderRadius: '1rem', width: 'fit-content' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{user?.name}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem' }}>
                            <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Logout
                        </button>
                    </div>
                </header>

                <div style={{ display: 'flex', flex: 1 }}>
                    {/* Sidebar */}
                    <aside style={{ width: '250px', background: 'var(--surface-color)', borderRight: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Menu</h3>

                        {[
                            { icon: GraduationCap, label: 'Dashboard', path: '/student-dashboard', color: 'var(--primary-color)' },
                            { icon: User, label: 'Profile', path: '/profile', color: '#ec4899' },
                            { icon: Megaphone, label: 'Notice Board', path: '/student/notices', color: '#06b6d4' },
                            { icon: Clock, label: 'View Timetable', path: '/student/timetable', color: '#f97316' },
                            { icon: Grid, label: 'Seating Arrangement', path: '/student/seating', color: '#8b5cf6' }
                        ].map((item, index) => (
                            <motion.button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <item.icon size={18} color={item.color} /> {item.label}
                            </motion.button>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main style={{ flex: 1, padding: '2rem', background: 'var(--background-color)', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Available Exams</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Select an exam to start</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                                <input
                                    type="text"
                                    placeholder="Search exams..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-color)',
                                        color: 'var(--text-primary)',
                                        outline: 'none'
                                    }}
                                />
                                <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--surface-color)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    minWidth: '150px'
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
                            {/* Exams Section */}
                            <div>
                                {filteredExams.length === 0 ? (
                                    <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface-color)' }}>
                                        <div style={{ background: 'var(--background-color)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                            <GraduationCap size={32} color="var(--text-secondary)" />
                                        </div>
                                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{searchTerm || filterStatus !== 'all' ? 'No matching exams' : 'No exams available'}</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Check back later for new exams.'}</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {filteredExams.map((exam, index) => {
                                            const attempt = getExamStatus(exam._id);
                                            return (
                                                <motion.div
                                                    key={exam._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                                    className="card"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        position: 'relative',
                                                        background: 'var(--surface-color)',
                                                        borderTop: attempt ? '4px solid var(--success-color)' : '4px solid var(--primary-color)'
                                                    }}
                                                >
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>{exam.title}</h4>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {exam.duration} mins</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> {exam.questions.length} Qs</span>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: 'auto' }}>
                                                        {attempt ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                <div style={{ background: 'var(--border-color)', color: 'var(--success-color)', padding: '0.6rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                                                                    <CheckCircle size={16} />
                                                                    Completed: {attempt.score}/{exam.questions.length}
                                                                </div>
                                                                <button
                                                                    onClick={() => generateResultPdf(user, exam, attempt)}
                                                                    className="btn"
                                                                    style={{
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '0.5rem',
                                                                        padding: '0.6rem',
                                                                        background: 'transparent',
                                                                        border: '1px solid var(--border-color)',
                                                                        color: 'var(--text-primary)',
                                                                        fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    <Download size={14} /> Download Certificate
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(`/take-exam/${exam._id}`)}
                                                                className="btn btn-primary"
                                                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem' }}
                                                            >
                                                                <Play size={16} /> Start Now
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Recent Notices Preview */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="card" style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Megaphone size={18} color="var(--secondary-color)" /> Recent Notices
                                        </h3>
                                        <button
                                            onClick={() => navigate('/student/notices')}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                        >
                                            View All
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {notices.length === 0 ? (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No announcements.</p>
                                        ) : (
                                            notices.slice(0, 3).map(notice => (
                                                <div key={notice._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{notice.title}</h4>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.4rem' }}>
                                                        {notice.content}
                                                    </p>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(notice.createdAt || notice.date).toLocaleDateString()}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="card"
                                    style={{ background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', color: 'white', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}
                                >
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Need Help?</h3>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>Contact administration for any login or exam issues.</p>
                                        <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: '500' }}>
                                            Support Center
                                        </button>
                                    </div>
                                    <GraduationCap size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
                                </motion.div>
                            </div>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    );
};

export default StudentDashboard;
