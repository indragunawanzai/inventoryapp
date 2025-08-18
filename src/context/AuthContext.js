import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [userRole, setUserRole] = useState(null);

    // Fungsi untuk memperbarui token dan role
    const setAuth = (token, role) => {
        setAuthToken(token);
        setUserRole(role);
    };

    // Fungsi untuk logout
    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, userRole, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};