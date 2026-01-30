import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { exams, submitAttempt } = useExam();
    const { user } = useAuth();

    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const foundExam = exams.find(e => e.id === examId);
        if (!foundExam) {
            alert('Exam not found');
            navigate('/student-dashboard');
            return;
        }
        setExam(foundExam);
        setTimeLeft(foundExam.duration * 60); // minutes to seconds
    }, [examId, exams, navigate]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && exam && !submitted) {
            handleSubmit(); // Auto submit
        }
    }, [timeLeft, submitted, exam]);

    const handleSelectOption = (qId, optionId) => {
        setAnswers({ ...answers, [qId]: optionId });
    };

    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);

        // Calculate Score
        let score = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        submitAttempt(exam.id, user.id, score, answers);
        alert(`Exam Submitted! Your Score: ${score}/${exam.questions.length}`);
        navigate('/student-dashboard');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!exam) return <div className="container" style={{ paddingTop: '2rem' }}>Loading exam...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container"
            style={{ paddingTop: '2rem', paddingBottom: '4rem' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', position: 'sticky', top: '1rem', zIndex: 100 }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{exam.title}</h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Question {currentQuestion + 1} of {exam.questions.length}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: timeLeft < 60 ? 'var(--error-color)' : 'var(--primary-color)' }}>
                    <Clock size={24} /> {formatTime(timeLeft)}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card"
                    style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                >
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{exam.questions[currentQuestion].text}</h2>

                    <div style={{ flex: 1 }}>
                        {exam.questions[currentQuestion].options.map((opt, index) => (
                            <motion.div
                                key={opt.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleSelectOption(exam.questions[currentQuestion].id, opt.id)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                style={{
                                    padding: '1rem',
                                    border: answers[exam.questions[currentQuestion].id] === opt.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    cursor: 'pointer',
                                    background: answers[exam.questions[currentQuestion].id] === opt.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--surface-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: answers[exam.questions[currentQuestion].id] === opt.id ? '6px solid var(--primary-color)' : '2px solid var(--border-color)', flexShrink: 0 }}></div>
                                {opt.text}
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className="btn"
                            style={{ background: 'var(--background-color)', color: currentQuestion === 0 ? 'var(--text-secondary)' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                            Previous
                        </button>

                        {currentQuestion === exam.questions.length - 1 ? (
                            <button onClick={handleSubmit} className="btn btn-primary" style={{ background: 'var(--success-color)' }}>
                                Submit Exam
                            </button>
                        ) : (
                            <button onClick={() => setCurrentQuestion(prev => prev + 1)} className="btn btn-primary">
                                Next Question
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default TakeExam;
