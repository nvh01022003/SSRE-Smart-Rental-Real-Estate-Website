// client/src/Context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getTokenFromPersistAuth = () => {
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
        const authState = JSON.parse(persistAuth);
        const token = authState?.token?.replace(/(^"|"$)/g, ''); // Remove surrounding quotes
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
        //localStorage.setItem('token', newToken);
        localStorage.setItem('persist:auth', JSON.stringify({ ...JSON.parse(localStorage.getItem('persist:auth')), token: `"${newToken}"` }));
        setToken(newToken);
    };

    const logout = () => {
        //localStorage.removeItem('token');
        const persistAuth = JSON.parse(localStorage.getItem('persist:auth'));
        delete persistAuth.token;
        localStorage.setItem('persist:auth', JSON.stringify(persistAuth));
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};