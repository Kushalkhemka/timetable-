import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: 'teacher' | 'admin' | 'student' | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmailPassword: (
    email: string,
    password: string,
    role?: 'teacher' | 'admin' | 'student'
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<'teacher' | 'admin' | 'student' | null>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      const newRole = (data.session?.user?.user_metadata as any)?.role ?? null;
      setRole(newRole ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      const newRole = (newSession?.user?.user_metadata as any)?.role ?? null;
      setRole(newRole ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      role,
      async signInWithEmailPassword(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? new Error(error.message) : null };
      },
      async signUpWithEmailPassword(email: string, password: string, newUserRole?: 'teacher' | 'admin' | 'student') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: newUserRole ? { role: newUserRole } : undefined,
          },
        });
        return { error: error ? new Error(error.message) : null };
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [user, session, loading, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


