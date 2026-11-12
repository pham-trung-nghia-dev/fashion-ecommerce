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

  // Khởi tạo phiên đăng nhập từ LocalStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        localStorage.setItem('token', storedToken);

        try {
          const res = await apiGetMe(storedToken);
          if (res.ok && res.data?.user) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('fashion_auth');
            setToken(null);
            setUser(null);
          }
        } catch {
          // Token không hợp lệ hoặc hết hạn
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

      if (res.ok && res.data?.token) {
        const jwtToken = res.data.token;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('auth_token', jwtToken);
        setToken(jwtToken);
        setUser(res.data.user);
        toast.success(res.data.message || 'Đăng nhập thành công!');
        return true;
      } else {
        toast.error(res.data?.message || 'Đăng nhập thất bại.');
        return false;
      }
    } catch {
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

      if (res.ok && res.data?.token) {
        const jwtToken = res.data.token;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('auth_token', jwtToken);
        setToken(jwtToken);
        setUser(res.data.user);
        toast.success(res.data.message || 'Đăng ký tài khoản thành công!');
        return true;
      } else {
        toast.error(res.data?.message || 'Đăng ký thất bại.');
        return false;
      }
    } catch {
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
        await apiLogout(token).catch(() => {});
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('fashion_auth');
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
