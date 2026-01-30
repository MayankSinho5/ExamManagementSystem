import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Plus, Trash, FileText, Clock, Grid, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '../../components/WelcomeScreen';
import ThemeToggle from '../../components/ThemeToggle';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { exams, deleteExam } = useExam();
    const navigate = useNavigate();
    const location = useLocation();
    const [showWelcome, setShowWelcome] = React.useState(location.state?.fromLogin || false);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        if (showWelcome) {
            const timer = setTimeout(() => {
                setShowWelcome(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWelcome]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredExams = exams.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
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
                            { icon: User, label: 'My Profile', path: '/profile', color: '#ec4899' },
                            { icon: Plus, label: 'Create Exam', path: '/create-exam', color: 'var(--primary-color)' },
                            { icon: Plus, label: 'Manage Students', path: '/admin/students', color: 'var(--primary-color)' },
                            { icon: Clock, label: 'Timetable', path: '/admin/timetable', color: '#f97316' },
                            { icon: FileText, label: 'Notice Board', path: '/admin/notices', color: '#16a34a' },
                            { icon: Grid, label: 'Seating Arrangement', path: '/admin/seating', color: '#8b5cf6' }
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
                    <main style={{ flex: 1, padding: '2rem', background: 'var(--background-color)' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Exam Overview</h2>
                                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search exams..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 1rem 0.6rem 2.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--surface-color)',
                                            color: 'var(--text-primary)',
                                            outline: 'none'
                                        }}
                                    />
                                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/create-exam')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={18} /> New Exam
                            </button>
                        </div>

                        {filteredExams.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface-color)' }}>
                                <div style={{ background: 'var(--background-color)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <FileText size={40} color="var(--text-secondary)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{searchTerm ? 'No matching exams found' : 'No exams created yet'}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>{searchTerm ? 'Adjust your search query to find exams.' : 'Your dashboard is looking a bit empty. Create your first exam to get started.'}</p>
                                {!searchTerm && (
                                    <button onClick={() => navigate('/create-exam')} className="btn btn-primary">
                                        Create Exam
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {filteredExams.map((exam, index) => (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                        className="card"
                                        style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{exam.title}</h4>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete this exam?')) deleteExam(exam.id);
                                                }}
                                                style={{ background: 'var(--border-color)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: '4px' }}
                                                title="Delete Exam"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>

                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <Clock size={16} /> <span style={{ fontWeight: '500' }}>Duration:</span> {exam.duration} minutes
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={16} /> <span style={{ fontWeight: '500' }}>Questions:</span> {exam.questions.length}
                                            </div>
                                        </div>

                                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                                            <span style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.8rem', background: 'var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>Active</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>

            </motion.div>
        </>
    );
};

export default AdminDashboard;
