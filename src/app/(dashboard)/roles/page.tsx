'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import RoleManagement from '@/components/admin/RoleManagement';

export default function RolesPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && !isAdmin) {
      router.push('/unauthorized');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Le useEffect redirigera l'utilisateur
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Rôles</h1>
      <RoleManagement />
    </div>
  );
}
