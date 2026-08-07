import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseClientConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password?: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordByEmail: (email: string) => Promise<{ message: string }>;
  resetPasswordByPhone: (phone: string) => Promise<{ message: string }>;
  verifyPhoneOtp: (phone: string, token: string, newPassword: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'demo-user-123',
  email: 'alex.developer@example.com',
  fullName: 'Alex Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  jobTitle: 'Senior Full Stack Engineer',
  targetIndustry: 'SaaS / AI / Tech',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(!isSupabaseClientConfigured);

  useEffect(() => {
    if (!isSupabaseClientConfigured || !supabase) {
      const stored = localStorage.getItem('ai_resume_active_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!isSupabaseClientConfigured || !supabase) {
      const storedAccounts = JSON.parse(localStorage.getItem('ai_resume_registered_users') || '[]');
      const found = storedAccounts.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (!found && email !== DEMO_USER.email) {
        throw new Error('Account not found. Please Sign Up before signing in.');
      }

      const activeUser: UserProfile = found || {
        ...DEMO_USER,
        email,
        fullName: email.split('@')[0],
      };
      setUser(activeUser);
      localStorage.setItem('ai_resume_active_user', JSON.stringify(activeUser));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'Password123!',
    });

    if (error) {
      throw new Error('Invalid email or password. Please check your credentials or Sign Up.');
    }
  };

  const register = async (email: string, password?: string, fullName?: string) => {
    if (!isSupabaseClientConfigured || !supabase) {
      const newUser: UserProfile = {
        id: 'user_' + Math.random().toString(36).substring(2, 10),
        email,
        fullName: fullName || email.split('@')[0],
        jobTitle: 'Software Professional',
      };
      const storedAccounts = JSON.parse(localStorage.getItem('ai_resume_registered_users') || '[]');
      storedAccounts.push(newUser);
      localStorage.setItem('ai_resume_registered_users', JSON.stringify(storedAccounts));

      setUser(newUser);
      localStorage.setItem('ai_resume_active_user', JSON.stringify(newUser));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: password || 'Password123!',
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
  };

  const logout = async () => {
    if (!isSupabaseClientConfigured || !supabase) {
      setUser(null);
      localStorage.removeItem('ai_resume_active_user');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPasswordByEmail = async (email: string) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, method: 'email' }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send email password reset link.');
    return data;
  };

  const resetPasswordByPhone = async (phone: string) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, method: 'phone' }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send SMS OTP code.');
    return data;
  };

  const verifyPhoneOtp = async (phone: string, token: string, newPassword: string) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, token, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify OTP code.');
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        login,
        register,
        logout,
        resetPasswordByEmail,
        resetPasswordByPhone,
        verifyPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
