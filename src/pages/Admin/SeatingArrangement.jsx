import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ArrowLeft, Users, Grid, RefreshCw, AlertCircle } from 'lucide-react';

const SeatingArrangement = () => {
    const { getAllStudents } = useAuth();
    const { seatingPlan, updateSeatingPlan } = useAdmin();
    const navigate = useNavigate();

    // Students fetched from backend
    const [allStudents, setAllStudents] = useState([]);
    const [totalBenches, setTotalBenches] = useState(10);
    const [studentsPerBench, setStudentsPerBench] = useState(2);
    const [roomNumber, setRoomNumber] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [arrangement, setArrangement] = useState([]);
    const [error, setError] = useState('');
    const [fetchingStudents, setFetchingStudents] = useState(true);

    // Sync from context when it loads
    useEffect(() => {
        if (seatingPlan) {
            setTotalBenches(seatingPlan.totalBenches || 10);
            setStudentsPerBench(seatingPlan.studentsPerBench || 2);
            setRoomNumber(seatingPlan.roomNumber || '');
            setArrangement(seatingPlan.arrangement || []);
            setIsGenerated(true);
        }
    }, [seatingPlan]);

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
            alert('Seating Arrangement Saved to Backend Successfully!');
        } catch (err) {
            alert('Error saving arrangement');
        }
    };

    const generateSeating = () => {
        setError('');
        const capacity = totalBenches * studentsPerBench;

        if (allStudents.length === 0) {
            setError('No students registered to assign.');
            return;
        }

        if (allStudents.length > capacity) {
            setError(`Not enough capacity! Needed: ${allStudents.length}, Available: ${capacity}. Please add more benches.`);
            return;
        }

        const shuffled = [...allStudents]; // Sequential for now

        const newArrangement = [];
        let studentIndex = 0;

        for (let i = 1; i <= totalBenches; i++) {
            const bench = {
                id: i,
                students: []
            };

            for (let j = 0; j < studentsPerBench; j++) {
                if (studentIndex < shuffled.length) {
                    bench.students.push(shuffled[studentIndex]);
                    studentIndex++;
                }
            }
            newArrangement.push(bench);
        }

        setArrangement(newArrangement);
        setIsGenerated(true);
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--background-color)', padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                        <Grid size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>Seating Arrangement</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Automatically assign students to benches</p>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room Number</label>
                            <input
                                type="text"
                                placeholder="e.g. A-101"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Total Benches</label>
                            <input
                                type="number"
                                min="1"
                                value={totalBenches}
                                onChange={(e) => setTotalBenches(parseInt(e.target.value) || 0)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Students Per Bench</label>
                            <input
                                type="number"
                                min="1"
                                value={studentsPerBench}
                                onChange={(e) => setStudentsPerBench(parseInt(e.target.value) || 0)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <button onClick={generateSeating} disabled={fetchingStudents} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={18} /> {fetchingStudents ? 'Loading...' : 'Generate'}
                        </button>
                    </div>

                    {error && (
                        <div style={{ marginTop: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {!error && !fetchingStudents && (
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Total Students: <strong>{allStudents.length}</strong> • Total Capacity: <strong>{totalBenches * studentsPerBench}</strong>
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                {isGenerated && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Arrangement Preview</h3>
                            <button onClick={saveArrangement} className="btn " style={{ background: '#16a34a', color: 'white', border: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                Save Arrangement to Backend
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {arrangement.map(bench => (
                                <div key={bench.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <div style={{ background: 'var(--background-color)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Bench #{bench.id}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bench.students.length}/{studentsPerBench} Filled</span>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        {bench.students.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: '1.2rem', listStyle: 'disc' }}>
                                                {bench.students.map((student, idx) => (
                                                    <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                                        <strong>{student.name}</strong>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.rollNumber || student.email}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                                                Empty
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatingArrangement;
