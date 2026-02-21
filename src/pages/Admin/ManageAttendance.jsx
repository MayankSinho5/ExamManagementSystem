import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Users, Search, Calendar as CalendarIcon, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAttendance = () => {
    const { seatingPlans, fetchRoomAttendance, markAttendance } = useAdmin();
    const navigate = useNavigate();

    const [selectedRoom, setSelectedRoom] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedRoom) {
            loadAttendance();
        }
    }, [selectedRoom, date]);

    const loadAttendance = async () => {
        setLoading(true);
        try {
            // 1. Get students from seating plan
            const plan = seatingPlans.find(p => p.roomNumber === selectedRoom);
            if (!plan) {
                setStudents([]);
                return;
            }

            // Extract all students from the arrangement grid
            const allStudents = plan.arrangement.flatMap(bench => bench.students);
            setStudents(allStudents);

            // 2. Get existing attendance from DB
            const existing = await fetchRoomAttendance(selectedRoom, date);
            const map = {};
            existing.forEach(rec => {
                map[rec.student._id || rec.student] = rec.status;
            });
            setAttendanceMap(map);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (studentId, currentStatus) => {
        const newStatus = currentStatus === 'present' ? 'absent' : 'present';
        try {
            await markAttendance({
                studentId,
                roomNumber: selectedRoom,
                status: newStatus,
                date
            });
            setAttendanceMap(prev => ({ ...prev, [studentId]: newStatus }));
        } catch (err) {
            alert('Failed to update attendance');
        }
    };

    const markAll = async (status) => {
        if (!selectedRoom || students.length === 0) return;

        // We do it sequentially or promise.all but realistically we should have a bulk API
        // For now, let's do it individually for simplicity as requested per plan
        setLoading(true);
        try {
            await Promise.all(students.map(s =>
                markAttendance({
                    studentId: s._id || s.id,
                    roomNumber: selectedRoom,
                    status,
                    date
                })
            ));
            const newMap = {};
            students.forEach(s => newMap[s._id || s.id] = status);
            setAttendanceMap(newMap);
        } catch (err) {
            alert('Some updates failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input"
                        style={{ padding: '0.5rem' }}
                    />
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="input"
                        style={{ padding: '0.5rem', minWidth: '150px' }}
                    >
                        <option value="">Select Room</option>
                        {seatingPlans.map(p => (
                            <option key={p.roomNumber} value={p.roomNumber}>Room {p.roomNumber}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Attendance Management</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {selectedRoom ? `Marking for Room ${selectedRoom}` : 'Please select a room to start'}
                        </p>
                    </div>
                    {selectedRoom && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => markAll('present')} className="btn" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: '1px solid var(--success-color)' }}>
                                Mark All Present
                            </button>
                            <button onClick={() => markAll('absent')} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', border: '1px solid var(--error-color)' }}>
                                Mark All Absent
                            </button>
                        </div>
                    )}
                </div>

                {selectedRoom ? (
                    <>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={18} />
                            <input
                                type="text"
                                placeholder="Search student name or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input"
                                style={{ paddingLeft: '2.8rem', width: '100%' }}
                            />
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading students...</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {filteredStudents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No students found in this room.</div>
                                ) : (
                                    filteredStudents.map(student => {
                                        const status = attendanceMap[student._id || student.id] || 'pending';
                                        return (
                                            <div key={student._id || student.id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                background: 'var(--background-color)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                                                        <User size={20} color="var(--text-secondary)" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{student.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Roll: {student.rollNumber || 'N/A'}</div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleToggle(student._id || student.id, status === 'present' ? 'present' : 'absent')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: 'var(--radius-sm)',
                                                            border: '1px solid',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            fontWeight: '600',
                                                            fontSize: '0.85rem',
                                                            background: status === 'present' ? 'var(--success-color)' : 'transparent',
                                                            borderColor: status === 'present' ? 'var(--success-color)' : 'var(--border-color)',
                                                            color: status === 'present' ? 'white' : 'var(--text-secondary)'
                                                        }}
                                                    >
                                                        <CheckCircle size={16} /> Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(student._id || student.id, status === 'absent' ? 'absent' : 'present')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: 'var(--radius-sm)',
                                                            border: '1px solid',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            fontWeight: '600',
                                                            fontSize: '0.85rem',
                                                            background: status === 'absent' ? 'var(--error-color)' : 'transparent',
                                                            borderColor: status === 'absent' ? 'var(--error-color)' : 'var(--border-color)',
                                                            color: status === 'absent' ? 'white' : 'var(--text-secondary)'
                                                        }}
                                                    >
                                                        <XCircle size={16} /> Absent
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Users size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>Select a room and date to manage attendance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAttendance;
