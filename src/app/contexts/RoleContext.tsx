import { createContext, useContext, ReactNode } from 'react';
import { useRole, Role } from '@/app/hooks/useRole';

interface RoleContextType {
  roles: Role[];
  loading: boolean;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  hasAllRoles: (roleNames: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const roleHook = useRole();

  return (
    <RoleContext.Provider value={roleHook}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}; 