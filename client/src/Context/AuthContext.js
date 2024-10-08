// client/src/Context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getTokenFromPersistAuth = () => {
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
        const authState = JSON.parse(persistAuth);
        const token = authState?.token?.slice(1, -1); // Xóa dấu ngoặc kép khỏi chuỗi mã thông báo
        return token;
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getTokenFromPersistAuth());

    useEffect(() => {
        const storedToken = getTokenFromPersistAuth();
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};