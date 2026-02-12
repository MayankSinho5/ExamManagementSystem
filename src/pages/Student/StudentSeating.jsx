import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, User, MapPin } from 'lucide-react';

const StudentSeating = () => {
    const { user } = useAuth();
    const { seatingPlan } = useAdmin();
    const navigate = useNavigate();

    // Find student's seat in the arrangement
    let myBench = null;
    let partners = [];

    if (seatingPlan && seatingPlan.arrangement) {
        myBench = seatingPlan.arrangement.find(bench =>
            bench.students.some(s => (s._id || s.id) === (user._id || user.id))
        );

        if (myBench) {
            partners = myBench.students.filter(s => (s._id || s.id) !== (user._id || user.id));
        }
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/student-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--background-color)', padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                        <Grid size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>My Seating Arrangement</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View your exam hall assignment</p>
                    </div>
                </div>

                {!seatingPlan ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ background: 'var(--background-color)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-color)' }}>
                            <Grid size={40} color="var(--text-secondary)" />
                        </div>
                        <h3>No arrangement published</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Seating arrangement has not been generated or published by the admin yet.</p>
                    </div>
                ) : !myBench ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ background: 'rgba(249, 115, 22, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #f97316' }}>
                            <User size={40} color="#f97316" />
                        </div>
                        <h3>Not Assigned</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>You haven't been assigned a seat in the current plan. Please contact the administrator.</p>
                    </div>
                ) : (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Room Number</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <MapPin size={24} /> {seatingPlan.roomNumber}
                                </div>
                            </div>
                            <div style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Bench Number</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Grid size={24} /> #{myBench.id}
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bench Mates</h4>
                            {partners.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {partners.map((partner, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-color)', border: '1px solid var(--border-color)' }}>
                                            <div style={{ background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{partner.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{partner.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>You are sitting alone on this bench.</p>
                            )}
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success-color)', border: '1px solid var(--success-color)', fontSize: '0.9rem', textAlign: 'center' }}>
                            Updated on: {new Date(seatingPlan.updatedAt).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSeating;
