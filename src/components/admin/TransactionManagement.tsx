'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Transaction {
    id: string;
    user_id: string;
    type: 'top_up' | 'withdrawal';
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    payment_method?: string;
    payment_proof_url?: string;
    admin_notes?: string;
    user: {
        email: string;
        user_profiles: {
            first_name: string;
            last_name: string;
        };
    };
}

export default function TransactionManagement() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    user:user_id (
                        email,
                        user_profiles (
                            first_name,
                            last_name
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Échec de récupération des transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (transactionId: string, newStatus: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('transactions')
                .update({
                    status: newStatus,
                    admin_notes: adminNotes,
                })
                .eq('id', transactionId);

            if (error) throw error;

            setShowDialog(false);
            setAdminNotes('');
            fetchTransactions();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Échec de mise à jour du statut de la transaction");
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Transactions</h2>
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {transaction.user.user_profiles.first_name} {transaction.user.user_profiles.last_name}
                                    <br />
                                    <span className="text-sm text-gray-500">{transaction.user.email}</span>
                                </TableCell>
                                <TableCell className="capitalize">{transaction.type}</TableCell>
                                <TableCell>{transaction.amount.toFixed(2)} FCFA</TableCell>
                                <TableCell className="capitalize">{transaction.status}</TableCell>
                                <TableCell>
                                    {transaction.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setShowDialog(true);
                                                }}
                                            >
                                                Examiner
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Examiner la Transaction</DialogTitle>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="space-y-4">
                            <div>
                                <Label>Détails de la Transaction</Label>
                                <div className="mt-2 space-y-2">
                                    <p><strong>Utilisateur:</strong> {selectedTransaction.user.user_profiles.first_name} {selectedTransaction.user.user_profiles.last_name}</p>
                                    <p><strong>Type:</strong> {selectedTransaction.type}</p>
                                    <p><strong>Montant:</strong> {selectedTransaction.amount.toFixed(2)} FCFA</p>
                                    {selectedTransaction.payment_method && (
                                        <p><strong>Méthode de paiement:</strong> {selectedTransaction.payment_method}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>Notes d&apos;administration</Label>
                                <Input
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Saisir des notes concernant cette transaction"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(selectedTransaction.id, 'rejected')}
                                >
                                    Rejeter
                                </Button>
                                <Button
                                    onClick={() => handleStatusUpdate(selectedTransaction.id, 'approved')}
                                >
                                    Approuver
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}