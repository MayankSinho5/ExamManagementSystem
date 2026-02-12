import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Trash2, Plus, X, Lock } from 'lucide-react';

const StudentList = () => {
    const { getAllStudents, deleteUser, signup } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', rollNumber: '' });
    const [lastCreated, setLastCreated] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete student: ${name}?`)) {
            try {
                await deleteUser(id);
                setStudents(students.filter(s => s._id !== id));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.name, formData.email, formData.password, 'student', formData.rollNumber);
            setLastCreated({ ...formData }); // Store for showing success
            setShowAddModal(true); // Keep modal open for success view
            setFormData({ name: '', email: '', password: '', rollNumber: '' });
            fetchStudents(); // Refresh list
        } catch (error) {
            alert(error.message);
        }
    };

    const copyToClipboard = () => {
        if (!lastCreated) return;
        const text = `Student Login Credentials:\nName: ${lastCreated.name}\nRoll Number: ${lastCreated.rollNumber}\nPassword: ${lastCreated.password}`;
        navigator.clipboard.writeText(text);
        alert('Credentials copied to clipboard! You can now share them with the student.');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                </button>
                <button onClick={() => { setShowAddModal(true); setLastCreated(null); }} className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Student
                </button>
            </div>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Manage Students</h1>

                {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Loading students...</p>
                ) : students.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No students registered yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email / Roll</th>
                                    <th style={{ padding: '1rem' }}>Joined At</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ background: 'var(--background-color)', padding: '0.5rem', borderRadius: '50%' }}>
                                                    <User size={16} color="var(--primary-color)" />
                                                </div>
                                                {student.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {student.email || student.rollNumber}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                <Calendar size={16} /> {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(student._id, student.name)}
                                                className="btn"
                                                style={{ padding: '0.5rem', color: 'var(--error-color)', border: '1px solid var(--border-color)', background: 'transparent' }}
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

            {/* Add Student Modal / Success Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => { setShowAddModal(false); setLastCreated(null); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                            <X size={20} />
                        </button>

                        {lastCreated ? (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ background: '#dcfce7', color: '#16a34a', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Plus size={30} />
                                </div>
                                <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Student Added!</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please share these login details with the student.</p>

                                <div style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                                    <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>NAME:</strong><div style={{ color: 'var(--text-primary)' }}>{lastCreated.name}</div></div>
                                    <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ROLL NUMBER / ID:</strong><div style={{ color: 'var(--text-primary)' }}>{lastCreated.rollNumber}</div></div>
                                    <div style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>PASSWORD:</strong><div style={{ color: 'var(--text-primary)' }}>{lastCreated.password}</div></div>
                                </div>

                                <button onClick={copyToClipboard} className="btn btn-primary" style={{ width: '100%' }}>
                                    Copy Credentials
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Student</h2>
                                <form onSubmit={handleAddStudent}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Student Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Roll Number</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Roll Number"
                                            value={formData.rollNumber}
                                            onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Student Account</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
