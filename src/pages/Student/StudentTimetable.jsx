import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, BookOpen, MapPin } from 'lucide-react';

const StudentTimetable = () => {
    const { timetable } = useAdmin();
    const navigate = useNavigate();

    // Sort timetable by date and startTime
    const sortedTimetable = [...timetable].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA - dateB !== 0) return dateA - dateB;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/student-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Class & Exam Schedule</h1>

                {sortedTimetable.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Calendar size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>No schedule available yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {sortedTimetable.map(item => (
                            <div key={item._id || item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)' }}>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                                    <div style={{ flex: 1.5, minWidth: '200px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Subject</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '1.1rem' }}>
                                            <BookOpen size={20} color="var(--primary-color)" />
                                            {item.subject}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Date</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={18} color="var(--text-secondary)" />
                                            {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Time & Venue</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                                <Clock size={16} color="var(--secondary-color)" />
                                                {item.startTime} - {item.endTime}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <MapPin size={14} />
                                                {item.venue}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTimetable;
