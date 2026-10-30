'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserItem, Role } from './types';
import { SriwedariDB } from './db';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: UserItem;
}

interface AuthContextType {
  user: UserItem | null;
  role: Role | 'guest';
  isLoading: boolean;
  login: (email: string, pass: string, targetRole?: Role) => Promise<AuthResponse>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateCurrentUser: (user: UserItem) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check server session cookie first
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          SriwedariDB.setCurrentUser(data.user);
        } else {
          // Fallback to local user
          const savedUser = SriwedariDB.getCurrentUser();
          setUser(savedUser);
        }
      })
      .catch(() => {
        const savedUser = SriwedariDB.getCurrentUser();
        setUser(savedUser);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const handleUserChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserItem | null>;
      setUser(customEvent.detail);
    };

    window.addEventListener('sriwedari_user_changed', handleUserChange);
    return () => {
      window.removeEventListener('sriwedari_user_changed', handleUserChange);
    };
  }, []);

  const login = async (
    email: string,
    pass: string,
    targetRole?: Role
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, role: targetRole }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        SriwedariDB.setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return {
        success: false,
        error: data.error || 'Gagal masuk akun. Periksa kembali email dan kata sandi Anda.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Koneksi ke server otentikasi gagal.',
      };
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        SriwedariDB.saveUser(data.user);
        SriwedariDB.setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return {
        success: false,
        error: data.error || 'Pendaftaran akun gagal diproses oleh server.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Koneksi ke server pendaftaran gagal.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    SriwedariDB.setCurrentUser(null);
  };

  const updateCurrentUser = (updated: UserItem) => {
    setUser(updated);
    SriwedariDB.saveUser(updated);
    SriwedariDB.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        isLoading,
        login,
        register,
        logout,
        updateCurrentUser,
      }}
    >
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
