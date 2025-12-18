
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, additionalData?: { phone?: string; birthdate?: string; gender?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const isInvalidRefreshTokenError = (error: unknown) => {
    if (!error || typeof error !== 'object') return false;
    const message = 'message' in error ? String((error as any).message || '') : '';
    return (
      message.includes('Invalid Refresh Token') ||
      message.includes('Refresh Token Not Found')
    );
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      // If the browser has a stale/partial auth cookie, Supabase may throw
      // an AuthApiError while trying to refresh. In that case, clear session.
      if (error && isInvalidRefreshTokenError(error)) {
        await supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const mapSupabaseUser = (sbUser: SupabaseUser): User => {
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
      email: sbUser.email || '',
    };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    
    router.push('/');
  };

  const signup = async (name: string, email: string, password: string, additionalData?: { phone?: string; birthdate?: string; gender?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          ...additionalData
        },
      },
    });

    if (error) {
      throw error;
    }

    router.push('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
