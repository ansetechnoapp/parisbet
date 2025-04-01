'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase, Ticket, FootballBet } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { PageTransition, StaggerChildren, StaggerItem } from '@/components/ui/page-transition';

interface Activity {
  id: string;
  created_at: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  status: string;
  originalData?: unknown;
}

export default function ActivityPage() {
  const { profile } = useUserStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchActivities = useCallback(async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      // Récupérer les transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // Récupérer les notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // Récupérer les paris et tickets si l'utilisateur a un numéro de téléphone
      let bets: FootballBet[] = [];
      let tickets: Ticket[] = [];

      if (profile?.phone_number) {
        const { data: betsData } = await supabase
          .from('football_bets')
          .select('*')
          .ilike('phone_number', `%${profile.phone_number}%`)
          .order('created_at', { ascending: false });

        const { data: ticketsData } = await supabase
          .from('tickets')
          .select('*')
          .ilike('phone_number', `%${profile.phone_number}%`)
          .order('created_at', { ascending: false });

        bets = betsData || [];
        tickets = ticketsData || [];
      }

      // Transformer les données en format unifié
      const transactionItems: Activity[] = (transactions || []).map(transaction => ({
        id: transaction.id,
        type: 'transaction',
        title: transaction.type === 'top_up' ? 'Recharge' : 'Retrait',
        description: `${transaction.type === 'top_up' ? 'Recharge' : 'Retrait'} de ${transaction.amount} FCFA`,
        status: transaction.status,
        created_at: transaction.created_at,
        amount: transaction.amount,
        originalData: transaction
      }));

      const betItems: Activity[] = (bets || []).map(bet => ({
        id: bet.id,
        type: 'bet',
        title: `Pari sur ${bet.matches.length} match${bet.matches.length > 1 ? 'es' : ''}`,
        description: `Mise: ${bet.stake} FCFA, Gain potentiel: ${bet.potential_winnings} FCFA`,
        status: bet.status,
        created_at: bet.created_at,
        amount: bet.stake,
        originalData: bet
      }));

      const ticketItems: Activity[] = (tickets || []).map(ticket => ({
        id: ticket.id,
        type: 'ticket',
        title: `Ticket ${ticket.ticket_number}`,
        description: `Type: ${ticket.type}, Numéros: ${ticket.numbers.join(', ')}`,
        status: ticket.status,
        created_at: ticket.created_at,
        amount: ticket.amount,
        originalData: ticket
      }));

      const notificationItems: Activity[] = (notifications || []).map(notification => ({
        id: notification.id,
        type: 'notification',
        title: notification.title,
        description: notification.message,
        status: notification.is_read ? 'read' : 'unread',
        created_at: notification.created_at,
        originalData: notification
      }));

      // Combiner toutes les activités
      let allActivities = [
        ...transactionItems,
        ...betItems,
        ...ticketItems,
        ...notificationItems
      ];

      // Filtrer selon l'onglet actif
      if (activeTab !== 'all') {
        allActivities = allActivities.filter(activity => activity.type === activeTab);
      }

      // Trier par date
      allActivities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, activeTab, profile?.phone_number]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getStatusBadge = (activity: Activity) => {
    let color = '';
    let label = '';

    switch (activity.status) {
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800';
        label = 'En attente';
        break;
      case 'approved':
        color = 'bg-green-100 text-green-800';
        label = 'Approuvé';
        break;
      case 'rejected':
        color = 'bg-red-100 text-red-800';
        label = 'Rejeté';
        break;
      case 'won':
        color = 'bg-green-100 text-green-800';
        label = 'Gagné';
        break;
      case 'lost':
        color = 'bg-red-100 text-red-800';
        label = 'Perdu';
        break;
      case 'unread':
        color = 'bg-blue-100 text-blue-800';
        label = 'Non lu';
        break;
      case 'read':
        color = 'bg-gray-100 text-gray-800';
        label = 'Lu';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
        label = activity.status;
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
        {label}
      </span>
    );
  };

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
        <h1 className="text-2xl font-bold">Historique d&apos;activité</h1>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="transaction">Transactions</TabsTrigger>
            <TabsTrigger value="bet">Paris</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
            <TabsTrigger value="notification">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {activities.length > 0 ? (
              <StaggerChildren>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <StaggerItem key={`${activity.type}-${activity.id}`}>
                      <Card key={`${activity.type}-${activity.id}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{activity.title}</h3>
                                {getStatusBadge(activity)}
                              </div>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                            </div>
                            {activity.amount !== undefined && (
                              <div className="text-right">
                                <span className="font-medium text-green-600">{activity.amount} FCFA</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerChildren>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Aucune activité trouvée</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
