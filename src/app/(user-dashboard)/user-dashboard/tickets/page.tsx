'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase, Ticket } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function TicketsPage() {
  const { profile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (profile?.phone_number) {
      setPhoneNumber(profile.phone_number);
      fetchTickets(profile.phone_number);
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchTickets = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);

      const formattedPhone = phone.toString().trim().replace(/[^\d]/g, '');
      const { data, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .ilike('phone_number', `%${formattedPhone}%`)
        .order('date', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      fetchTickets(phoneNumber);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher vos tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Entrez votre numéro de téléphone"
              className="flex-1"
            />
            <Button type="submit">Rechercher</Button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro de ticket</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Numéros</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                      <TableCell>{formatDate(ticket.date)}</TableCell>
                      <TableCell>{ticket.type}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ticket.numbers.map((num, index) => (
                            <span key={index} className="inline-block bg-gray-100 rounded-full w-6 h-6 text-xs flex items-center justify-center">
                              {num}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.amount} FCFA</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun ticket trouvé pour ce numéro de téléphone.</p>
              <Link href="/Lotto">
                <Button>Jouer maintenant</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
