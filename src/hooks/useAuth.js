import { useState, useEffect } from 'react';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';
const EXPIRY_KEY = 'auth_expiry';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + TTL_MS));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

function loadSession() {
  const token  = localStorage.getItem(TOKEN_KEY);
  const expiry = Number(localStorage.getItem(EXPIRY_KEY) || 0);
  const user   = localStorage.getItem(USER_KEY);
  if (!token || Date.now() > expiry) {
    clearSession();
    return { token: null, user: null };
  }
  try {
    return { token, user: JSON.parse(user) };
  } catch {
    clearSession();
    return { token: null, user: null };
  }
}

export function useAuth() {
  const [token, setToken]   = useState(() => loadSession().token);
  const [user, setUser]     = useState(() => loadSession().user);
  const [loading, setLoading] = useState(true);

  // On mount: verify token is still valid with the server
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error('invalid');
        return r.json();
      })
      .then(({ user }) => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'שגיאת התחברות');
    saveSession(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'שגיאת הרשמה');
    saveSession(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  return { token, user, loading, login, register, logout };
}
