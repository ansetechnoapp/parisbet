import { ReactNode } from 'react';
import { useRole } from '@/app/hooks/useRole';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles = [],
  allowedPermissions = [],
  requireAll = false,
  fallback = <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600">Accès Refusé</h1>
      <p className="mt-2 text-gray-600">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  </div>,
  redirectTo
}: RoleGuardProps) => {
  const {
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    loading
  } = useRole();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const hasRoleAccess = allowedRoles.length > 0
    ? (requireAll ? hasAllRoles(allowedRoles) : hasAnyRole(allowedRoles))
    : true;

  const hasPermissionAccess = allowedPermissions.length > 0
    ? (requireAll ? hasAllPermissions(allowedPermissions) : hasAnyPermission(allowedPermissions))
    : true;

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  if (!hasAccess) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}; 