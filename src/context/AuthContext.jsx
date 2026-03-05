import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'ignotec_token';

async function apiFetch(url, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!(options.body instanceof FormData) && options.body) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
}

export { apiFetch };

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            apiFetch('/api/auth/me')
                .then(data => setUser(data.user))
                .catch(() => localStorage.removeItem(TOKEN_KEY))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const hasUsers = async () => {
        try {
            const data = await apiFetch('/api/auth/has-users');
            return data.hasUsers;
        } catch {
            return false;
        }
    };

    const login = async (username, password) => {
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem(TOKEN_KEY, data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const register = async (username, password) => {
        try {
            const data = await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem(TOKEN_KEY, data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, login, register, logout, hasUsers }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
