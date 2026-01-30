import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Trash2, Plus, X, Lock } from 'lucide-react';

const StudentList = () => {
    const { getAllStudents, deleteUser, signup } = useAuth();
    const navigate = useNavigate();
    const students = getAllStudents();

    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleDelete = (email) => {
        if (window.confirm(`Are you sure you want to delete student with email: ${email}?`)) {
            deleteUser(email);
            // Force re-render or just let context update flow down (context change might not trigger re-render of this specific list if not pulling directly from state, but getAllStudents reads from localStorage. We might need to force update if getAllStudents isn't reactive. 
            // Actually, getAllStudents reads from localStorage which isn't reactive. We need to trigger a re-read.
            // A simple way is to use a local state toggle or reload. Let's force a reload for simplicity or better, move students to context state. 
            // For now, let's just reload page since getAllStudents is a helper, not state.
            window.location.reload();
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.name, formData.email, formData.password, 'student');
            alert('Student added successfully');
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '' });
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                </button>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Student
                </button>
            </div>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Manage Students</h1>

                {students.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No students registered yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Joined At</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '50%' }}>
                                                    <User size={16} color="var(--primary-color)" />
                                                </div>
                                                {student.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                <Mail size={16} /> {student.email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                <Calendar size={16} /> {student.joinedAt ? new Date(student.joinedAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(student.email)}
                                                className="btn"
                                                style={{ padding: '0.5rem', color: 'var(--error-color)', border: '1px solid #fee2e2', background: '#fef2f2' }}
                                                title="Delete Student"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Student</h2>
                        <form onSubmit={handleAddStudent}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Student Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="student@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Default Password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Student</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
