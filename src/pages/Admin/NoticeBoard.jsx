import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Megaphone, Trash, Plus } from 'lucide-react';

const NoticeBoard = () => {
    const { notices, addNotice, deleteNotice } = useAdmin();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) return;
        addNotice({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Notice Board</h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notice Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Exam Schedule Release"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                            placeholder="Write your announcement here..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', resize: 'vertical', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                        <Plus size={20} style={{ marginRight: '0.5rem' }} /> Post Notice
                    </button>
                </form>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {notices.length === 0 ? (
                    <div className="card">
                        <p style={{ color: 'var(--text-secondary)' }}>No announcements posted.</p>
                    </div>
                ) : notices.map(notice => (
                    <div key={notice._id} className="card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{notice.title}</h3>
                            <button onClick={() => deleteNotice(notice._id)} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                                <Trash size={18} />
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{notice.content}</p>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Megaphone size={14} /> Posted on {new Date(notice.createdAt || notice.date).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
