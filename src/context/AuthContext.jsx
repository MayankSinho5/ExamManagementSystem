import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password, role) => {
        // Strict login logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (identifier && password) {
                    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

                    // Find ALL matches for this identifier
                    const matchingUsers = allUsers.filter(u =>
                        (u.email.toLowerCase() === identifier.toLowerCase() || u.name === identifier)
                    );

                    if (matchingUsers.length === 0) {
                        reject(new Error('Account not registered. Please Sign Up first.'));
                        return;
                    }

                    // Check if ANY of the matching users has the correct password and role
                    const validUser = matchingUsers.find(u => u.password === password && u.role === role);

                    if (validUser) {
                        // Success
                        const userData = { ...validUser };
                        delete userData.password; // Don't keep password in session
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                        resolve(userData);
                    } else {
                        // If we found users but none matched password/role
                        const roleMatch = matchingUsers.some(u => u.role === role);
                        if (!roleMatch) {
                            reject(new Error(`Incorrect role. Please check if you selected Student/Admin correctly.`));
                        } else {
                            reject(new Error('Incorrect password.'));
                        }
                    }
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    };

    const signup = async (name, email, password, role) => {
        // Mock signup logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password && name) {
                    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

                    // Check for existing user
                    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
                    if (existingUser) {
                        reject(new Error('Email already registered. Please Login.'));
                        return;
                    }

                    const userData = {
                        id: Math.random().toString(36).substr(2, 9),
                        name,
                        email,
                        role,
                        password, // Store password for mock strict auth
                        joinedAt: new Date().toISOString()
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Save to global users list for Admin to see & for Login lookup
                    allUsers.push(userData);
                    localStorage.setItem('users', JSON.stringify(allUsers));

                    resolve(userData);
                } else {
                    reject(new Error('Invalid data'));
                }
            }, 1000);
        });
    };

    const getAllStudents = () => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        return allUsers.filter(u => u.role === 'student');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const deleteUser = (email) => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = allUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // If deleting self (which shouldn't happen for admin deleting student, but safety check)
        if (user && user.email.toLowerCase() === email.toLowerCase()) {
            logout();
        }
    };

    const resetPassword = async (email, newPassword) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

                if (userIndex === -1) {
                    reject(new Error('Email not found. Please enter your registered email.'));
                    return;
                }

                allUsers[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(allUsers));
                resolve(true);
            }, 1000);
        });
    };

    const updateUser = (updatedDetails) => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = allUsers.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            const updatedUser = { ...allUsers[userIndex], ...updatedDetails };
            allUsers[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(allUsers));

            // Also update current session (user state)
            const sessionUser = { ...user, ...updatedDetails };
            delete sessionUser.password;
            setUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, deleteUser, resetPassword, updateUser, loading, getAllStudents }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
