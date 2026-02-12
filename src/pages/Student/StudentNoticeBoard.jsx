import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, Calendar } from 'lucide-react';

const StudentNoticeBoard = () => {
    const { notices } = useAdmin();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/student-dashboard')}
                className="btn"
                style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: 0 }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Notice Board</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Stay updated with the latest announcements and schedules.</p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {notices.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ background: 'var(--background-color)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border-color)' }}>
                            <Megaphone size={32} color="var(--text-secondary)" />
                        </div>
                        <h3>No notices yet</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Announcements from administration will appear here.</p>
                    </div>
                ) : (
                    notices.map(notice => (
                        <div key={notice._id} className="card" style={{
                            borderLeft: '5px solid var(--primary-color)',
                            transition: 'transform 0.2s',
                            cursor: 'default'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{notice.title}</h3>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    background: 'var(--background-color)',
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <Calendar size={14} />
                                    {new Date(notice.createdAt || notice.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                                {notice.content}
                            </p>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>
                                <Megaphone size={14} /> Official Announcement
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentNoticeBoard;
