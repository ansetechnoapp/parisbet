'use client';

import { useState, useEffect } from 'react';
import { supabase, Ticket, FootballBet, Transaction } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/ui/page-transition';

export default function UserDashboardPage() {
  const { user, profile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [bets, setBets] = useState<FootballBet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Charger le profil utilisateur si ce n'est pas déjà fait
        if (!profile) {
          await useUserStore.getState().loadProfile();
        }

        // Charger les transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData);

        // Charger les tickets (si l'utilisateur a un numéro de téléphone dans son profil)
        if (profile?.phone_number) {
          const { data: ticketsData, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .eq('phone_number', profile.phone_number)
            .order('created_at', { ascending: false })
            .limit(5);

          if (ticketsError) throw ticketsError;
          setTickets(ticketsData || []);
        }

        // Charger les paris de football
        if (profile?.phone_number) {
          const { data: betsData, error: betsError } = await supabase
            .from('football_bets')
            .select('*')
            .eq('phone_number', profile.phone_number)
            .order('created_at', { ascending: false })
            .limit(5);

          if (betsError) throw betsError;
          setBets(betsData || []);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        {/* Bienvenue et solde */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bienvenue, {profile?.first_name || 'Utilisateur'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <p className="text-gray-600">Votre solde actuel</p>
                <p className="text-3xl font-bold text-green-600">{profile?.account_balance?.toFixed(2) || '0.00'} FCFA</p>
              </div>
              <div className="flex gap-2">
                <Link href="/user-dashboard/wallet">
                  <Button variant="outline">Gérer mon portefeuille</Button>
                </Link>
                <Link href="/soccer">
                  <Button>Parier maintenant</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résumé des activités */}
        <StaggerChildren>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mes tickets récents</CardTitle>
                </CardHeader>
                <CardContent>
                  {tickets.length > 0 ? (
                    <div className="space-y-2">
                      {tickets.slice(0, 3).map((ticket) => (
                        <div key={ticket.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{ticket.ticket_number}</span>
                            <span className={`text-sm ${ticket.status === 'won' ? 'text-green-600' :
                              ticket.status === 'lost' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                              {ticket.status === 'won' ? 'Gagné' :
                                ticket.status === 'lost' ? 'Perdu' : 'En attente'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(ticket.date)}
                          </div>
                        </div>
                      ))}
                      <Link href="/user-dashboard/tickets" className="text-sm text-green-600 hover:underline block mt-4">
                        Voir tous mes tickets →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun ticket récent</p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mes paris récents</CardTitle>
                </CardHeader>
                <CardContent>
                  {bets.length > 0 ? (
                    <div className="space-y-2">
                      {bets.slice(0, 3).map((bet) => (
                        <div key={bet.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{bet.matches.length} match{bet.matches.length > 1 ? 'es' : ''}</span>
                            <span className={`text-sm ${bet.status === 'won' ? 'text-green-600' :
                              bet.status === 'lost' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                              {bet.status === 'won' ? 'Gagné' :
                                bet.status === 'lost' ? 'Perdu' : 'En attente'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Mise: {bet.stake} FCFA
                          </div>
                        </div>
                      ))}
                      <Link href="/user-dashboard/bets" className="text-sm text-green-600 hover:underline block mt-4">
                        Voir tous mes paris →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun pari récent</p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transactions récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-2">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium capitalize">{transaction.type === 'top_up' ? 'Recharge' : 'Retrait'}</span>
                            <span className={`text-sm ${transaction.status === 'approved' ? 'text-green-600' :
                              transaction.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                              {transaction.status === 'approved' ? 'Approuvé' :
                                transaction.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.amount} FCFA
                          </div>
                        </div>
                      ))}
                      <Link href="/user-dashboard/wallet" className="text-sm text-green-600 hover:underline block mt-4">
                        Voir toutes mes transactions →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune transaction récente</p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          </div>
        </StaggerChildren>

        {/* Actions rapides */}
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/soccer">
                  <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Parier</span>
                  </Button>
                </Link>
                <Link href="/Lotto">
                  <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span>Jouer au Loto</span>
                  </Button>
                </Link>
                <Link href="/user-dashboard/wallet">
                  <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Recharger</span>
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="outline" className="w-full h-full py-6 flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Résultats</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </div>
    </PageTransition>
  );
}
