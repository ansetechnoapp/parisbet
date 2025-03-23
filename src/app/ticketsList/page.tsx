'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, getTicketsByPhoneNumber } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Check if user has a stored phone number
    const storedPhoneNumber = typeof window !== 'undefined' ? localStorage.getItem('userPhoneNumber') : null;
    
    if (!storedPhoneNumber) {
      // If no phone number is stored, redirect to verify-phone
      router.push('/verify-phone');
      return;
    }
    
    setPhoneNumber(storedPhoneNumber);
    fetchTickets(storedPhoneNumber);
  }, [router]);
  
  const fetchTickets = async (phone: string) => { 
    try {
      // console.log('Fetching tickets for phone:', phone); // Debug log
      const data = await getTicketsByPhoneNumber(phone);
      // console.log('Supabase response:', data); // Debug log
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userPhoneNumber');
    router.push('/verify-phone');
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mes tickets</h1>
            {phoneNumber && (
              <div className="mt-2 md:mt-0 flex gap-4 items-center">
                <p className="text-sm text-gray-600">Numéro: <span className="font-medium">{phoneNumber}</span></p>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de vos tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-lg text-gray-600">Vous n&apos;avez pas encore de tickets.</p>
              <Link href="/" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                Jouer maintenant
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-800">{ticket.ticket_number}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{new Date(ticket.date).toLocaleString()}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="text-xl font-bold text-green-600">{ticket.amount} Fcfa</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Type: <span className="font-medium">{ticket.type}</span></p>
                        <div className="flex flex-wrap gap-2">
                          {ticket.numbers.map((num, index) => (
                            <div key={index} className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {ticket.status === 'won' && (
                        <div className="mt-4 md:mt-0 text-right">
                          <p className="text-sm text-gray-600">Gain:</p>
                          <p className="text-xl font-bold text-green-600">{ticket.amount * 140} Fcfa</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href={`/tickets/${ticket.id}`} className="text-green-600 text-sm hover:text-green-700 hover:underline">
                      Voir détails →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center space-y-2">
            <Link href="/find-ticket" className="block text-green-600 hover:text-green-700 transition-colors">
              Rechercher un ticket par ID
            </Link>
            <Link href="/" className="block text-green-600 hover:text-green-700 transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
