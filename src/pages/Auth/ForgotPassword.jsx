import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: New Password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email) return setError('Please enter your email');
        setStep(2);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setError('');
        setLoading(true);

        try {
            await resetPassword(email, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
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
                style={{ width: '100%', maxWidth: '450px' }}
            >
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem' }}>
                        <ThemeToggle />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Reset Password</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {success ? 'Password successfully updated!' : step === 1 ? 'Enter your email to reset your password' : 'Create a new secure password'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error-color)', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '2rem 0' }}
                        >
                            <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', color: 'var(--success-color)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                <CheckCircle size={48} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Success!</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Your password has been reset. Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 ? (
                                <form onSubmit={handleEmailSubmit}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your registered email"
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
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn btn-primary"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        Continue <ArrowRight size={18} />
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetSubmit}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter new password"
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
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Confirm Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
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
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            style={{ flex: 1, padding: '0.75rem', background: 'var(--background-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="btn btn-primary"
                                            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </motion.button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Remember your password?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
