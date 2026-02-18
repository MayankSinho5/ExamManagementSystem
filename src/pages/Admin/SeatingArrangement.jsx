import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ArrowLeft, Users, Grid, RefreshCw, AlertCircle, Trash2, MapPin } from 'lucide-react';

const SeatingArrangement = () => {
    const { getAllStudents } = useAuth();
    const { seatingPlans, updateSeatingPlan, deleteSeatingPlan } = useAdmin();
    const navigate = useNavigate();

    // All available students in the system
    const [allStudents, setAllStudents] = useState([]);
    // Calculated list: Students not assigned in OTHER rooms
    const [availableStudents, setAvailableStudents] = useState([]);

    const [totalBenches, setTotalBenches] = useState(10);
    const [studentsPerBench, setStudentsPerBench] = useState(2);
    const [roomNumber, setRoomNumber] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [arrangement, setArrangement] = useState([]);
    const [unassigned, setUnassigned] = useState([]);
    const [error, setError] = useState('');
    const [fetchingStudents, setFetchingStudents] = useState(true);

    // Fetch students on mount
    useEffect(() => {
        const fetchStudents = async () => {
            setFetchingStudents(true);
            const data = await getAllStudents();
            setAllStudents(data);
            setFetchingStudents(false);
        };
        fetchStudents();
    }, []);

    // Effect: Update "Available Students" based on other room assignments
    useEffect(() => {
        if (!allStudents.length) return;

        // Get all student IDs assigned in other rooms
        const assignedInOthers = new Set();
        seatingPlans.forEach(plan => {
            if (plan.roomNumber !== roomNumber) {
                plan.arrangement.forEach(bench => {
                    bench.students.forEach(s => assignedInOthers.add(s._id || s.id));
                });
            }
        });

        // Filter allStudents to get those not in others
        const available = allStudents.filter(s => !assignedInOthers.has(s._id || s.id));
        setAvailableStudents(available);

        // Auto-load if this room already has a plan
        const existingPlan = seatingPlans.find(p => p.roomNumber === roomNumber);
        if (existingPlan) {
            setTotalBenches(existingPlan.totalBenches || 10);
            setStudentsPerBench(existingPlan.studentsPerBench || 2);
            setArrangement(existingPlan.arrangement || []);
            setIsGenerated(true);
        } else {
            // Reset if room changed to a new one
            setArrangement([]);
            setIsGenerated(false);
        }
    }, [roomNumber, seatingPlans, allStudents]);

    const saveArrangement = async () => {
        if (!roomNumber) {
            alert('Please enter a Room Number');
            return;
        }
        const data = {
            roomNumber,
            totalBenches,
            studentsPerBench,
            arrangement,
        };
        try {
            await updateSeatingPlan(data);
            alert(`Seating Arrangement for Room ${roomNumber} Saved Successfully!`);
        } catch (err) {
            alert('Error saving arrangement');
        }
    };

    const handleDeleteRoom = async (roomNum) => {
        if (window.confirm(`Are you sure you want to delete the plan for Room ${roomNum}?`)) {
            try {
                await deleteSeatingPlan(roomNum);
                if (roomNumber === roomNum) {
                    setRoomNumber('');
                    setIsGenerated(false);
                }
            } catch (err) {
                alert('Error deleting room plan');
            }
        }
    };

    const generateSeating = () => {
        setError('');
        const capacity = totalBenches * studentsPerBench;

        if (availableStudents.length === 0) {
            setError('No available students to assign.');
            setIsGenerated(false);
            return;
        }

        const toAssign = [...availableStudents];
        const newArrangement = [];
        let studentIndex = 0;

        for (let i = 1; i <= totalBenches; i++) {
            const bench = { id: i, students: [] };

            for (let j = 0; j < studentsPerBench; j++) {
                if (studentIndex < toAssign.length) {
                    bench.students.push(toAssign[studentIndex]);
                    studentIndex++;
                }
            }
            newArrangement.push(bench);
        }

        const unassignedList = toAssign.slice(studentIndex);
        setArrangement(newArrangement);
        setUnassigned(unassignedList);
        setIsGenerated(true);

        if (unassignedList.length > 0) {
            setError(`Room full! ${unassignedList.length} students remain unassigned. Allocate them to another room.`);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Left Sidebar: Saved Rooms */}
                <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <MapPin size={20} color="var(--primary-color)" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Saved Rooms</h3>
                    </div>

                    {seatingPlans.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            No rooms saved yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {seatingPlans.map(plan => (
                                <div
                                    key={plan.roomNumber}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: roomNumber === plan.roomNumber ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--background-color)',
                                        borderColor: roomNumber === plan.roomNumber ? 'var(--primary-color)' : 'var(--border-color)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => setRoomNumber(plan.roomNumber)}
                                >
                                    <div style={{ fontWeight: '600' }}>Room {plan.roomNumber}</div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRoom(plan.roomNumber);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Delete Plan"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--background-color)', padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                                <Grid size={24} color="var(--primary-color)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>Seating Arrangement</h1>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage multiple rooms and avoid student overlap</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Registered</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{allStudents.length} Students</div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Room Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 101"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Total Benches</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={totalBenches}
                                        onChange={(e) => setTotalBenches(parseInt(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Students Per Bench</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={studentsPerBench}
                                        onChange={(e) => setStudentsPerBench(parseInt(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <button onClick={generateSeating} disabled={fetchingStudents || !roomNumber} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <RefreshCw size={18} /> Generate
                                </button>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <Users size={16} color="var(--primary-color)" />
                                    Available (Not in other rooms): <strong>{availableStudents.length}</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <Grid size={16} color="var(--secondary-color)" />
                                    This Room Capacity: <strong>{totalBenches * studentsPerBench}</strong>
                                </div>
                            </div>

                            {error && (
                                <div style={{ marginTop: '1rem', color: unassigned.length > 0 ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.05)', padding: '0.5rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}
                        </div>

                        {/* Results Grid */}
                        {isGenerated && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0 }}>Room {roomNumber} Arrangement</h3>
                                    <button onClick={saveArrangement} className="btn" style={{ background: 'var(--success-color)', color: 'white', border: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        Save Room Plan
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                                    {arrangement.map(bench => (
                                        <div key={bench.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                            <div style={{ background: 'var(--background-color)', padding: '0.5rem 0.8rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.9rem' }}>Bench #{bench.id}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{bench.students.length}/{studentsPerBench}</span>
                                            </div>
                                            <div style={{ padding: '0.8rem' }}>
                                                {bench.students.length > 0 ? (
                                                    <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'disc' }}>
                                                        {bench.students.map((student, idx) => (
                                                            <li key={idx} style={{ marginBottom: '0.2rem' }}>
                                                                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{student.name}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{student.rollNumber}</div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.75rem', textAlign: 'center' }}>Empty</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {unassigned.length > 0 && (
                                    <div className="card" style={{ border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', marginBottom: '2rem' }}>
                                        <h3 style={{ color: '#d97706', marginBottom: '1rem', fontSize: '1.1rem' }}>Remaining Students (Unassigned)</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                            {unassigned.map(student => (
                                                <div key={student._id || student.id} style={{ fontSize: '0.8rem', padding: '0.4rem', background: 'white', borderRadius: '4px', border: '1px solid #fde68a' }}>
                                                    <strong>{student.name}</strong> ({student.rollNumber})
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            💡 Tip: Open another room (e.g. Room 102) from the sidebar to assign these students.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatingArrangement;
