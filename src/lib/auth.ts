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

export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  // Vérifier d'abord les métadonnées de l'utilisateur
  if (user.user_metadata?.role === 'admin') return true;

  // Ensuite vérifier la table user_roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles (name)')
    .eq('user_id', user.id)
    .single();

  // Vérifier si l'utilisateur a un rôle admin
  return userRoles?.roles?.name === 'admin';
};

export const getRedirectPath = async (user: User | null): Promise<string> => {
  if (!user) return '/';
  return (await isAdmin(user)) ? '/Overview' : '/user-dashboard';
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

// Get all roles from the database
export const getAllRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*');

  if (error) throw error;
  return data || [];
};

// Create a new role
export const createRole = async (name: string, permissions: string[]): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .insert([{ name, permissions }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update role permissions
export const updateRolePermissions = async (roleId: string, permissions: string[]): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .update({ permissions })
    .eq('id', roleId)
    .select()
    .single();

  if (error) throw error;
  return data;
};