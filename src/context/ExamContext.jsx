import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const ExamContext = createContext();

export const useExam = () => useContext(ExamContext);

export const ExamProvider = ({ children }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExams = async () => {
        try {
            const res = await API.get('/exams');
            setExams(res.data);
        } catch (err) {
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const addExam = async (examData) => {
        try {
            const res = await API.post('/exams', examData);
            setExams([res.data, ...exams]);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error adding exam');
        }
    };

    const deleteExam = async (id) => {
        try {
            await API.delete(`/exams/${id}`);
            setExams(exams.filter(exam => exam._id !== id));
        } catch (err) {
            console.error('Error deleting exam:', err);
        }
    };

    const submitAttempt = async (examId, score, answers) => {
        try {
            const res = await API.post('/attempts/submit', { examId, score, answers });
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error submitting attempt');
        }
    };

    const getAttempts = async (studentId) => {
        try {
            const res = await API.get('/attempts/my-attempts', { params: { studentId } });
            return res.data;
        } catch (err) {
            console.error('Error getting attempts:', err);
            return [];
        }
    };

    return (
        <ExamContext.Provider value={{ exams, addExam, deleteExam, submitAttempt, getAttempts, loading, refreshExams: fetchExams }}>
            {children}
        </ExamContext.Provider>
    );
};
