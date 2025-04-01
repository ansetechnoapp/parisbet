import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export const RouteGuard = ({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = []
}: RouteGuardProps) => {
  const router = useRouter();
  const { user, roles, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Vérifier les permissions requises
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      router.push('/unauthorized');
      return null;
    }
  }

  // Vérifier les rôles requis
  if (requiredRoles.length > 0) {
    const userRoleNames = roles.map(role => role.name);
    const hasRequiredRole = requiredRoles.some(role => 
      userRoleNames.includes(role)
    );

    if (!hasRequiredRole) {
      router.push('/unauthorized');
      return null;
    }
  }

  return <>{children}</>;
}; 