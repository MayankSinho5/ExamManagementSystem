import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

export const useExam = () => useContext(ExamContext);

export const ExamProvider = ({ children }) => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        // Load exams from local storage
        const storedExams = localStorage.getItem('exams');
        if (storedExams) {
            setExams(JSON.parse(storedExams));
        }
    }, []);

    const addExam = (exam) => {
        const newExam = { ...exam, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
        const updatedExams = [...exams, newExam];
        setExams(updatedExams);
        localStorage.setItem('exams', JSON.stringify(updatedExams));
        return newExam;
    };

    const deleteExam = (id) => {
        const updatedExams = exams.filter(exam => exam.id !== id);
        setExams(updatedExams);
        localStorage.setItem('exams', JSON.stringify(updatedExams));
    };

    const submitAttempt = (examId, studentId, score, answers) => {
        const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
        const newAttempt = {
            id: Date.now(),
            examId,
            studentId,
            score,
            answers,
            submittedAt: new Date().toISOString()
        };
        const updatedAttempts = [...attempts, newAttempt];
        localStorage.setItem('attempts', JSON.stringify(updatedAttempts));
        return newAttempt;
    };

    const getAttempts = (studentId) => {
        const attempts = JSON.parse(localStorage.getItem('attempts') || '[]');
        if (studentId) return attempts.filter(a => a.studentId === studentId);
        return attempts;
    };

    return (
        <ExamContext.Provider value={{ exams, addExam, deleteExam, submitAttempt, getAttempts }}>
            {children}
        </ExamContext.Provider>
    );
};
