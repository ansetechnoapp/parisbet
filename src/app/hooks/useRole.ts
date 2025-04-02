import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Role {
  name: string;
  permissions: string[];
}

export const useRole = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          setRoles([]);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            roles (
              name,
              permissions
            )
          `)
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (data) {
          setRoles(data.map(item => ({
            name: item.roles.name,
            permissions: item.roles.permissions
          })));
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const hasRole = (roleName: string) => roles.some(role => role.name === roleName);
  
  const hasAnyRole = (roleNames: string[]) => roleNames.some(roleName => 
    roles.some(role => role.name === roleName)
  );
  
  const hasAllRoles = (roleNames: string[]) => roleNames.every(roleName =>
    roles.some(role => role.name === roleName)
  );

  const hasPermission = (permission: string) => 
    roles.some(role => role.permissions.includes(permission));

  const hasAnyPermission = (permissions: string[]) =>
    permissions.some(permission => hasPermission(permission));

  const hasAllPermissions = (permissions: string[]) =>
    permissions.every(permission => hasPermission(permission));

  return { 
    roles, 
    loading,
    hasRole, 
    hasAnyRole, 
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}; 