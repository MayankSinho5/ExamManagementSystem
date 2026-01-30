import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Save, Edit2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = updateUser({ name, email });
        if (success) {
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('Error updating profile.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container"
            style={{
                maxWidth: '600px',
                marginTop: '4rem',
                padding: '2rem',
                background: 'var(--surface-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                transition: 'var(--transition-theme)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ margin: 0 }}>User Profile</h2>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: '700',
                    margin: '0 auto 1rem'
                }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{
                    background: user?.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: user?.role === 'admin' ? 'var(--error-color)' : 'var(--primary-color)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    border: user?.role === 'admin' ? '1px solid var(--error-color)' : '1px solid var(--primary-color)'
                }}>
                    {user?.role}
                </span>
            </div>

            {message && (
                <div style={{
                    padding: '0.75rem',
                    background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: message.includes('Error') ? '1px solid var(--error-color)' : '1px solid var(--success-color)',
                    color: message.includes('Error') ? 'var(--error-color)' : 'var(--success-color)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <User size={16} /> Full Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <div style={{ padding: '0.75rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            {user?.name}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Mail size={16} /> Email Address
                    </label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <div style={{ padding: '0.75rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            {user?.email}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <Calendar size={16} /> Joined Date
                    </label>
                    <div style={{ padding: '0.75rem', color: 'var(--text-primary)' }}>
                        {new Date(user?.joinedAt || Date.now()).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isEditing ? (
                        <>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, gap: '0.5rem' }}>
                                <Save size={18} /> Save Changes
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                            <Edit2 size={18} /> Edit Profile
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
};

export default Profile;
