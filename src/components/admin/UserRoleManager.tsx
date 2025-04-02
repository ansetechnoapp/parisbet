'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAllRoles, updateUserRoles, syncUserMetadataRole } from '@/lib/auth';
import { Role } from '@/lib/auth';

interface UserRoleManagerProps {
  userId: string;
  currentRoles: string[];
  onUpdate?: (roles: string[]) => void;
}

export default function UserRoleManager({ 
  userId, 
  currentRoles = [], 
  onUpdate 
}: UserRoleManagerProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Charger tous les rôles disponibles
    const fetchRoles = async () => {
      try {
        const roles = await getAllRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error("Erreur lors du chargement des rôles");
      }
    };
    
    fetchRoles();
  }, []);
  
  const handleRoleToggle = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserRoles(userId, selectedRoles);
      
      // La fonction updateUserRoles appelle déjà syncUserMetadataRole
      
      if (onUpdate) {
        onUpdate(selectedRoles);
      }
      
      toast.success("Rôles mis à jour avec succès");
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error("Erreur lors de la mise à jour des rôles");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Gestion des rôles</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {availableRoles.map(role => (
          <div key={role.id} className="flex items-center space-x-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoles.includes(role.name)}
              onCheckedChange={() => handleRoleToggle(role.name)}
            />
            <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
              {role.name}
            </Label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        <p>Permissions incluses dans les rôles sélectionnés:</p>
        <ul className="list-disc pl-5 mt-1">
          {availableRoles
            .filter(role => selectedRoles.includes(role.name))
            .flatMap(role => role.permissions)
            .filter((permission, index, self) => self.indexOf(permission) === index)
            .map(permission => (
              <li key={permission}>{permission}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
