'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Transaction {
    id: string;
    type: 'top_up' | 'withdrawal';
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    payment_method?: string;
}

export default function Wallet() {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTopUpDialog, setShowTopUpDialog] = useState(false);
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('account_balance')
                .eq('user_id', user.id)
                .single();

            if (profileError) throw profileError;
            setBalance(profile.account_balance);

            // Fetch transactions
            const { data: transactions, error: transactionsError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (transactionsError) throw transactionsError;
            setTransactions(transactions || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec de récupération des données utilisateur');
        } finally {
            setLoading(false);
        }
    };

    const handleTopUp = async () => {
        if (!topUpAmount || !selectedPaymentMethod) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    type: 'top_up',
                    amount: parseFloat(topUpAmount),
                    status: 'pending',
                    payment_method: selectedPaymentMethod,
                });

            if (transactionError) throw transactionError;

            // Reset form and close dialog
            setTopUpAmount('');
            setSelectedPaymentMethod('');
            setShowTopUpDialog(false);
            fetchUserData(); // Refresh data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec du traitement de la demande de recharge');
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount) {
            setError('Veuillez saisir un montant');
            return;
        }

        const amount = parseFloat(withdrawAmount);
        if (amount <= 0) {
            setError('Le montant doit être supérieur à 0');
            return;
        }

        if (amount > balance) {
            setError('Solde insuffisant');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    type: 'withdrawal',
                    amount: amount,
                    status: 'pending',
                });

            if (transactionError) throw transactionError;

            // Reset form and close dialog
            setWithdrawAmount('');
            setShowWithdrawDialog(false);
            fetchUserData(); // Refresh data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Échec du traitement de la demande de retrait');
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Votre Portefeuille</h2>
                <div className="text-3xl font-bold text-green-600 mb-4">
                    {balance.toFixed(2)} FCFA
                </div>
                <div className="flex space-x-4">
                    <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
                        <DialogTrigger asChild>
                            <Button>Recharger</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Recharger votre compte</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Montant (FCFA)</Label>
                                    <Input
                                        type="number"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                        placeholder="Saisir le montant"
                                    />
                                </div>
                                <div>
                                    <Label>Méthode de paiement</Label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={selectedPaymentMethod}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    >
                                        <option value="">Sélectionner une méthode de paiement</option>
                                        <option value="MTN">MTN</option>
                                        <option value="Moov">Moov</option>
                                        <option value="Celtis">Celtis</option>
                                    </select>
                                </div>
                                <Button onClick={handleTopUp}>Valider</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Retirer</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Retirer des fonds</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Montant (FCFA)</Label>
                                    <Input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Saisir le montant"
                                    />
                                </div>
                                <Button onClick={handleWithdraw}>Valider</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Historique des transactions</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="capitalize">{transaction.type}</TableCell>
                                <TableCell>{transaction.amount.toFixed(2)} FCFA</TableCell>
                                <TableCell className="capitalize">{transaction.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}