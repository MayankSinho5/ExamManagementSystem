import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [timetable, setTimetable] = useState([]);
    const [notices, setNotices] = useState([]);
    const [seatingPlan, setSeatingPlan] = useState(null);

    useEffect(() => {
        const storedTimetable = localStorage.getItem('timetable');
        if (storedTimetable) setTimetable(JSON.parse(storedTimetable));

        const storedNotices = localStorage.getItem('notices');
        if (storedNotices) setNotices(JSON.parse(storedNotices));

        const storedSeating = localStorage.getItem('seating_plan');
        if (storedSeating) setSeatingPlan(JSON.parse(storedSeating));
    }, []);

    const addTimetableItem = (item) => {
        const newItem = { ...item, id: Date.now() };
        const updated = [...timetable, newItem];
        setTimetable(updated);
        localStorage.setItem('timetable', JSON.stringify(updated));
    };

    const deleteTimetableItem = (id) => {
        const updated = timetable.filter(t => t.id !== id);
        setTimetable(updated);
        localStorage.setItem('timetable', JSON.stringify(updated));
    };

    const addNotice = (notice) => {
        const newNotice = { ...notice, id: Date.now(), date: new Date().toISOString() };
        const updated = [newNotice, ...notices];
        setNotices(updated);
        localStorage.setItem('notices', JSON.stringify(updated));
    };

    const deleteNotice = (id) => {
        const updated = notices.filter(n => n.id !== id);
        setNotices(updated);
        localStorage.setItem('notices', JSON.stringify(updated));
    };

    const updateSeatingPlan = (plan) => {
        setSeatingPlan(plan);
        localStorage.setItem('seating_plan', JSON.stringify(plan));
    };

    return (
        <AdminContext.Provider value={{
            timetable,
            notices,
            seatingPlan,
            addTimetableItem,
            deleteTimetableItem,
            addNotice,
            deleteNotice,
            updateSeatingPlan
        }}>
            {children}
        </AdminContext.Provider>
    );
};
