import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, BookOpen, Trash, Plus } from 'lucide-react';

const Timetable = () => {
    const { timetable, addTimetableItem, deleteTimetableItem } = useAdmin();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [venue, setVenue] = useState('Main Hall');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !date || !startTime || !endTime) return;
        try {
            await addTimetableItem({ subject, date, startTime, endTime, venue });
            setSubject('');
            setDate('');
            setStartTime('');
            setEndTime('');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Manage Timetable</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Mathematics"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Venue</label>
                        <input
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Current Schedule</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {timetable.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No timetable scheduled.</p>
                    ) : timetable.map(item => (
                        <div key={item._id || item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '180px' }}>
                                    <BookOpen size={18} color="var(--primary-color)" />
                                    <span style={{ fontWeight: '500' }}>{item.subject}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                                    <Calendar size={18} color="var(--text-secondary)" />
                                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} color="var(--text-secondary)" />
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.startTime} - {item.endTime}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', background: 'var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                                    {item.venue}
                                </div>
                            </div>
                            <button onClick={() => deleteTimetableItem(item._id || item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timetable;
