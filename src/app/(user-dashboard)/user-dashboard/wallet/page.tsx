'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase, Transaction } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';

export default function WalletPage() {
  const { user, profile, loadProfile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Charger le profil utilisateur si ce n'est pas déjà fait
      if (!profile) {
        await loadProfile();
      }

      // Charger les transactions
      const { data, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [user, profile, loadProfile]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleTopUp = async () => {
    if (!topUpAmount || !selectedPaymentMethod) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (!user) throw new Error('Utilisateur non connecté');

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

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setTopUpAmount('');
      setSelectedPaymentMethod('');
      setShowTopUpDialog(false);
      toast.success('Demande de recharge envoyée avec succès');
      fetchUserData(); // Actualiser les données
    } catch (err) {
      console.error('Error processing top-up:', err);
      setError(err instanceof Error ? err.message : 'Échec du traitement de la demande de recharge');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      setError('Veuillez saisir un montant');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Veuillez saisir un montant valide');
      return;
    }

    if (profile && amount > profile.account_balance) {
      setError('Solde insuffisant');
      return;
    }

    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          status: 'pending',
        });

      if (transactionError) throw transactionError;

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setWithdrawAmount('');
      setShowWithdrawDialog(false);
      toast.success('Demande de retrait envoyée avec succès');
      fetchUserData(); // Actualiser les données
    } catch (err) {
      console.error('Error processing withdrawal:', err);
      setError(err instanceof Error ? err.message : 'Échec du traitement de la demande de retrait');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mon Portefeuille</h1>

      <Card>
        <CardHeader>
          <CardTitle>Solde du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-gray-600">Votre solde actuel</p>
              <p className="text-3xl font-bold text-green-600">{profile?.account_balance?.toFixed(2) || '0.00'} FCFA</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
                <DialogTrigger asChild>
                  <Button>Recharger</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recharger votre compte</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="topUpAmount">Montant (FCFA)</Label>
                      <Input
                        id="topUpAmount"
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Saisir le montant"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                      <select
                        id="paymentMethod"
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Sélectionner une méthode</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="bank_transfer">Virement bancaire</option>
                        <option value="cash">Espèces</option>
                      </select>
                    </div>
                    <Button onClick={handleTopUp} className="w-full">Soumettre la demande</Button>
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
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="withdrawAmount">Montant (FCFA)</Label>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Saisir le montant"
                      />
                    </div>
                    <Button onClick={handleWithdraw} className="w-full">Soumettre la demande</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      {transaction.type === 'top_up' ? 'Recharge' : 'Retrait'}
                    </TableCell>
                    <TableCell>{transaction.amount.toFixed(2)} FCFA</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'approved' ? 'Approuvé' : 
                         transaction.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.payment_method || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">Aucune transaction trouvée</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
