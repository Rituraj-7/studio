'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '@/types';
import { MOCK_USERS } from '@/data/mock';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('splitmates-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Could not parse user from localStorage", error);
        localStorage.removeItem('splitmates-user');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    // This is mock logic. In a real app, you'd call Firebase.
    console.log(`Attempting login for ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('splitmates-user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, pass: string, displayName: string): Promise<void> => {
    console.log(`Attempting signup for ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      photoURL: `https://placehold.co/100x100.png?text=${displayName.charAt(0)}`
    };
    MOCK_USERS.push(newUser); // Add to our mock user list
    setUser(newUser);
    localStorage.setItem('splitmates-user', JSON.stringify(newUser));
  };
  
  const loginWithGoogle = async (): Promise<void> => {
    console.log('Attempting Google login');
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate logging in with the first mock user
    const googleUser = MOCK_USERS[0];
    setUser(googleUser);
    localStorage.setItem('splitmates-user', JSON.stringify(googleUser));
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('splitmates-user');
  };

  const value = { user, loading, login, signup, logout, loginWithGoogle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
