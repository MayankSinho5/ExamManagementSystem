import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, UserPlus, Lock, Mail, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';

const Signup = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setError('');
        setLoading(true);

        try {
            await signup(formData.name, formData.email, formData.password, role, formData.rollNumber);
            navigate(role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
                style={{ width: '100%', maxWidth: '500px' }}
            >
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem' }}>
                        <ThemeToggle />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join as an {role === 'admin' ? 'Admin' : 'Student'}</p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error-color)', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', overflow: 'hidden' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ display: 'flex', background: 'var(--background-color)', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', position: 'relative' }}>
                        <motion.button
                            type="button"
                            onClick={() => setRole('student')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'calc(var(--radius-md) - 2px)',
                                border: 'none',
                                background: role === 'student' ? 'var(--input-bg)' : 'transparent',
                                fontWeight: role === 'student' ? '600' : '400',
                                boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none',
                                color: role === 'student' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                zIndex: 1
                            }}
                        >
                            <User size={18} /> Student
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setRole('admin')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'calc(var(--radius-md) - 2px)',
                                border: 'none',
                                background: role === 'admin' ? 'var(--input-bg)' : 'transparent',
                                fontWeight: role === 'admin' ? '600' : '400',
                                boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none',
                                color: role === 'admin' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                zIndex: 1
                            }}
                        >
                            <Shield size={18} /> Admin
                        </motion.button>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <BadgeCheck size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {role === 'student' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Roll Number / Student ID</label>
                            <div style={{ position: 'relative' }}>
                                <BadgeCheck size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    name="rollNumber"
                                    required={role === 'student'}
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your Roll Number"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="******"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="******"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}
                    >
                        {loading ? 'Creating account...' : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                Sign Up <UserPlus size={20} />
                            </span>
                        )}
                    </motion.button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
