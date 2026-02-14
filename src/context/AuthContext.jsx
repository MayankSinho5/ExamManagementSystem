import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await API.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error('Session expired');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (identifier, password, role) => {
        try {
            const res = await API.post('/auth/login', { identifier, password });

            // Check role match
            if (res.data.user.role !== role) {
                throw new Error(`Incorrect role. Please check if you selected Student/Admin correctly.`);
            }

            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data.user;
        } catch (err) {
            throw new Error(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    const signup = async (name, email, password, role, rollNumber) => {
        try {
            const res = await API.post('/auth/signup', { name, email, password, role, rollNumber });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data.user;
        } catch (err) {
            throw new Error(err.response?.data?.message || err.message || 'Signup failed');
        }
    };

    const registerStudent = async (name, email, password, rollNumber) => {
        try {
            // This is same as signup but DOES NOT set user state (prevents auto-login for admin)
            const res = await API.post('/auth/signup', { name, email, password, role: 'student', rollNumber });
            return res.data.user;
        } catch (err) {
            throw new Error(err.response?.data?.message || err.message || 'Student registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const getAllStudents = async () => {
        try {
            const res = await API.get('/auth/students');
            return res.data;
        } catch (err) {
            console.error('Error fetching students:', err);
            return [];
        }
    };

    const deleteUser = async (id) => {
        try {
            await API.delete(`/auth/students/${id}`);
            return true;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error deleting student');
        }
    };

    const updateUser = async (updateData) => {
        try {
            const res = await API.put('/auth/update', updateData);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return true;
        } catch (err) {
            console.error('Error updating profile:', err);
            return false;
        }
    };

    const resetPassword = async (email, password) => {
        try {
            const res = await API.post('/auth/reset-password', { email, password });
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, registerStudent, logout, loading, getAllStudents, deleteUser, updateUser, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
