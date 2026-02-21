import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, MapPin, Calendar, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentAttendance = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyAttendance = async () => {
            try {
                const res = await API.get('/attendance/my-attendance');
                setAttendance(res.data);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyAttendance();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/student-dashboard')} className="btn" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
            </button>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary-color)' }}>My Attendance</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your presence in examination halls.</p>
            </div>

            <div className="card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Fetching records...</div>
                ) : attendance.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <ClipboardCheck size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>No attendance records found yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {attendance.map((record, index) => (
                            <motion.div
                                key={record._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    background: 'var(--background-color)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: `4px solid ${record.status === 'present' ? 'var(--success-color)' : 'var(--error-color)'}`
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontWeight: '700',
                                            color: record.status === 'present' ? 'var(--success-color)' : 'var(--error-color)',
                                            textTransform: 'capitalize'
                                        }}>
                                            {record.status === 'present' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                            {record.status}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Room</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500' }}>
                                            <MapPin size={16} /> Room {record.roomNumber}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={16} /> {record.date}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                    Marked on<br />
                                    {new Date(record.updatedAt).toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
