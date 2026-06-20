'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiGetMe, apiLogin, apiRegister, apiLogout } from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load token/user from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await apiGetMe(storedToken);

          if (res.ok) {
            setUser(res.data.user);
          } else {
            // Token is invalid/expired
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiLogin({ email, password });

      if (res.ok) {
        localStorage.setItem('auth_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(res.data.message || 'Đăng nhập thành công!');
        return true;
      } else {
        toast.error(res.data.message || 'Đăng nhập thất bại.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Đã xảy ra lỗi kết nối mạng.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiRegister({ name, email, password });

      if (res.ok) {
        localStorage.setItem('auth_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(res.data.message || 'Đăng ký tài khoản thành công!');
        return true;
      } else {
        toast.error(res.data.message || 'Đăng ký thất bại.');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Đã xảy ra lỗi kết nối mạng.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await apiLogout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      toast.success('Đăng xuất thành công!');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
