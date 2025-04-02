import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserRole {
  role_id: string;
  roles: Role;
}

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.role === 'admin';
};

export const getRedirectPath = (user: User | null): string => {
  if (!user) return '/';
  return isAdmin(user) ? '/Overview' : '/user-dashboard';
};

export const getUserRoles = async (userId: string): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles (
        id,
        name,
        permissions
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map(item => item.roles as unknown as Role) || [];
};

export const hasPermission = async (userId: string, permission: string): Promise<boolean> => {
  const roles = await getUserRoles(userId);
  return roles.some(role =>
    role.permissions.includes('all') || role.permissions.includes(permission)
  );
};

export const assignRole = async (userId: string, roleName: string): Promise<void> => {
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (roleError) throw roleError;

  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role_id: role.id });

  if (error) throw error;
};

export const removeRole = async (userId: string, roleName: string): Promise<void> => {
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (roleError) throw roleError;

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .match({ user_id: userId, role_id: role.id });

  if (error) throw error;
};

export const updateUserRoles = async (userId: string, roleNames: string[]): Promise<void> => {
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('id')
    .in('name', roleNames);

  if (rolesError) throw rolesError;

  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (roles && roles.length > 0) {
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert(roles.map(role => ({
        user_id: userId,
        role_id: role.id
      })));

    if (insertError) throw insertError;
  }
};