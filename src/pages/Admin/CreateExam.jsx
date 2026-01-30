import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { Plus, Trash, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const CreateExam = () => {
    const navigate = useNavigate();
    const { addExam } = useExam();

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(30); // in minutes
    const [questions, setQuestions] = useState([
        { id: 1, text: '', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }], correctAnswer: '' } // Initial setup
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: '',
                options: [{ id: 'a', text: '' }, { id: 'b', text: '' }],
                correctAnswer: ''
            }
        ]);
    };

    const removeQuestion = (qId) => {
        setQuestions(questions.filter(q => q.id !== qId));
    };

    const updateQuestionText = (qId, text) => {
        setQuestions(questions.map(q => q.id === qId ? { ...q, text } : q));
    };

    const addOption = (qId) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const nextId = String.fromCharCode(q.options.length + 97); // a, b, c...
                return { ...q, options: [...q.options, { id: nextId, text: '' }] };
            }
            return q;
        }));
    };

    const updateOptionText = (qId, oId, text) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                return {
                    ...q,
                    options: q.options.map(o => o.id === oId ? { ...o, text } : o)
                };
            }
            return q;
        }));
    };

    const setCorrectAnswer = (qId, oId) => {
        setQuestions(questions.map(q => q.id === qId ? { ...q, correctAnswer: oId } : q));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!title) return alert('Please enter exam title');
        if (questions.some(q => !q.text || !q.correctAnswer)) return alert('Please fill all questions and select correct answers');

        addExam({ title, duration, questions });
        navigate('/admin-dashboard');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/admin-dashboard')} className="btn" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
            </button>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Create New Exam</h1>

                <form onSubmit={handleSubmit}>
                    {/* Exam Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Exam Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Mathematics Final"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Duration (minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                min="1"
                            />
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

                    {/* Question List */}
                    <h3 style={{ marginBottom: '1rem' }}>Questions</h3>

                    {questions.map((q, index) => (
                        <div key={q.id} style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '1rem' }}>Question {index + 1}</h4>
                                {questions.length > 1 && (
                                    <button type="button" onClick={() => removeQuestion(q.id)} style={{ color: 'var(--error-color)', background: 'transparent', border: 'none' }}>
                                        <Trash size={18} />
                                    </button>
                                )}
                            </div>

                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => updateQuestionText(q.id, e.target.value)}
                                placeholder="Enter question text..."
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                            />

                            {/* Options */}
                            <div style={{ marginLeft: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Options (Select the correct one)</label>
                                {q.options.map((opt) => (
                                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                                        <div
                                            onClick={() => setCorrectAnswer(q.id, opt.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: q.correctAnswer === opt.id ? 'var(--success-color)' : 'var(--border-color)'
                                            }}
                                        >
                                            <CheckCircle size={24} fill={q.correctAnswer === opt.id ? 'currentColor' : 'none'} />
                                        </div>
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                                            placeholder={`Option ${opt.id.toUpperCase()}`}
                                            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                        />
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addOption(q.id)}
                                    style={{ fontSize: '0.875rem', color: 'var(--primary-color)', background: 'transparent', border: 'none', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    <Plus size={16} /> Add Option
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="btn"
                        style={{ width: '100%', border: '1px dashed var(--border-color)', marginBottom: '2rem', padding: '1rem', color: 'var(--text-secondary)' }}
                    >
                        <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add New Question
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                            <Save size={20} style={{ marginRight: '0.5rem' }} /> Save Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExam;
