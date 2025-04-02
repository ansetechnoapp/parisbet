'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getAllRoles, createRole, updateRolePermissions, Role } from '@/lib/auth';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissions, setNewPermissions] = useState('');
  const [editPermissions, setEditPermissions] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getAllRoles();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rôles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Le nom du rôle est requis');
      return;
    }

    try {
      const permissions = newPermissions
        .split(',')
        .map(p => p.trim())
        .filter(p => p);

      await createRole(newRoleName, permissions);
      await fetchRoles();
      setShowCreateDialog(false);
      setNewRoleName('');
      setNewPermissions('');
      toast.success('Rôle créé avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création du rôle');
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;

    try {
      const permissions = editPermissions
        .split(',')
        .map(p => p.trim())
        .filter(p => p);

      await updateRolePermissions(selectedRole.id, permissions);
      await fetchRoles();
      setShowEditDialog(false);
      setSelectedRole(null);
      setEditPermissions('');
      toast.success('Permissions mises à jour avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des permissions');
    }
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setEditPermissions(role.permissions.join(', '));
    setShowEditDialog(true);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestion des Rôles</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          Créer un nouveau rôle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rôles disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(role)}>
                      Modifier les permissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog pour créer un nouveau rôle */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau rôle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Nom du rôle</Label>
              <Input
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Exemple: premium_user"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions (séparées par des virgules)</Label>
              <Input
                id="permissions"
                value={newPermissions}
                onChange={(e) => setNewPermissions(e.target.value)}
                placeholder="Exemple: view_matches, place_bets, access_premium_odds"
              />
              <p className="text-sm text-gray-500">
                Entrez les permissions séparées par des virgules. Utilisez 'all' pour accorder toutes les permissions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateRole}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier les permissions d'un rôle */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les permissions du rôle {selectedRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editPermissions">Permissions (séparées par des virgules)</Label>
              <Input
                id="editPermissions"
                value={editPermissions}
                onChange={(e) => setEditPermissions(e.target.value)}
                placeholder="Exemple: view_matches, place_bets, access_premium_odds"
              />
              <p className="text-sm text-gray-500">
                Entrez les permissions séparées par des virgules. Utilisez 'all' pour accorder toutes les permissions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
