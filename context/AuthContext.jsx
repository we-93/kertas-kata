'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, TOKEN_KEY, USER_KEY } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Muat user dari localStorage saat client-side mount
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Gagal membaca sesi pengguna:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res && res.success && res.data) {
      const { user: userData, token } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, message: res.message || 'Email atau kata sandi tidak sesuai.' };
  };

  const loginGoogle = async (mockOrToken) => {
    // Jika ada mockData atau idToken
    const payload = typeof mockOrToken === 'string' ? { idToken: mockOrToken } : { mockData: mockOrToken };
    const res = await api.auth.google(payload);
    if (res && res.success && res.data) {
      const { user: userData, token } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, message: res.message || 'Gagal autentikasi via Google.' };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  /**
   * Memvalidasi apakah user sedang login dan memiliki role yang sesuai.
   * Tidak ada auto-login dummy. Jika belum login, mengembalikan null.
   */
  const ensureAuth = async (requiredRole = 'anggota') => {
    let currentUser = user;
    if (!currentUser && typeof window !== 'undefined') {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
          setUser(currentUser);
        } catch (e) {
          currentUser = null;
        }
      }
    }

    if (currentUser) {
      if (requiredRole === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'mentor')) {
        return currentUser;
      }
      if (requiredRole === 'anggota' || requiredRole === 'any') {
        return currentUser;
      }
    }

    return null;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, loginGoogle, logout, ensureAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
