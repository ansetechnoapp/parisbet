'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface User {
    id: string;
    email: string;
    user_profiles: {
        first_name: string;
        last_name: string;
        city: string;
        neighborhood: string;
        country: string;
        account_balance: number;
    };
    created_at: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [balanceAdjustment, setBalanceAdjustment] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select(`
                    *,
                    user:user_id (
                        id,
                        email,
                        created_at
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec de récupération des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleBalanceAdjustment = async () => {
        if (!selectedUser || !balanceAdjustment) return;

        try {
            const adjustment = parseFloat(balanceAdjustment);
            const newBalance = selectedUser.user_profiles.account_balance + adjustment;

            const { error } = await supabase
                .from('user_profiles')
                .update({
                    account_balance: newBalance,
                })
                .eq('user_id', selectedUser.id);

            if (error) throw error;

            // Create a transaction record for the adjustment
            const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    user_id: selectedUser.id,
                    type: adjustment > 0 ? 'top_up' : 'withdrawal',
                    amount: Math.abs(adjustment),
                    status: 'approved',
                    admin_notes: 'Ajustement de solde par l\'administrateur',
                });

            if (transactionError) throw transactionError;

            setShowDialog(false);
            setBalanceAdjustment('');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec de l\'ajustement du solde');
        }
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.user_profiles.first_name.toLowerCase().includes(searchLower) ||
            user.user_profiles.last_name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
                <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Solde</TableHead>
                            <TableHead>Inscription</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    {user.user_profiles.first_name} {user.user_profiles.last_name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.user_profiles.city}, {user.user_profiles.neighborhood}
                                    <br />
                                    <span className="text-sm text-gray-500">{user.user_profiles.country}</span>
                                </TableCell>
                                <TableCell>{user.user_profiles.account_balance.toFixed(2)} FCFA</TableCell>
                                <TableCell>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowDialog(true);
                                        }}
                                    >
                                        Ajuster le solde
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajuster le solde de l&apos;utilisateur</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div>
                                <Label>Détails de l&apos;utilisateur</Label>
                                <div className="mt-2 space-y-2">
                                    <p><strong>Nom:</strong> {selectedUser.user_profiles.first_name} {selectedUser.user_profiles.last_name}</p>
                                    <p><strong>Solde actuel:</strong> {selectedUser.user_profiles.account_balance.toFixed(2)} FCFA</p>
                                </div>
                            </div>
                            <div>
                                <Label>Ajustement du solde (FCFA)</Label>
                                <Input
                                    type="number"
                                    value={balanceAdjustment}
                                    onChange={(e) => setBalanceAdjustment(e.target.value)}
                                    placeholder="Saisir le montant (positif pour ajouter, négatif pour déduire)"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDialog(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleBalanceAdjustment}
                                    disabled={!balanceAdjustment}
                                >
                                    Appliquer l&apos;ajustement
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}