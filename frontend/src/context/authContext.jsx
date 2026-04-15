import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('canteen_user');

        if (savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser && typeof parsedUser === 'object') {
                    return parsedUser;
                }
            } catch (error) {
                console.error("Auth hydration failed:", error);
                localStorage.removeItem('canteen_user');
            }
        }

        return null
    });
    ;

    const login = (userData) => {

        if (userData) {
            setUser(userData);
            localStorage.setItem('canteen_user', JSON.stringify(userData));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('canteen_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);