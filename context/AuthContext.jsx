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

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Memastikan sesi aktif. Jika di lingkungan dev/demo belum login,
   * secara otomatis login sebagai akun default sesuai kebutuhan rute.
   */
  const ensureAuth = async (requiredRole = 'participant') => {
    if (user) {
      if (requiredRole === 'admin' && (user.role === 'admin' || user.role === 'mentor')) return user;
      if (requiredRole === 'participant') return user;
      if (requiredRole === 'any') return user;
    }

    try {
      let defaultEmail = 'rahmat.hidayat@gmail.com';
      let defaultPass = 'MemberPassword2026!';
      if (requiredRole === 'admin') {
        defaultEmail = 'admin@kertaskata.my.id';
        defaultPass = 'AdminPassword2026!';
      }

      const res = await api.auth.login(defaultEmail, defaultPass);
      if (res && res.success && res.data) {
        const { user: userData, token } = res.data;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (e) {
      console.warn('Auto-auth notice:', e.message);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, ensureAuth }}>
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
