'use client';

import { useEffect, useState } from 'react';
import { Role, getUserRoles } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserRoleDisplayProps {
  userId: string;
}

export default function UserRoleDisplay({ userId }: UserRoleDisplayProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const userRoles = await getUserRoles(userId);
        setRoles(userRoles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rôles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  if (loading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-md"></div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  // Extraire toutes les permissions uniques de tous les rôles
  const allPermissions = [...new Set(roles.flatMap(role => role.permissions))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rôles et permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Rôles:</h3>
            <div className="flex flex-wrap gap-2">
              {roles.length > 0 ? (
                roles.map(role => (
                  <Badge key={role.id} variant="outline" className="capitalize">
                    {role.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Aucun rôle attribué</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Permissions:</h3>
            <div className="flex flex-wrap gap-2">
              {allPermissions.length > 0 ? (
                allPermissions.map(permission => (
                  <Badge key={permission} variant="secondary" className="text-xs">
                    {permission}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Aucune permission</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
