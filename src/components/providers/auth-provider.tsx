'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { generateToken, verifyToken } from '@/lib/auth';
import { getUserByEmail, createUser } from '@/lib/database';
// Mock toast for demo - in production use sonner or react-hot-toast
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        // In a real app, fetch user data from API
        getUserByEmail(payload.email).then(userData => {
          if (userData) {
            setUser(userData);
          }
          setIsLoading(false);
        });
      } else {
        localStorage.removeItem('auth_token');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // In production, this would make an API call
      const userData = await getUserByEmail(email);
      
      if (!userData) {
        throw new Error('User not found');
      }

      // In production, verify password hash
      // For demo, we'll accept any password for existing users
      console.log('Login attempt with password:', password); // Demo logging
      
      const token = generateToken(userData);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'provider' | 'customer'): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user - in production, hash the password
      console.log('Registration with password:', password); // Demo logging
      const userData = await createUser({
        email,
        name,
        role
      });

      const token = generateToken(userData);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}