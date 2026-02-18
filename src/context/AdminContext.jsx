import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [timetable, setTimetable] = useState([]);
    const [notices, setNotices] = useState([]);
    const [seatingPlans, setSeatingPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            const res = await API.get('/notices');
            setNotices(res.data);
        } catch (err) {
            console.error('Error fetching notices:', err);
        }
    };

    const fetchTimetable = async () => {
        try {
            const res = await API.get('/timetable');
            setTimetable(res.data);
        } catch (err) {
            console.error('Error fetching timetable:', err);
        }
    };

    const fetchSeatingPlans = async () => {
        try {
            const res = await API.get('/seating');
            // Backend now returns an array of documents, each with a .plan object
            const plans = Array.isArray(res.data) ? res.data.map(doc => doc.plan) : [];
            setSeatingPlans(plans);
        } catch (err) {
            console.error('Error fetching seating plans:', err);
        }
    };

    const loadAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchNotices(),
                fetchTimetable(),
                fetchSeatingPlans()
            ]);
        } catch (err) {
            console.error('Error loading admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const addTimetableItem = async (item) => {
        try {
            const res = await API.post('/timetable', item);
            setTimetable(prev => [...prev, res.data]);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error adding timetable item');
        }
    };

    const deleteTimetableItem = async (id) => {
        try {
            await API.delete(`/timetable/${id}`);
            setTimetable(prev => prev.filter(t => (t._id || t.id) !== id));
        } catch (err) {
            console.error('Error deleting timetable item:', err);
        }
    };

    const addNotice = async (noticeData) => {
        try {
            const res = await API.post('/notices', noticeData);
            setNotices(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error adding notice');
        }
    };

    const deleteNotice = async (id) => {
        try {
            await API.delete(`/notices/${id}`);
            setNotices(prev => prev.filter(n => (n._id || n.id) !== id));
        } catch (err) {
            console.error('Error deleting notice:', err);
        }
    };

    const updateSeatingPlan = async (plan) => {
        try {
            const res = await API.post('/seating/update', { plan });
            const updatedPlan = res.data.plan;

            // Update the local list of plans
            setSeatingPlans(prev => {
                const roomIdx = prev.findIndex(p => p.roomNumber === updatedPlan.roomNumber);
                if (roomIdx > -1) {
                    const newList = [...prev];
                    newList[roomIdx] = updatedPlan;
                    return newList;
                }
                return [updatedPlan, ...prev];
            });

            return updatedPlan;
        } catch (err) {
            console.error('Error updating seating plan:', err);
            throw err;
        }
    };

    return (
        <AdminContext.Provider value={{
            timetable,
            notices,
            seatingPlans,
            addTimetableItem,
            deleteTimetableItem,
            addNotice,
            deleteNotice,
            updateSeatingPlan,
            loading,
            refreshData: loadAllData
        }}>
            {children}
        </AdminContext.Provider>
    );
};
