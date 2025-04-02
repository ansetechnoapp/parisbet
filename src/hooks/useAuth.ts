import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { getUserRoles, isAdmin, Role } from '@/lib/auth';

interface AuthState {
  user: User | null;
  roles: Role[];
  loading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    roles: [],
    loading: true,
    error: null
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          const roles = await getUserRoles(session.user.id);
          setState({
            user: session.user,
            roles,
            loading: false,
            error: null
          });
        } else {
          setState({
            user: null,
            roles: [],
            loading: false,
            error: null
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('An error occurred')
        }));
      }
    };

    // Initial fetch
    fetchUserAndRoles();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const roles = await getUserRoles(session.user.id);
        setState({
          user: session.user,
          roles,
          loading: false,
          error: null
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          roles: [],
          loading: false,
          error: null
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const hasPermission = (permission: string): boolean => {
    return state.roles.some(role =>
      role.permissions.includes('all') || role.permissions.includes(permission)
    );
  };

  return {
    user: state.user,
    roles: state.roles,
    loading: state.loading,
    error: state.error,
    isAdmin: state.user ? await isAdmin(state.user) : false,
    hasPermission,
    supabase
  };
};