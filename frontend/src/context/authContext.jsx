import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('canteen_user');

        // --- SAFETY CHECK START ---
        if (savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Ensure the parsed data is actually an object
                if (parsedUser && typeof parsedUser === 'object') {
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Auth hydration failed:", error);
                localStorage.removeItem('canteen_user'); // Clean up bad data
            }
        }
        // --- SAFETY CHECK END ---

        setLoading(false);
    }, []);

    const login = (userData) => {
        // Only save if userData is valid to prevent "undefined" from leaking in
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);