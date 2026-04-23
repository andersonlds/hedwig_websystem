import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    // Owner email fallback
    if (currentUser.email === 'andersonluiz.dsantos@gmail.com') {
      setIsAdmin(true);
      return true;
    }

    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('id', currentUser.id)
      .maybeSingle(); // maybeSingle() doesn't throw if no row found

    const adminStatus = !!data && !error;
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdmin(currentUser); // await so loading is accurate
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdmin(currentUser); // await so loading is accurate
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Ensure non-owner users who aren't admins appear in pending_requests
    // This handles the case where email confirmation happened after registration
    if (data.user && data.user.email !== 'andersonluiz.dsantos@gmail.com') {
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!adminData) {
        await supabase
          .from('pending_requests')
          .upsert([{ id: data.user.id, email: data.user.email }], { onConflict: 'id' });
      }
    }
  };

  const register = async (email: string, password: string): Promise<{ needsConfirmation: boolean }> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // If email confirmation is required, data.user exists but session is null
    // If auto-confirm is on, data.session will exist
    const userId = data.user?.id;
    const userEmail = data.user?.email;

    if (userId && userEmail) {
      // Save to pending_requests - this is the request for admin access
      const { error: reqError } = await supabase
        .from('pending_requests')
        .upsert([{ id: userId, email: userEmail }], { onConflict: 'id' });

      if (reqError) console.error('Erro ao criar solicitação:', reqError.message);
    }

    // needsConfirmation = true when Supabase requires email verification
    return { needsConfirmation: !data.session };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
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
